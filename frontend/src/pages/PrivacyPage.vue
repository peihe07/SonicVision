<template>
  <div class="privacy-page">
    <div class="privacy-container">
      <h1>隱私政策</h1>
      <div class="privacy-content">
        <section>
          <h2>1. 資料收集</h2>
          <p>我們收集的資料包括：</p>
          <ul>
            <li>個人資料（姓名、電子郵件等）</li>
            <li>使用數據（瀏覽歷史、搜尋記錄等）</li>
            <li>設備信息（瀏覽器類型、操作系統等）</li>
            <li>位置信息（IP地址、地理位置等）</li>
          </ul>
        </section>

        <section>
          <h2>2. 資料使用</h2>
          <p>我們使用收集的資料：</p>
          <ul>
            <li>提供和改進服務</li>
            <li>個人化用戶體驗</li>
            <li>發送服務通知</li>
            <li>防止欺詐和濫用</li>
          </ul>
        </section>

        <section>
          <h2>3. 資料共享</h2>
          <p>我們不會出售您的個人資料。我們只在以下情況下共享資料：</p>
          <ul>
            <li>經您同意</li>
            <li>法律要求</li>
            <li>保護我們的權利和財產</li>
            <li>與服務提供商合作</li>
          </ul>
        </section>

        <section>
          <h2>4. 資料安全</h2>
          <p>我們採取適當的技術和組織措施來保護您的資料，包括：</p>
          <ul>
            <li>加密傳輸和存儲</li>
            <li>定期安全評估</li>
            <li>訪問控制</li>
            <li>員工培訓</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookie 使用</h2>
          <p>我們使用 Cookie 和類似技術來：</p>
          <ul>
            <li>記住您的偏好設置</li>
            <li>分析網站使用情況</li>
            <li>提供個性化內容</li>
            <li>改善用戶體驗</li>
          </ul>
        </section>

        <section>
          <h2>6. 您的權利</h2>
          <p>您對您的個人資料擁有以下權利：</p>
          <ul>
            <li>訪問和查看資料</li>
            <li>更正不準確的資料</li>
            <li>刪除資料</li>
            <li>限制資料處理</li>
            <li>資料可攜性</li>
          </ul>
        </section>

        <section>
          <h2>7. 政策更新</h2>
          <p>我們可能會不時更新本隱私政策。更新後的政策將在網站上發布，並在發布時生效。</p>
        </section>

        <section>
          <h2>8. 聯絡我們</h2>
          <p>如果您對本隱私政策有任何疑問，請通過以下方式聯絡我們：</p>
          <p>電子郵件：privacy@sonicvision.com</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPage'
}
</script>

<style scoped>
.privacy-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.privacy-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  color: #34495e;
  margin: 1.5rem 0 1rem;
  font-size: 1.5rem;
}

.privacy-content section {
  margin-bottom: 2rem;
}

p {
  line-height: 1.6;
  color: #444;
  margin-bottom: 1rem;
}

ul {
  list-style-type: disc;
  margin-left: 2rem;
  margin-bottom: 1rem;
}

li {
  line-height: 1.6;
  color: #444;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .privacy-page {
    padding: 1rem;
  }

  .privacy-container {
    padding: 1rem;
  }
}
</style> 