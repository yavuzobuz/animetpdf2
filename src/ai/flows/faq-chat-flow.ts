
'use server';
/**
 * @fileOverview Enables chat interaction based on FAQ content, responding in the user's language.
 *
 * - faqChat - A function that takes FAQ content, a user query, and user language, then returns a bot response in the user's language.
 * - FaqChatInput - The input type for the faqChat function.
 * - FaqChatOutput - The return type for the faqChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaqChatInputSchema = z.object({
  faqContent: z.string().describe('The complete text content of all frequently asked questions and their answers. This content might be in a different language than the userQuery or userLanguage.'),
  userQuery: z.string().describe('The user\'s question related to the FAQs.'),
  userLanguage: z.string().min(2).max(5).describe("The language code for the user's query and the desired response language (e.g., 'tr', 'en')."),
});
export type FaqChatInput = z.infer<typeof FaqChatInputSchema>;

const FaqChatOutputSchema = z.object({
  botResponse: z.string().describe('The AI-generated response to the user\'s query, based *only* on the provided FAQ content, and delivered in the userLanguage.'),
});
export type FaqChatOutput = z.infer<typeof FaqChatOutputSchema>;

export async function faqChat(input: FaqChatInput): Promise<FaqChatOutput> {
  return faqChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqChatPrompt',
  input: {schema: FaqChatInputSchema},
  output: {schema: FaqChatOutputSchema},
  prompt: `You are a helpful assistant. Your ONLY task is to answer the user's question based on the provided FAQ_CONTENT.
You MUST respond in the language specified by USER_LANGUAGE.
The FAQ_CONTENT provided to you might be in a different language than USER_LANGUAGE. You should still understand the FAQ_CONTENT and formulate your answer using ONLY that content, but deliver your answer in the USER_LANGUAGE.

If the user's question can be answered from the FAQ_CONTENT:
  - Provide the answer in the USER_LANGUAGE.
If the user's question CANNOT be answered from the FAQ_CONTENT:
  - Politely state, in USER_LANGUAGE, that this information is not found in the FAQs.
  - Suggest, in USER_LANGUAGE, that the user check the FAQ list or contact support.
DO NOT use any information outside the FAQ_CONTENT. DO NOT make up answers.

FAQ_CONTENT:
{{{faqContent}}}

USER_LANGUAGE: {{userLanguage}}

USER_QUERY (this query is likely in USER_LANGUAGE):
{{{userQuery}}}

YOUR_RESPONSE (must be based ONLY on FAQ_CONTENT and written in USER_LANGUAGE):`,
});

const faqChatFlow = ai.defineFlow(
  {
    name: 'faqChatFlow',
    inputSchema: FaqChatInputSchema,
    outputSchema: FaqChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.botResponse) {
      throw new Error("Chatbot response generation failed or did not return content.");
    }
    return output;
  }
);

