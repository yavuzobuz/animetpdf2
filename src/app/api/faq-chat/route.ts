import { NextRequest, NextResponse } from 'next/server';
import { faqChat } from '@/ai/flows/faq-chat-flow';

export async function POST(request: NextRequest) {
  try {
    const { userQuery, userLanguage } = await request.json();

    if (!userQuery || !userLanguage) {
      return NextResponse.json(
        { error: 'userQuery and userLanguage are required' },
        { status: 400 }
      );
    }

    // FAQ content in Turkish
    const faqContent = `
    AnimatePDF nedir ve ne işe yarar?
    AnimatePDF, PDF belgelerinizi yükleyerek otomatik olarak Türkçe özetler çıkaran, bu özetlerden animasyon senaryoları, kare görselleri ve seslendirmeler üreten bir yapay zeka uygulamasıdır. Ayrıca, interaktif mini testler, PDF içeriğiyle sohbet ve süreçleri gösteren metinsel akış diyagramları oluşturma imkanı sunar.

    Hangi tür PDF'leri yükleyebilirim?
    Metin tabanlı PDF'ler en iyi sonuçları verir. Çok fazla karmaşık grafik içeren veya taranmış (resim formatında) PDF'lerde metin çıkarımı ve analiz performansı düşebilir. İçeriğin net ve iyi yapılandırılmış olması önemlidir.

    Animasyon senaryosu, görseller ve seslendirme nasıl oluşturuluyor?
    PDF'inizden çıkarılan özet, gelişmiş üretken yapay zeka modellerine gönderilir. Bu modeller, özete uygun senaryo adımlarını, sahne açıklamalarını (metafor ve ikon önerileriyle), bu açıklamalara dayalı görselleri (seçtiğiniz stilde) ve karelerin anahtar konuları için seslendirmeleri üretir.

    Ücretsiz plan ile neler yapabilirim?
    Ücretsiz planımızla ayda 5 PDF dönüşümü, temel kalitede animasyonlar, standart ses seslendirme ve 2GB depolama alanı kullanabilirsiniz. Mini testler, PDF sohbeti ve basit akış diyagramları da ücretsiz planda mevcuttur. Başlangıç için ideal bir seçenektir.

    Pro plan ne kadardır ve hangi ek özellikler sunar?
    Pro planımız aylık 29₺ veya yıllık 290₺'dir (%17 indirimli). Pro plan ile sınırsız PDF dönüşümü, HD kalitede animasyonlar, profesyonel seslendirme seçenekleri, 50GB depolama, öncelikli destek ve gelişmiş düzenleme araçları kullanabilirsiniz.

    Veri gizliliğim nasıl korunuyor?
    Yüklediğiniz PDF'ler yalnızca analiz ve içerik üretimi amacıyla geçici olarak işlenir ve sunucularımızda saklanmaz. Üretilen içerikler (özetler, senaryolar vb.) kullanıcı deneyiminiz için geçici olarak tutulabilir, ancak bu veriler de gizlilik politikamız çerçevesinde korunur.

    Oluşturulan animasyonları/içerikleri indirebilir miyim?
    Şu anki sürümde doğrudan animasyon veya tüm içerik paketini indirme özelliği bulunmamaktadır. Animasyonları uygulama üzerinden önizleyebilir ve interaktif özelliklerini kullanabilirsiniz. Kare görselleri genellikle tarayıcı üzerinden sağ tıklayarak kaydedilebilir.

    Bir sorunla karşılaşırsam ne yapmalıyım?
    Herhangi bir sorunla karşılaşırsanız, bir hata fark ederseniz veya uygulama hakkında geri bildirimde bulunmak isterseniz, lütfen support@animatepdf.com adresinden bizimle iletişime geçin. Kullanıcı deneyimini iyileştirmek için geri bildirimleriniz bizim için çok değerlidir.
    `;

    const result = await faqChat({
      faqContent,
      userQuery,
      userLanguage
    });

    return NextResponse.json({ botResponse: result.botResponse });

  } catch (error) {
    console.error('FAQ Chat error:', error);
    return NextResponse.json(
      { error: 'Chatbot yanıtı oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}