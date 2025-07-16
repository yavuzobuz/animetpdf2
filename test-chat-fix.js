// Chat History Test - Foreign Key Constraint Fix Test
// Bu script chat özelliğinin projectId olmadan çalışıp çalışmadığını test eder

const testChatWithoutProject = async () => {
  console.log('🧪 Chat History Test Başlıyor...');
  
  try {
    // Test 1: saveChatMessage fonksiyonunu projectId olmadan çağır
    console.log('📝 Test 1: saveChatMessage projectId=undefined ile test ediliyor...');
    
    // Database fonksiyonunu import et
    const { saveChatMessage } = await import('./src/lib/database.ts');
    
    // projectId undefined ile test et
    const result1 = await saveChatMessage(undefined, 'user', 'Test mesajı - projectId yok');
    console.log('✅ Test 1 Sonuç:', result1 ? 'BAŞARILI' : 'BAŞARISIZ');
    
    // Test 2: saveChatMessage fonksiyonunu null projectId ile çağır
    console.log('📝 Test 2: saveChatMessage projectId=null ile test ediliyor...');
    const result2 = await saveChatMessage(null, 'assistant', 'Test cevabı - projectId null');
    console.log('✅ Test 2 Sonuç:', result2 ? 'BAŞARILI' : 'BAŞARISIZ');
    
    // Test 3: getChatHistory fonksiyonunu projectId olmadan çağır
    console.log('📝 Test 3: getChatHistory projectId=undefined ile test ediliyor...');
    const { getChatHistory } = await import('./src/lib/database.ts');
    const history = await getChatHistory(undefined);
    console.log('✅ Test 3 Sonuç:', Array.isArray(history) ? 'BAŞARILI' : 'BAŞARISIZ');
    console.log('📊 Chat History Uzunluğu:', history.length);
    
    // Test 4: Geçersiz projectId ile test
    console.log('📝 Test 4: saveChatMessage geçersiz projectId ile test ediliyor...');
    const result4 = await saveChatMessage('invalid-project-id-123', 'user', 'Test mesajı - geçersiz ID');
    console.log('✅ Test 4 Sonuç:', result4 ? 'BAŞARILI' : 'BAŞARISIZ');
    
    console.log('\n🎉 Tüm testler tamamlandı!');
    console.log('📋 Özet:');
    console.log('- Test 1 (undefined projectId):', result1 ? '✅' : '❌');
    console.log('- Test 2 (null projectId):', result2 ? '✅' : '❌');
    console.log('- Test 3 (getChatHistory):', Array.isArray(history) ? '✅' : '❌');
    console.log('- Test 4 (geçersiz projectId):', result4 ? '✅' : '❌');
    
    const allPassed = result1 && result2 && Array.isArray(history) && result4;
    console.log('\n🏆 GENEL SONUÇ:', allPassed ? '✅ TÜM TESTLER BAŞARILI' : '❌ BAZI TESTLER BAŞARISIZ');
    
  } catch (error) {
    console.error('❌ Test sırasında hata oluştu:', error);
    console.error('📍 Hata detayı:', error.message);
  }
};

// Test'i çalıştır
testChatWithoutProject();