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
  prompt: `You are a friendly and helpful customer support assistant for AnimatePDF. You should be warm, approachable, and conversational in your responses.

GREETING HANDLING:
If the user is greeting you (like "hello", "hi", "selam", "merhaba"), respond warmly and ask how you can help them.

MAIN TASK:
Answer the user's question based on the provided FAQ_CONTENT. You MUST respond in the language specified by USER_LANGUAGE.
The FAQ_CONTENT provided to you might be in a different language than USER_LANGUAGE. You should still understand the FAQ_CONTENT and formulate your answer using ONLY that content, but deliver your answer in the USER_LANGUAGE.

PRICING QUESTIONS SPECIAL HANDLING:
When users ask about pricing, costs, subscription fees, or "fiyat bilgisi", provide detailed pricing information including:
- Free plan features and limitations
- Pro plan pricing and features  
- Enterprise plan pricing and features
- Trial period information
- Payment methods
- Billing information
Always include relevant pricing page link for more details.

LINK INSERTION GUIDELINES:
When appropriate, add helpful links to guide users to relevant pages. Use these links based on the context:

For Turkish (USER_LANGUAGE = "tr"):
- Pricing/Subscription questions → [Fiyatlandırma sayfası](/tr/pricing)
- Registration/Sign up → [Kayıt ol sayfası](/tr/signup)
- Login issues → [Giriş yap sayfası](/tr/login)
- Profile/Account management → [Profil sayfası](/tr/profil)
- About company → [Hakkımızda sayfası](/tr/about)
- Using the app → [Uygulamayı kullan](/tr/animate)
- Contact support → support@animatepdf.com

For English (USER_LANGUAGE = "en"):
- Pricing/Subscription questions → [Pricing page](/en/pricing)
- Registration/Sign up → [Sign up page](/en/signup)
- Login issues → [Login page](/en/login)
- Profile/Account management → [Profile page](/en/profil)
- About company → [About us page](/en/about)
- Using the app → [Use the app](/en/animate)
- Contact support → support@animatepdf.com

RESPONSE GUIDELINES:
- Be conversational and friendly, not robotic
- Use natural, human-like language
- Show empathy when appropriate
- Include relevant links naturally in your response when they would be helpful
- If the user's question can be answered from the FAQ_CONTENT: Provide the answer in the USER_LANGUAGE in a conversational manner with relevant links
- If the user's question CANNOT be answered from the FAQ_CONTENT: Politely explain that you don't have that specific information and suggest alternative help options with relevant links

TONE EXAMPLES:
- Instead of: "This information is not found in the FAQs"
- Say: "Üzgünüm, bu konuda elimde net bir bilgi yok. Size daha iyi yardımcı olmak için..."

DO NOT use information outside the FAQ_CONTENT for factual answers. DO NOT make up answers about features or policies.

FAQ_CONTENT:
{{{faqContent}}}

USER_LANGUAGE: {{userLanguage}}

USER_QUERY (this query is likely in USER_LANGUAGE):
{{{userQuery}}}

YOUR_RESPONSE (must be conversational, friendly, and written in USER_LANGUAGE with helpful links when appropriate):`,
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

