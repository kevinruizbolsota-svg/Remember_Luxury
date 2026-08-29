# AXEL AI System

## Architecture
Frontend (axel-workbench.html) -> Supabase Edge Function (`axel-ai`) -> provider router -> model.

## Providers
- OpenAI
- Anthropic / Claude
- Google Gemini
- OpenRouter

## Credentials
Real provider API keys MUST be stored as Supabase Edge Function secrets. Never commit them to GitHub or expose them to the browser.

Use numbered secrets for key rotation/failover, e.g. `OPENAI_API_KEY_1`, `OPENAI_API_KEY_2`, `GEMINI_API_KEY_1`.

## Failover
The backend should try enabled credentials in priority order and move to the next credential/provider on retryable failures such as 408, 409, 425, 429, 500, 502, 503 and 504. Avoid retrying authentication/configuration errors until the credential is disabled or repaired.

## AXEL behavior
The model receives recent conversation history and relevant memories. It should answer naturally, distinguish questions from actions, state uncertainty rather than inventing project state, and request confirmation before destructive/sensitive operations.
