/* AXEL AI Router — provider/key failover scaffold
   Keep real API keys in Supabase Edge Function secrets, never here. */
window.AXEL_ROUTER = {
  version: '1.0.0',
  providers: [
    { id: 'openai', label: 'OpenAI', secretPrefix: 'OPENAI_API_KEY_', priority: 10 },
    { id: 'anthropic', label: 'Anthropic / Claude', secretPrefix: 'ANTHROPIC_API_KEY_', priority: 20 },
    { id: 'gemini', label: 'Google Gemini', secretPrefix: 'GEMINI_API_KEY_', priority: 30 },
    { id: 'openrouter', label: 'OpenRouter', secretPrefix: 'OPENROUTER_API_KEY_', priority: 40 }
  ],
  failover: { enabled: true, maxAttempts: 20, retryable: [408, 409, 425, 429, 500, 502, 503, 504] }
};
