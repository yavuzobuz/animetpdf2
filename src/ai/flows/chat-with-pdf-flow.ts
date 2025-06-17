'use server';
/**
 * @fileOverview Enables chat interaction with a PDF document summary.
 *
 * - chatWithPdf - A function that takes a PDF summary and a user query, then returns a bot response.
 * - ChatWithPdfInput - The input type for the chatWithPdf function.
 * - ChatWithPdfOutput - The return type for the chatWithPdf function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithPdfInputSchema = z.object({
  pdfSummary: z.string().describe('The summary of the PDF document (in Turkish).'),
  userQuery: z.string().describe('The user\'s question about the PDF document (in Turkish).'),
});
export type ChatWithPdfInput = z.infer<typeof ChatWithPdfInputSchema>;

const ChatWithPdfOutputSchema = z.object({
  botResponse: z.string().describe('The AI-generated response to the user\'s query, based on the PDF summary (in Turkish).'),
});
export type ChatWithPdfOutput = z.infer<typeof ChatWithPdfOutputSchema>;

export async function chatWithPdf(input: ChatWithPdfInput): Promise<ChatWithPdfOutput> {
  return chatWithPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithPdfPrompt',
  input: {schema: ChatWithPdfInputSchema},
  output: {schema: ChatWithPdfOutputSchema},
  prompt: `Sen, bir PDF belgesinin özeti hakkında soruları yanıtlayan yardımcı bir asistansın. Sana bir PDF özeti ve bir kullanıcı sorusu verilecek. Amacın, yalnızca sağlanan PDF özetindeki bilgilere dayanarak kullanıcının sorusuna Türkçe olarak yanıt vermektir. Kullanıcının sorusunu yorumlarken, özet içeriğiyle bağlantılı olabilecek yaygın kısaltmaları veya eş anlamlı ifadeleri de göz önünde bulundurmaya çalış. Eğer soru özetle doğrudan ilgili değilse veya özette cevabı bulunmuyorsa, kibarca bunu belirt ve ek bilgi veremeyeceğini söyle. Kullanıcıya doğrudan özeti okumasını tavsiye etme, sadece sorusuna cevap ver veya veremiyorsan belirt.

PDF Özeti (Türkçe):
{{{pdfSummary}}}

Kullanıcı Sorusu (Türkçe):
{{{userQuery}}}

Cevabın (Türkçe ve sadece özete dayanarak):`,
});

const chatWithPdfFlow = ai.defineFlow(
  {
    name: 'chatWithPdfFlow',
    inputSchema: ChatWithPdfInputSchema,
    outputSchema: ChatWithPdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.botResponse) {
      throw new Error("Chatbot yanıt oluşturma başarısız oldu veya içerik dönmedi.");
    }
    return output;
  }
);

