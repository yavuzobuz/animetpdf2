
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-pdf.ts';
import '@/ai/flows/generate-animation-scenario.ts';
import '@/ai/flows/generate-frame-image-flow.ts';
import '@/ai/flows/generate-qa-flow.ts';
import '@/ai/flows/generate-speech-flow.ts';
import '@/ai/flows/chat-with-pdf-flow.ts';
import '@/ai/flows/generate-pdf-diagram-flow.ts';
import '@/ai/flows/faq-chat-flow.ts'; // Yeni flow eklendi
