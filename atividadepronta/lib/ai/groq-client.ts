import Groq from 'groq-sdk';

if (!process.env.LLM_API_KEY) {
    throw new Error('LLM_API_KEY não configurada');
}

export const groq = new Groq({
    apiKey: process.env.LLM_API_KEY,
});

export const GROQ_MODELS = {
    VERSATILE: 'llama-3.3-70b-versatile',
    INSTANT: 'llama-3.1-8b-instant',
};
