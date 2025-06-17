
'use server';
/**
 * @fileOverview Enables chat interaction based on FAQ content.
 *
 * - faqChat - A function that takes FAQ content and a user query, then returns a bot response.
 * - FaqChatInput - The input type for the faqChat function.
 * - FaqChatOutput - The return type for the faqChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaqChatInputSchema = z.object({
  faqContent: z.string().describe('The complete text content of all frequently asked questions and their answers.'),
  userQuery: z.string().describe('The user\'s question related to the FAQs.'),
});
export type FaqChatInput = z.infer<typeof FaqChatInputSchema>;

const FaqChatOutputSchema = z.object({
  botResponse: z.string().describe('The AI-generated response to the user\'s query, based *only* on the provided FAQ content.'),
});
export type FaqChatOutput = z.infer<typeof FaqChatOutputSchema>;

export async function faqChat(input: FaqChatInput): Promise<FaqChatOutput> {
  return faqChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqChatPrompt',
  input: {schema: FaqChatInputSchema},
  output: {schema: FaqChatOutputSchema},
  prompt: `Sen, yalnızca sağlanan Sıkça Sorulan Sorular (SSS) içeriğine dayanarak soruları yanıtlayan yardımcı bir asistansın.
Kullanıcının sorusunu SSS içeriğinden yanıtlayabiliyorsan, cevabı ver.
Eğer soru SSS içeriğiyle yanıtlanamıyorsa, kibarca bu bilginin SSS'lerde bulunmadığını belirt ve kullanıcının SSS listesini kontrol etmesini veya sorusu listede yoksa destekle iletişime geçmesini öner.
Kesinlikle SSS dışında bir bilgi kullanma veya cevap uydurma. Yanıtların Türkçe olmalıdır.

SSS İçeriği:
{{{faqContent}}}

Kullanıcı Sorusu:
{{{userQuery}}}

Cevabın (yalnızca SSS içeriğine dayanarak ve Türkçe olarak):`,
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
      throw new Error("Chatbot yanıt oluşturma başarısız oldu veya içerik dönmedi.");
    }
    return output;
  }
);
