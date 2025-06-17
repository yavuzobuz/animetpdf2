
'use server';
/**
 * @fileOverview Generates a textual description of a process or algorithm from a PDF summary,
 * structured like a flowchart, which can be used as a basis for a diagram.
 *
 * - generatePdfDiagram - A function that generates the flowchart-like description.
 * - GeneratePdfDiagramInput - The input type for the generatePdfDiagram function.
 * - GeneratePdfDiagramOutput - The return type for the generatePdfDiagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePdfDiagramInputSchema = z.object({
  pdfSummary: z
    .string()
    .describe('A summary of the PDF content (in Turkish) to generate the flowchart description from.'),
});
export type GeneratePdfDiagramInput = z.infer<typeof GeneratePdfDiagramInputSchema>;

const GeneratePdfDiagramOutputSchema = z.object({
  diagramDescription: z
    .string()
    .describe(
      'PDF özetindeki bir süreci veya algoritmayı adım adım tanımlayan, akış diyagramı benzeri metinsel bir açıklama (Türkçe). Başlangıç, Bitiş, Giriş, İşlem, Karar ve Çıkış gibi adımları ve dallanmaları (Evet/Hayır) içerebilir. Örneğin: "1. BAŞLANGIÇ\\n2. GİRİŞ: Kullanıcıdan veri al.\\n3. KARAR: Veri geçerli mi?\\n  EVET ise: ...\\n  HAYIR ise: ...\\n4. BİTİŞ"'
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
  prompt: `Sen, metinleri analiz ederek akış diyagramları ve süreç haritaları için metinsel temeller oluşturan bir uzmansın.
Sağlanan PDF özetini (Türkçe) analiz et. Eğer özette bir süreç, algoritma veya adım adım bir işleyiş anlatılıyorsa, bunu bir akış diyagramı mantığıyla metinsel olarak tanımla.
Çıktın, aşağıdaki gibi yapılandırılmış bir metin olmalıdır (Türkçe). Adımları numaralandır.

Örnek Çıktı Formatı:
1.  **BAŞLANGIÇ**
2.  **GİRİŞ:** Kullanıcıdan 'a' sayısı alınır.
3.  **İŞLEM:** mod = a % 2 hesaplanır (a'nın 2'ye bölümünden kalan).
4.  **KARAR:** mod == 0 mı?
    *   **EVET ise (E Dalı):**
        1.  **ÇIKIŞ:** "Çift" yazdırılır.
        2.  (Adım 6'ya git: BİTİŞ)
    *   **HAYIR ise (H Dalı):**
        1.  **ÇIKIŞ:** "Tek" yazdırılır.
        2.  (Adım 6'ya git: BİTİŞ)
5.  (Bu adım, karar dallarından sonra ortak bir sonraki işlem olsaydı gerekirdi. Örneğimizde doğrudan bitişe gidiliyor.)
6.  **BİTİŞ**

PDF Özeti (Türkçe):
{{{pdfSummary}}}

Akış Diyagramı Açıklaması (Türkçe, yukarıdaki adım adım yapıya ve numaralandırmaya benzer şekilde):
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
        'Akış diyagramı açıklaması oluşturma başarısız oldu veya içerik dönmedi.'
      );
    }
    return output;
  }
);

