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
  narrativeStyle: z.string().optional().describe('The narrative style for the response (e.g., "Varsayılan", "Akademik", "Basit ve Anlaşılır", etc.).'),
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

ANLATIM TARZI: {{narrativeStyle}}

**ANLATIM TARZLARINA GÖRE YANITLAMA:**

**AKADEMİK**: Formal akademik dil, teorik açıklamalar, literatür referansları (8-12 cümle)
**TEKNİK DERİNLİK**: Teknik detaylar, spesifikasyonlar, implementasyon bilgileri (7-10 cümle)
**YARATICI VE EĞLENCELİ**: Benzetmeler, hikayeler, mizahi yaklaşım (6-9 cümle)
**PROFESYONEL**: İş odaklı, ROI analizi, verimlilik metrikleri (6-9 cümle)
**SAMİMİ VE SOHBET**: Rahat dil, kişisel deneyimler, günlük örnekler (5-8 cümle)
**ELEŞTİREL BAKIŞ**: Objektif analiz, avantaj-dezavantaj karşılaştırması, alternatif yaklaşımlar (7-10 cümle)
**BASİT VE ANLAŞILIR**: Sade dil, adım adım açıklama, somut örnekler (5-7 cümle)
**VARSAYILAN**: Net ve bilgilendirici, pratik örnekler (5-7 cümle)

GÖREV: PDF özetindeki bilgilere dayanarak soruları yanıtla. Seçilen anlatım tarzına uygun uzunluk ve formatta cevap ver.

KURALLAR:
- Sadece PDF özetindeki bilgileri kullan
- Seçilen anlatım tarzına uygun minimum cümle sayısını karşıla
- Bilgi yoksa "Bu konuda belgede detaylı bilgi bulamadım" de ama yine de tarzına uygun uzunlukta yanıt ver
- Bilgi uydurma, sadece özetteki bilgileri kullan

PDF Özeti: {{{pdfSummary}}}
Kullanıcı Sorusu: {{{userQuery}}}
Anlatım Tarzı: {{{narrativeStyle}}}

Cevabın (Türkçe, seçilen anlatım tarzına uygun):`,
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

