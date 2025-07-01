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
      'PDF özetindeki bir süreci veya algoritmayı modern akış diyagramı formatında adım adım tanımlayan metinsel açıklama (Türkçe). Başlangıç, Bitiş, Giriş, İşlem, Karar, Paralel İşlemler, Döngüler ve Çıkış gibi adımları içerebilir. Dallanmaları (Evet/Hayır) ve kompleks akış yapılarını destekler. Örnek: "1. BAŞLANGIÇ\\n2. GİRİŞ: Kullanıcıdan veri al\\n3. KARAR: Veri geçerli mi?\\n  EVET ise:\\n    4. PARALEL: Veri işleme başlat\\n    5. DÖNGÜ: Her öğe için işle\\n  HAYIR ise:\\n    6. ÇIKIŞ: Hata mesajı\\n7. BİTİŞ"'
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
  prompt: `Sen, teknik metinleri analiz ederek modern akış diyagramları ve süreç haritaları oluşturan bir uzmansın.

Sağlanan PDF özetini (Türkçe) dikkatli bir şekilde analiz et. Özette tanımlanan süreç, algoritma, iş akışı veya adım adım işleyişi modern bir akış diyagramı mantığıyla metinsel olarak tanımla.

📋 DESTEKLENEN ADIM TÜRLERİ:
• **BAŞLANGIÇ** - Sürecin başlangıç noktası
• **BİTİŞ** - Sürecin bitiş noktası  
• **GİRİŞ:** - Veri veya bilgi alınması
• **ÇIKIŞ:** - Sonuç veya çıktı üretilmesi
• **İŞLEM:** - Bir işlemin gerçekleştirilmesi
• **KARAR:** - Koşullu dallanma noktası
• **PARALEL:** - Eş zamanlı gerçekleştirilen işlemler
• **DÖNGÜ:** - Tekrarlanan işlemler
• (Yorum) - Açıklayıcı notlar

🎯 ÇIKTI FORMATI (Numaralandırma ile):

1. **BAŞLANGIÇ**
2. **GİRİŞ:** Kullanıcıdan 'sayı' değeri alınır
3. **İŞLEM:** mod = sayı % 2 hesaplanır
4. **KARAR:** mod == 0 mı? (Çift sayı kontrolü)
   • **EVET ise:**
     5. **ÇIKIŞ:** "Çift sayı" mesajı gösterilir
     6. (Adım 8'e git)
   • **HAYIR ise:**
     7. **ÇIKIŞ:** "Tek sayı" mesajı gösterilir
8. **BİTİŞ**

🔄 KOMPLEKS YAPILAR:
- **PARALEL:** birden fazla işlemin aynı anda yapılması
- **DÖNGÜ:** tekrarlı işlemler için (for, while benzeri)
- Girinti ile hiyerarşi göster
- Net dallanma yapısı oluştur

📊 KALITE KRİTERLERİ:
✅ Her adım net ve anlaşılır olmalı
✅ Mantıklı numara sırası takip et
✅ Türkçe terimler kullan
✅ Gerçekçi ve uygulanabilir adımlar
✅ Eksik adım bırakma
✅ Paralel işlemler ve döngüleri işaretle

PDF Özeti:
{{{pdfSummary}}}

Akış Diyagramı (Yukarıdaki format ve standartlara uygun):`,
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

