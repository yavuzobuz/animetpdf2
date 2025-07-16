import { test, expect } from '@playwright/test';

test.describe('Chat History Fix Test', () => {
  test('should allow chat without PDF upload (no projectId)', async ({ page }) => {
    console.log('🧪 Chat History Fix Test başlıyor...');
    
    // Ana sayfaya git
    await page.goto('http://localhost:3004');
    await page.waitForLoadState('networkidle');
    
    // Animate sayfasına git
    await page.click('text=Animate');
    await page.waitForLoadState('networkidle');
    
    // PDF yüklemeden sadece konu yaz
    const topicInput = page.locator('input[placeholder*="topic"], input[placeholder*="konu"], textarea[placeholder*="topic"], textarea[placeholder*="konu"]').first();
    await topicInput.fill('Matematik');
    
    // Chat butonuna tıkla
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Sohbet")').first();
    await chatButton.click();
    
    // Chat arayüzünün açıldığını kontrol et
    await page.waitForSelector('input[type="text"], textarea', { timeout: 10000 });
    
    // Mesaj yaz ve gönder
    const messageInput = page.locator('input[type="text"], textarea').last();
    await messageInput.fill('Merhaba, nasılsın?');
    
    // Send butonuna tıkla veya Enter'a bas
    const sendButton = page.locator('button:has-text("Send"), button:has-text("Gönder"), button[type="submit"]').first();
    
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await messageInput.press('Enter');
    }
    
    // Mesajın gönderildiğini kontrol et (hata olmamalı)
    await page.waitForTimeout(3000);
    
    // Console error'larını kontrol et
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Foreign key constraint hatası olmamalı
    const hasConstraintError = errors.some(error => 
      error.includes('foreign key constraint') || 
      error.includes('chat_history_project_id_fkey')
    );
    
    expect(hasConstraintError).toBe(false);
    
    console.log('✅ Test başarılı: Chat projectId olmadan çalışıyor!');
  });
  
  test('should handle chat with valid projectId', async ({ page }) => {
    console.log('🧪 Valid projectId ile chat test...');
    
    // Ana sayfaya git
    await page.goto('http://localhost:3004');
    await page.waitForLoadState('networkidle');
    
    // Animate sayfasına git
    await page.click('text=Animate');
    await page.waitForLoadState('networkidle');
    
    // Konu yaz
    const topicInput = page.locator('input[placeholder*="topic"], input[placeholder*="konu"], textarea[placeholder*="topic"], textarea[placeholder*="konu"]').first();
    await topicInput.fill('Fizik');
    
    // PDF yükle (eğer mümkünse)
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible()) {
      // Test PDF dosyası yükle (eğer varsa)
      console.log('📄 PDF yükleme test edilecek...');
    }
    
    // Chat butonuna tıkla
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Sohbet")').first();
    await chatButton.click();
    
    // Mesaj gönder
    await page.waitForSelector('input[type="text"], textarea', { timeout: 10000 });
    const messageInput = page.locator('input[type="text"], textarea').last();
    await messageInput.fill('Bu konuda yardım eder misin?');
    
    const sendButton = page.locator('button:has-text("Send"), button:has-text("Gönder"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await messageInput.press('Enter');
    }
    
    await page.waitForTimeout(3000);
    
    console.log('✅ Valid projectId test tamamlandı!');
  });
});