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
import { AnalyzePdfContentInputSchema } from '@/ai/schemas';

export type AnalyzePdfInput = z.infer<typeof AnalyzePdfContentInputSchema>;

const AnalyzePdfOutputSchema = z.object({
  summary: z.string().describe('A detailed, comprehensive and guiding summary of the key themes and points in the PDF document, in Turkish.'),
});
export type AnalyzePdfOutput = z.infer<typeof AnalyzePdfOutputSchema>;

export async function analyzePdf(input: AnalyzePdfInput): Promise<AnalyzePdfOutput> {
  return analyzePdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePdfPrompt',
  input: {schema: AnalyzePdfContentInputSchema},
  output: {schema: AnalyzePdfOutputSchema},
  prompt: `Sen, PDF dokümanlarını derinlemesine analiz eden, ancak çıktıyı bir ilkokul öğretmeninin sadeliği ve akıcılığında sunan UZMAN BİR EĞİTİMCİSİN. Aşağıdaki PDF içeriğini inceleyerek **öğretici, anlaşılır ve madde madde** bir özet oluştur.

ANLATIM TARZI: Cevabını aşağıdaki anlatım tarzına göre ayarla:
- **{{narrativeStyle}}**: Eğer "Varsayılan" ise, standart, net ve bilgilendirici bir dil kullan.
- **Basit ve Anlaşılır**: Karmaşık terimlerden kaçın, konuyu en temel düzeyde, herkesin anlayabileceği bir dille açıkla.
- **Akademik**: Resmi, kaynaklara dayalı, detaylı ve yapılandırılmış bir dil kullan.
- **Teknik Derinlik**: Alan jargonunu ve teknik detayları yoğun bir şekilde kullanarak uzmanlara yönelik bir anlatım sun.
- **Yaratıcı ve Eğlenceli**: Benzetmeler, hikayeler ve mizahi bir dil kullanarak konuyu ilgi çekici hale getir.
- **Profesyonel (İş Odaklı)**: İş dünyasına uygun, sonuç odaklı, net ve saygılı bir dil kullan.
- **Samimi ve Sohbet Havasında**: Daha kişisel ve rahat bir tonla, okuyucuyla sohbet ediyormuş gibi yaz.
- **Eleştirel Bakış**: Konunun farklı yönlerini sorgulayan, avantajları ve dezavantajları objektif bir şekilde sunan bir yaklaşım sergile.

**MUTLAK UZUNLUK GEREKSİNİMLERİ:**

📝 **İstediğim Çıktı Biçimi - ZORUNLU KURALLAR**
• EN AZ **35-40** ayrı madde (20 değil!)
• Her madde **EN AZ 4-6 CÜMLE** olacak şekilde (1-2 değil!)
• Her madde **EN AZ 80-120 KELİME** içermeli
• TOPLAM METİN UZUNLUĞU: **EN AZ 2500 KELİME**
• Maddeler "• " (madde imi) ile başlasın
• Her madde arasında **boş satır (\n\n)** bırak

**ANLATIM TARZINA GÖRE DETAYLANDIRMA:**

- **Akademik Tarz:**
  • Her madde EN AZ 5-7 cümle, 120-150 kelime
  • Teorik çerçeveleri açıkla
  • Metodolojik yaklaşımları belirt
  • Eleştirel değerlendirmeler ekle
  • "Araştırmalar göstermektedir", "Literatürde" ifadeleri kullan
  • EN AZ 40 madde oluştur

- **Teknik Derinlik:**
  • Her madde EN AZ 5-6 cümle, 100-130 kelime
  • Teknik spesifikasyonları detaylandır
  • Implementation detaylarını ver
  • Sistem mimarisi açıklamalarını dahil et
  • "Teknik açıdan", "Implementation olarak" ifadeleri kullan
  • EN AZ 38 madde oluştur

- **Yaratıcı ve Eğlenceli:**
  • Her madde EN AZ 4-5 cümle, 90-110 kelime
  • Hikaye tarzında anlat
  • Metaforlar ve benzetmeler kullan
  • Karakterizasyon yap
  • "Hayal edin", "Sanki" ifadeleri kullan
  • EN AZ 35 madde oluştur

- **Profesyonel (İş Odaklı):**
  • Her madde EN AZ 4-6 cümle, 100-120 kelime
  • İş perspektifinden açıkla
  • ROI ve verimlilik odaklı yaklaş
  • Stratejik değerlendirmeler yap
  • "İş açısından", "Operasyonel olarak" ifadeleri kullan
  • EN AZ 37 madde oluştur

- **Basit ve Anlaşılır:**
  • Her madde EN AZ 3-4 cümle, 70-90 kelime
  • Basit dilde açıkla
  • Günlük hayattan örnekler ver
  • "Yani", "Kısacası" ifadeleri kullan
  • EN AZ 35 madde oluştur

- **Samimi ve Sohbet:**
  • Her madde EN AZ 3-5 cümle, 80-100 kelime
  • Samimi dilde açıkla
  • Kişisel deneyimler paylaş
  • "Biliyor musun", "Aslında" ifadeleri kullan
  • EN AZ 35 madde oluştur

- **Eleştirel Bakış:**
  • Her madde EN AZ 5-6 cümle, 110-140 kelime
  • Çok perspektifli açıkla
  • Avantaj ve dezavantajları sun
  • Alternatif yaklaşımları karşılaştır
  • "Öte yandan", "Ancak" ifadeleri kullan
  • EN AZ 38 madde oluştur

**KONTROL LİSTESİ - MUTLAKA KONTROL ET:**
✓ Madde sayısı yeterli mi? (35+ olmalı)
✓ Her madde yeterince uzun mu? (4+ cümle)
✓ Toplam kelime sayısı 2500+ mı?
✓ Anlatım tarzına uygun mu?
✓ Detaylı açıklamalar var mı?

**UYARI: Bu kurallara uymayan çıktılar KABUL EDİLMEZ!**
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
    inputSchema: AnalyzePdfContentInputSchema,
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
