'use server';

/**
 * @fileOverview Analyzes a PDF document to extract key themes and points in Turkish.
 *
 * - analyzePdf - A function that takes PDF content and returns a summary in Turkish.
 * - AnalyzePdfInput - The input type for the analyzePdf function, a data URI representing the PDF.
 * - AnalyzePdfOutput - The return type for the analyzePdf function, containing the summary in Turkish.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF document content as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AnalyzePdfInput = z.infer<typeof AnalyzePdfInputSchema>;

const AnalyzePdfOutputSchema = z.object({
  summary: z.string().describe('A detailed, comprehensive and guiding summary of the key themes and points in the PDF document, in Turkish.'),
});
export type AnalyzePdfOutput = z.infer<typeof AnalyzePdfOutputSchema>;

export async function analyzePdf(input: AnalyzePdfInput): Promise<AnalyzePdfOutput> {
  return analyzePdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePdfPrompt',
  input: {schema: AnalyzePdfInputSchema},
  output: {schema: AnalyzePdfOutputSchema},
  prompt: `Sen, PDF dokümanlarını derinlemesine analiz eden, ancak çıktıyı bir ilkokul öğretmeninin sadeliği ve akıcılığında sunan UZMAN BİR EĞİTİMCİSİN. Aşağıdaki PDF içeriğini inceleyerek **öğretici, anlaşılır ve madde madde** bir özet oluştur.

📝 **İstediğim Çıktı Biçimi**
• En az **20** ayrı madde (gerekiyorsa daha fazla)
• Her madde **1-2 cümle** olacak şekilde, konunun farklı yönlerini kapsasın.
• Maddeler "• " (madde imi) ile başlasın ve ardından boşluk gelsin.
• Her madde arasında **boş satır (\n\n)** bırak ki kolay bölünebilsin.
• **Başlık, numara veya bölüm adı kullanma.** Sadece maddeler.

�� **İçerik Rehberi** (zorunlu olmasa da madde çeşitliliği için): Tanım, tarihçe, temel kavramlar, süreçler, uygulama alanları, avantaj/dezavantaj, gerçek hayat örnekleri, etik-hukuki çerçeve, yaygın hatalar, en iyi uygulamalar, gelecek trendleri, ek kaynak önerileri vb.

**Örnek Çıktı (kısa):**
• Konu X, insan‐bilgisayar etkileşimini iyileştirmek için geliştirilen bir yöntemdir.

• Yöntem ilk kez 1970'lerde ortaya çıkmış, 1990'larda yaygınlaşmıştır.

... (devam)

📄 PDF İçeriği referansı: {{media url=pdfDataUri}}

Türkçe Madde Madde Detaylı Özet:`,
});

const analyzePdfFlow = ai.defineFlow(
  {
    name: 'analyzePdfFlow',
    inputSchema: AnalyzePdfInputSchema,
    outputSchema: AnalyzePdfOutputSchema,
  },
  async input => {
    try {
      // PDF boyut kontrolü
      const base64Data = input.pdfDataUri.split(',')[1];
      if (base64Data) {
        const sizeInBytes = (base64Data.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        console.log(`PDF boyutu: ${sizeInMB.toFixed(2)} MB`);
        
        // 20MB'dan büyükse hata ver
        if (sizeInMB > 20) {
          throw new Error(`PDF dosyası çok büyük (${sizeInMB.toFixed(2)} MB). Lütfen 20MB'dan küçük bir dosya yükleyin.`);
        }
      }
      
    const {output} = await prompt(input);
    return output!;
    } catch (error: any) {
      console.error('PDF analiz hatası:', error);
      
      // Google AI API hatalarını yakala
      if (error.message?.includes('GoogleGenerativeAI Error') || error.message?.includes('fetch failed')) {
        throw new Error('PDF analizi sırasında sunucu hatası oluştu. Lütfen daha küçük bir PDF dosyası deneyin veya birkaç dakika sonra tekrar deneyin.');
      }
      
      // Diğer hatalar
      throw error;
    }
  }
);
