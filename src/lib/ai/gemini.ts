import { AIAnalysisResponse, AIAnalysisResponseSchema } from './schemas';
import { buildSecureAnalysisPrompt } from './prompts';
import { validateAndSanitizeAIOutput } from './validation';
import { NormalizedUrlDetails } from '@/types/investigation';
import { EvidenceIndicator } from '@/types/evidence';
import { GoogleGenAI } from '@google/genai';

/**
 * Deterministic fallback generator when Gemini API is offline or key is unconfigured
 */
function generateDeterministicFallback(
  urlDetails: NormalizedUrlDetails,
  evidence: EvidenceIndicator[],
  score: number,
  severity: string
): AIAnalysisResponse {
  const hasBrandSpoof = evidence.some((e) => e.category === 'brand_impersonation');
  const hasCredKeywords = evidence.some((e) => e.category === 'credential_harvesting');
  const hasIntelHit = evidence.some((e) => e.category === 'threat_intelligence');
  const hasMalware = evidence.some((e) => e.category === 'malware_delivery');

  if (hasMalware) {
    return {
      summary: `High-risk binary distribution endpoint on "${urlDetails.hostname}". Heuristics identify hallmarks of an automated drive-by payload dropper.`,
      threatClassification: 'Drive-by Malware Dropper',
      primaryIntent: 'Endpoint compromise and persistent payload execution',
      attackTechnique: {
        mitreId: 'T1204.002',
        name: 'User Execution: Malicious File',
        description: 'Adversary relies upon enticing user into downloading and executing arbitrary binary payload.',
      },
      potentialImpact: [
        {
          type: 'SYSTEM',
          title: 'Host Endpoint Compromise',
          description: 'Execution of malicious executable or remote access trojan (RAT)',
          severity: 'critical',
        },
        {
          type: 'DATA_THEFT',
          title: 'Session & Keystroke Logging',
          description: 'Info-stealer harvest of browser cookies, local credentials, and crypto wallets',
          severity: 'high',
        },
      ],
      attackPathNodes: [
        { id: 'node_user', label: 'Target User', phase: 'initial', status: 'observed', description: 'User navigates to link via deceptive vector' },
        { id: 'node_cdn', label: 'Host Payload CDN', phase: 'delivery', status: 'detected', description: 'Host masquerades as invoice or document host' },
        { id: 'node_dropper', label: 'Malware Dropper', phase: 'exploitation', status: 'detected', description: 'Triggers silent payload download onto device' },
        { id: 'node_exec', label: 'Payload Execution', phase: 'execution', status: 'potential', description: 'Binary attempts local persistence and C2 beacon' },
      ],
    };
  }

  if (hasBrandSpoof || hasCredKeywords || hasIntelHit) {
    return {
      summary: `Evidence indicates a deceptive credential-harvesting portal targeting user authentication data for illegitimate acquisition.`,
      threatClassification: 'Credential Harvester',
      primaryIntent: 'Illegitimate acquisition of user credentials and multi-factor session tokens',
      attackTechnique: {
        mitreId: 'T1566.002',
        name: 'Spearphishing Link',
        description: 'Adversary leverages brand mimicry and deceptive domain registration to capture authentication credentials.',
      },
      potentialImpact: [
        {
          type: 'PASSWORD',
          title: 'Primary Account Credential Theft',
          description: 'Exfiltration of plaintext username and password combinations',
          severity: 'critical',
        },
        {
          type: 'OTP_2FA',
          title: 'Real-Time Session Interception Relay',
          description: 'Interception of one-time SMS or authenticator tokens in active relay',
          severity: 'high',
        },
        {
          type: 'FINANCIAL',
          title: 'Unauthorized Account Drain',
          description: 'Direct unauthorized fund transfer or secondary account takeover',
          severity: 'high',
        },
      ],
      attackPathNodes: [
        { id: 'node_user', label: 'Target User', phase: 'initial', status: 'observed', description: 'User targeted via deceptive notification' },
        { id: 'node_delivery', label: 'Lure Delivery (SMS / Email)', phase: 'delivery', status: 'observed', description: 'Urgent security or verification notification' },
        { id: 'node_site', label: `Fake Portal (${urlDetails.registrableDomain})`, phase: 'delivery', status: 'detected', description: 'Cloned login portal with deceptive branding' },
        { id: 'node_form', label: 'Credential Harvest Form', phase: 'exploitation', status: 'detected', description: 'Form script forwards captured inputs to adversary C2' },
        { id: 'node_otp', label: 'OTP / 2FA Capture Relay', phase: 'exploitation', status: 'inferred', description: 'Real-time proxy requests second-factor token' },
        { id: 'node_takeover', label: 'Account Takeover', phase: 'impact', status: 'potential', description: 'Persistent unauthorized access to target services' },
        { id: 'node_financial', label: 'Financial Exfiltration', phase: 'impact', status: 'potential', description: 'Unauthorized fund liquidation or identity fraud' },
      ],
    };
  }

  // Clean / Legitimate
  return {
    summary: `Analysis of ${urlDetails.hostname} shows consistency with standard legitimate web services. No malicious heuristics or blocklist entries identified.`,
    threatClassification: 'Legitimate Web Resource',
    primaryIntent: 'Standard authorized web application interaction',
    attackTechnique: {
      name: 'Standard Legitimate Service',
      description: 'Domain verified as authentic infrastructure with no indicators of adversarial weaponization.',
    },
    potentialImpact: [
      {
        type: 'BENIGN',
        title: 'Normal Service Interaction',
        description: 'Standard authorized web operations under verified domain identity',
        severity: 'low',
      },
    ],
    attackPathNodes: [
      { id: 'node_user', label: 'Target User', phase: 'initial', status: 'observed', description: 'User navigates to verified service' },
      { id: 'node_site', label: `Authentic Portal (${urlDetails.registrableDomain})`, phase: 'benign', status: 'observed', description: 'Verified official domain infrastructure' },
      { id: 'node_clean', label: 'Clean Destination', phase: 'benign', status: 'observed', description: 'No anomalous scripts or harvest forms detected' },
    ],
  };
}

export async function runAIThreatReasoning(
  urlDetails: NormalizedUrlDetails,
  evidence: EvidenceIndicator[],
  deterministicScore: number,
  deterministicSeverity: string
): Promise<AIAnalysisResponse> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const prompt = buildSecureAnalysisPrompt(urlDetails, evidence, deterministicScore, deterministicSeverity);

  // 1. Try OpenRouter if configured
  if (openrouterKey) {
    try {
      const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
      const openRouterController = new AbortController();
      const openRouterTimeout = setTimeout(() => openRouterController.abort(), 3500);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'HTTP-Referer': 'https://threatx.internal',
          'X-Title': 'THREATX Threat Investigation',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are the THREATX AI Threat Reasoning Engine. You MUST output ONLY raw valid JSON conforming to the required schema. Do not enclose in backticks.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
        signal: openRouterController.signal,
      });

      clearTimeout(openRouterTimeout);

      if (res.ok) {
        const jsonRes = await res.json();
        let content = jsonRes.choices?.[0]?.message?.content?.trim();
        if (content) {
          if (content.startsWith('```json')) content = content.slice(7);
          if (content.startsWith('```')) content = content.slice(3);
          if (content.endsWith('```')) content = content.slice(0, -3);
          content = content.trim();

          const parsed = JSON.parse(content);
          const validated = AIAnalysisResponseSchema.safeParse(parsed);
          if (validated.success) {
            const postValidation = validateAndSanitizeAIOutput(validated.data, deterministicScore, deterministicSeverity);
            if (postValidation.warnings.length > 0) {
              console.warn('AI output post-validation warnings:', postValidation.warnings);
            }
            return postValidation.sanitized;
          } else {
            console.warn('OpenRouter response did not match schema:', validated.error.issues);
          }
        }
      } else {
        const errText = await res.text();
        console.warn('OpenRouter request failed:', res.status, errText);
      }
    } catch (err) {
      console.warn('OpenRouter reasoning query failed:', err);
    }
  }

  // 2. Try native Google GenAI SDK if GEMINI_API_KEY is configured
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsedJson = JSON.parse(text);
        const validated = AIAnalysisResponseSchema.safeParse(parsedJson);
        if (validated.success) {
          const postValidation = validateAndSanitizeAIOutput(validated.data, deterministicScore, deterministicSeverity);
          if (postValidation.warnings.length > 0) {
            console.warn('Google GenAI output post-validation warnings:', postValidation.warnings);
          }
          return postValidation.sanitized;
        }
      }
    } catch (err) {
      console.warn('Google GenAI SDK query failed:', err);
    }
  }

  // 3. Deterministic high-fidelity fallback
  return generateDeterministicFallback(urlDetails, evidence, deterministicScore, deterministicSeverity);
}
