<template>
  <div class="about">
    <h1>關於 SonicVision</h1>
    <div class="content">
      <section class="mission">
        <h2>我們的使命</h2>
        <p>SonicVision 致力於將聲音轉化為視覺體驗，幫助用戶更好地理解和分析聲音數據。我們運用最新的技術，為用戶提供專業的音頻分析解決方案。</p>
      </section>
      
      <section class="team">
        <h2>我們的團隊</h2>
        <p>我們的團隊由音頻工程師、軟件開發者和數據科學家組成，擁有豐富的行業經驗和專業知識。</p>
      </section>

      <section class="contact">
        <h2>聯繫我們</h2>
        <p>如果您有任何問題或建議，請隨時與我們聯繫：</p>
        <div class="contact-info">
          <p>📧 Email: contact@sonicvision.com</p>
          <p>📞 電話: (886) 2-1234-5678</p>
          <p>🏢 地址: 台北市信義區信義路五段7號</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 3rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

section {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.contact-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
}

.contact-info p {
  margin: 0.5rem 0;
}
</style> 