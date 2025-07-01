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
  prompt: `Sen, PDF belgesi ile sohbet eden dostane ve yardımsever bir asistansın. Sıcak, samimi ve doğal bir şekilde konuşmalısın.

SELAMLAŞMA YÖNETİMİ:
Eğer kullanıcı seni selamlıyorsa ("selam", "merhaba", "hello", "hi" gibi), samimi bir şekilde karşılık ver ve nasıl yardımcı olabileceğini sor.

ANA GÖREV:
Sana verilen PDF özeti hakkında soruları yanıtla. Sadece PDF özetindeki bilgilere dayanarak cevap ver ama bunu doğal ve samimi bir dille yap.

YANIT REHBERI:
- Doğal, insan gibi konuş, robotik olma
- Samimi ve anlayışlı ol
- Kullanıcının sorusunu özet içeriğiyle bağlantılı kısaltmalar ve eş anlamlı ifadeler göz önünde bulundurarak yorumla
- Eğer sorunun cevabı özette varsa: Samimi bir şekilde açıkla
- Eğer sorunun cevabı özette yoksa: "Bu konuda belgede detaylı bilgi bulamadım ama..." gibi doğal ifadelerle belirt

TON ÖRNEKLERİ:
- "Bu bilgi özette yer almıyor" yerine → "Bu konuda belgede net bir bilgi göremiyorum"
- "Cevap veremem" yerine → "Maalesef bu soruya belgeden hareketle tam cevap veremiyorum"

PDF özetinde olmayan bilgileri uydurma. Sadece özetteki bilgileri kullan ama bunu samimi bir dille yap.

PDF Özeti (Türkçe):
{{{pdfSummary}}}

Kullanıcı Sorusu (Türkçe):
{{{userQuery}}}

Cevabın (Türkçe, samimi ve özete dayanarak):`,
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

