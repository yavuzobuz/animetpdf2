
'use server';
/**
 * @fileOverview Generates a textual description of key concepts and relationships from a PDF summary,
 * which can be used as a basis for a diagram or concept map.
 *
 * - generatePdfDiagram - A function that generates the diagram description.
 * - GeneratePdfDiagramInput - The input type for the generatePdfDiagram function.
 * - GeneratePdfDiagramOutput - The return type for the generatePdfDiagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePdfDiagramInputSchema = z.object({
  pdfSummary: z
    .string()
    .describe('A summary of the PDF content (in Turkish) to generate the diagram description from.'),
});
export type GeneratePdfDiagramInput = z.infer<typeof GeneratePdfDiagramInputSchema>;

const GeneratePdfDiagramOutputSchema = z.object({
  diagramDescription: z
    .string()
    .describe(
      'Anahtar kavramları, varlıkları ve aralarındaki önemli ilişkileri listeleyen, bir kavram haritasının veya diyagramın temelini oluşturacak metinsel bir açıklama (Türkçe). Markdown formatında bir liste veya bağlantıları belirten cümleler içerebilir. Örneğin: "- Konu A, Konu B ile ilgilidir.\n- Konu B, Alt Konu C ve Alt Konu D\'yi içerir."'
    ),
});
export type GeneratePdfDiagramOutput = z.infer<typeof GeneratePdfDiagramOutputSchema>;

export async function generatePdfDiagram(
  input: GeneratePdfDiagramInput
): Promise<GeneratePdfDiagramOutput> {
  return generatePdfDiagramFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePdfDiagramPrompt',
  input: {schema: GeneratePdfDiagramInputSchema},
  output: {schema: GeneratePdfDiagramOutputSchema},
  prompt: `Sen, metin analiz ederek kavram haritaları ve diyagramlar için temel oluşturan bir uzmansın.
Sağlanan PDF özetini (Türkçe) analiz et. Özetin içindeki anahtar kavramları, önemli varlıkları ve bunlar arasındaki temel ilişkileri belirle.
Çıktın, bu kavramları ve ilişkileri açıkça listeleyen, Türkçe, metinsel bir açıklama olmalıdır. Bu açıklama, bir insanın bu özete dayanarak basit bir kavram haritası çizmesine yardımcı olacak nitelikte olmalıdır.
İlişkileri belirtirken "bağlantılıdır", "alt başlığıdır", "neden olur", "sonucudur", "parçasıdır" gibi ifadeler kullanabilirsin.
Çıktıyı Markdown listesi formatında veya ilişkileri net bir şekilde ifade eden cümlelerle oluştur.

Örnek Çıktı Formatı:
"
- **Merkezi Konu:** Proje Yönetimi Metodolojileri
  - **İlişkili Kavram:** Çevik (Agile) Yaklaşımlar
    - Çevik Yaklaşımlar, Esneklik ve Hızlı Geri Bildirim ile **bağlantılıdır**.
    - Esneklik, Değişen Gereksinimlere Uyum Sağlamayı **kolaylaştırır**.
  - **İlişkili Kavram:** Waterfall (Şelale) Modeli
    - Waterfall Modeli, Aşamalı ve Sıralı Bir Süreçtir.
    - Waterfall Modeli, Kapsamlı Planlama **gerektirir**.
- **Anahtar Varlık:** Proje Takımı
  - Proje Takımı, Etkili İletişim **kurmalıdır**.
  - Etkili İletişim, Proje Başarısını **etkiler**.
"

PDF Özeti (Türkçe):
{{{pdfSummary}}}

Kavram Haritası/Diyagram Açıklaması (Türkçe, metinsel ve ilişkileri belirten formatta):
`,
});

const generatePdfDiagramFlow = ai.defineFlow(
  {
    name: 'generatePdfDiagramFlow',
    inputSchema: GeneratePdfDiagramInputSchema,
    outputSchema: GeneratePdfDiagramOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.diagramDescription) {
      throw new Error(
        'Diyagram açıklaması oluşturma başarısız oldu veya içerik dönmedi.'
      );
    }
    return output;
  }
);
