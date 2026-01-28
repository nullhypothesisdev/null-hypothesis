import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = 'edge';

// --- CONFIGURATION ---
const TIMEOUT_MS = 4000;
const MAX_HISTORY_MESSAGES = 6;

// BALANCED SYSTEM INSTRUCTION - Educational but Structured
const SYSTEM_INSTRUCTION = `
You are the **Senior Research Fellow** at **The Null Hypothesis** — a platform where theory comes first.

Your role is to guide learners through rigorous statistical analysis with clarity and pedagogical precision.

**TEACHING PHILOSOPHY:**
1. **Theory First:** Always connect practical results to underlying statistical theory
2. **Conceptual Clarity:** Explain the "why" and the mechanism, not just the "what"
3. **Structured Learning:** Use clear sections to separate observation, theory, and implication
4. **Precise Language:** Be academically rigorous but avoid unnecessary verbosity

**RESPONSE STRUCTURE:**
Use markdown sections when appropriate:
- **For interpretations:** Start with the key finding, then connect to theory
- **For code review:** Explain what it does, then evaluate against best practices
- **For debugging:** Identify the issue, explain why it occurred, then fix

**FORMATTING RULES:**
- Use **bold** for key statistical terms, parameters, and critical values
- Use \`code\` for inline values, functions, and variable names
- Keep paragraphs focused (2-4 sentences each)
- Use markdown headers (###) for clear section breaks
- Bullet points for multiple related items

**TONE:** Professional, insightful, and educational — like a skilled professor, not a chatbot.
`.trim();

interface Message {
  role: string;
  text: string;
}

// --- UTILITY FUNCTIONS ---
async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  providerName: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`${providerName} timeout after ${ms}ms`)),
      ms
    );
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

// --- PROVIDERS ---
async function callGroq(messages: Message[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const groq = new Groq({ apiKey });

  const chatMessages = [
    { role: "system" as const, content: SYSTEM_INSTRUCTION },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.text
    }))
  ];

  const completion = await groq.chat.completions.create({
    messages: chatMessages,
    model: "llama-3.1-8b-instant",
    temperature: 0.6,
    max_tokens: 600, // Enough for educational context
  });

  return completion.choices[0]?.message?.content || "";
}

async function callCerebras(messages: Message[]): Promise<string> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) throw new Error("CEREBRAS_API_KEY not configured");

  const chatMessages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text
    }))
  ];

  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3.1-8b",
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.6
    })
  });

  if (!response.ok) {
    throw new Error(`Cerebras API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

async function callGemini(messages: Message[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 600,
    }
  });

  const conversationText = messages
    .map(m => `**${m.role.toUpperCase()}:** ${m.text}`)
    .join('\n\n');

  const result = await model.generateContent(conversationText);
  return result.response.text();
}

async function callOpenRouter(messages: Message[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": "https://ezzio.me",
      "X-Title": "The Null Hypothesis"
    },
  });

  const chatMessages = [
    { role: "system" as const, content: SYSTEM_INSTRUCTION },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.text
    }))
  ];

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-8b-instruct:free",
    messages: chatMessages,
    temperature: 0.6,
    max_tokens: 600,
  });

  return completion.choices[0]?.message?.content || "";
}

async function callHuggingFace(messages: Message[]): Promise<string> {
  const token = process.env.HUGGING_FACE_TOKEN;
  if (!token) throw new Error("HUGGING_FACE_TOKEN not configured");

  const conversationText = messages
    .map(m => `<|${m.role}|>\n${m.text}`)
    .join('\n\n');

  const fullPrompt = `<|system|>\n${SYSTEM_INSTRUCTION}\n\n${conversationText}\n\n<|assistant|>\n`;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 500,
          return_full_text: false,
          temperature: 0.6
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${response.status}`);
  }

  const res = await response.json();
  return Array.isArray(res) ? res[0].generated_text : "";
}

async function callPollinations(messages: Message[]): Promise<string> {
  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.text}`)
    .join('\n\n');

  const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n${conversationText}\n\nASSISTANT:`;
  const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Pollinations failed");

  return await res.text();
}

// --- PROVIDER ROUTING ---
type Provider = 'groq' | 'cerebras' | 'gemini' | 'openrouter' | 'huggingface' | 'pollinations';

const PROVIDER_CHAIN: Provider[] = [
  'groq',
  'gemini',
  'cerebras',
  'openrouter',
  'huggingface',
  'pollinations'
];

async function callProvider(provider: Provider, messages: Message[]): Promise<string> {
  switch (provider) {
    case 'groq':
      return await callGroq(messages);
    case 'cerebras':
      return await callCerebras(messages);
    case 'gemini':
      return await callGemini(messages);
    case 'openrouter':
      return await callOpenRouter(messages);
    case 'huggingface':
      return await callHuggingFace(messages);
    case 'pollinations':
      return await callPollinations(messages);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// --- BALANCED SPECIALIZED PROMPTS (Educational) ---
function buildSpecializedPrompt(params: {
  code?: string;
  output?: string;
  error?: string;
  type?: string;
}): string | null {
  const { code, output, error, type } = params;

  if (error) {
    return `
### DEBUGGING EXERCISE

A runtime error has occurred. Apply systematic debugging:

**Code:**
\`\`\`python
${code || "# No code provided"}
\`\`\`

**Error Trace:**
\`\`\`
${error}
\`\`\`

**Your analysis should include:**
1. **Root Cause:** What went wrong and why?
2. **Theoretical Context:** What statistical or programming concept is being violated?
3. **Corrected Code:** Provide the fix with brief explanation
`.trim();
  }

  if (type === 'code' && code) {
    return `
### CODE REVIEW

Evaluate this implementation for statistical rigor and code quality:

\`\`\`python
${code}
\`\`\`

**Provide:**
1. **Purpose:** What statistical procedure is being implemented?
2. **Evaluation:** Assess correctness, efficiency, and adherence to best practices
3. **Recommendations:** Suggest one or two meaningful improvements (if applicable)

Focus on connecting the code to underlying statistical theory.
`.trim();
  }

  if (type === 'interpret' && output) {
    return `
### STATISTICAL INTERPRETATION

Analyze these simulation results through a theoretical lens:

\`\`\`
${output}
\`\`\`

**Your interpretation should address:**
1. **Key Findings:** What do the estimates and metrics reveal?
2. **Theoretical Agreement:** How do results compare to expected statistical theory?
3. **Anomalies & Implications:** Note any deviations and their statistical significance

Connect empirical results to theoretical expectations.
`.trim();
  }

  return null;
}

// --- MAIN HANDLER ---
export async function POST(req: Request) {
  try {
    const { history, overridePrompt, code, output, error, type } = await req.json();

    const recentHistory: Message[] = Array.isArray(history)
      ? history.slice(-MAX_HISTORY_MESSAGES)
      : [];

    // Build specialized prompt
    const specializedPrompt = buildSpecializedPrompt({ code, output, error, type });
    if (specializedPrompt) {
      recentHistory.push({ role: 'user', text: specializedPrompt });
    }

    // Override prompt
    if (overridePrompt) {
      recentHistory.push({
        role: 'user',
        text: `[SPECIAL_INSTRUCTION]: ${overridePrompt}`
      });
    }

    // Validate input
    if (recentHistory.length === 0) {
      return NextResponse.json({
        reply: ">> ERROR: No input provided."
      }, { status: 400 });
    }

    let responseText = "";
    let successfulProvider: Provider | null = null;

    // Try providers in sequence
    for (const provider of PROVIDER_CHAIN) {
      try {
        console.log(`[AI] Attempting ${provider}...`);

        const timeout = provider === 'pollinations' ? TIMEOUT_MS * 2 : TIMEOUT_MS;
        responseText = await withTimeout(
          callProvider(provider, recentHistory),
          timeout,
          provider
        );

        if (responseText && responseText.trim().length > 0) {
          successfulProvider = provider;
          console.log(`[AI] ✓ Success with ${provider}`);
          break;
        }
      } catch (err) {
        console.error(`[AI] ✗ ${provider} failed:`, err instanceof Error ? err.message : err);
        continue;
      }
    }

    if (!responseText || responseText.trim().length === 0) {
      return NextResponse.json({
        reply: ">> SYSTEM OFFLINE. All providers unavailable."
      }, { status: 503 });
    }

    return NextResponse.json({
      reply: responseText,
      provider: successfulProvider
    });

  } catch (err) {
    console.error("[AI] CRITICAL ERROR:", err);
    return NextResponse.json({
      reply: ">> CRITICAL SYSTEM FAILURE. Please try again."
    }, { status: 500 });
  }
}