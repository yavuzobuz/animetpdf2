import nodemailer from 'nodemailer';

// E-posta gönderimi için transporter oluştur
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

// Destek talebine cevap gönder
export async function sendSupportReply({
  to,
  subject,
  message,
  ticketSubject
}: {
  to: string;
  subject: string;
  message: string;
  ticketSubject: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'support@example.com',
      to,
      subject: `Re: ${ticketSubject} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Destek Talebinize Yanıt</h2>
          <p>Merhaba,</p>
          <p>Destek talebinize yanıtımız aşağıdadır:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>Başka sorularınız olursa lütfen bize bildirin.</p>
          <p>Saygılarımızla,<br>Destek Ekibi</p>
        </div>
      `,
      text: `Destek Talebinize Yanıt\n\nMerhaba,\n\nDestek talebinize yanıtımız aşağıdadır:\n\n${message}\n\nBaşka sorularınız olursa lütfen bize bildirin.\n\nSaygılarımızla,\nDestek Ekibi`
    });
    
    return { success: true };
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return { success: false, error: 'E-posta gönderilemedi' };
  }
}