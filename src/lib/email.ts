import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send an email using nodemailer
 * @param options Email options including recipient, subject, and HTML content
 * @returns Promise resolving to the send result
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, from = process.env.EMAIL_FROM || 'noreply@example.com' } = options;
  
  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

/**
 * Send a welcome email to a new user
 * @param email User's email address
 * @param name User's name
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const subject = 'Welcome to AnimeToPDF!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Welcome to AnimeToPDF!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for joining AnimeToPDF. We're excited to have you on board!</p>
      <p>With our platform, you can:</p>
      <ul>
        <li>Convert your PDFs into engaging animations</li>
        <li>Simplify complex topics with visual explanations</li>
        <li>Create educational content that's easy to understand</li>
      </ul>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>The AnimeToPDF Team</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
}

/**
 * Send a password reset email
 * @param email User's email address
 * @param resetLink Password reset link
 */
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const subject = 'Reset Your AnimeToPDF Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Reset Your Password</h1>
      <p>You requested a password reset for your AnimeToPDF account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>The AnimeToPDF Team</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
}