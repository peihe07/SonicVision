<template>
  <div class="terms-page">
    <div class="terms-container">
      <h1>服務條款</h1>
      <div class="terms-content">
        <section>
          <h2>1. 接受條款</h2>
          <p>歡迎使用 SonicVision。通過訪問或使用我們的服務，您同意受這些條款的約束。如果您不同意這些條款，請不要使用我們的服務。</p>
        </section>

        <section>
          <h2>2. 服務說明</h2>
          <p>SonicVision 提供音樂和電影相關的服務，包括但不限於：</p>
          <ul>
            <li>音樂和電影資訊瀏覽</li>
            <li>個人收藏管理</li>
            <li>社群互動功能</li>
            <li>個人化推薦</li>
          </ul>
        </section>

        <section>
          <h2>3. 用戶責任</h2>
          <p>作為用戶，您同意：</p>
          <ul>
            <li>提供準確的個人資料</li>
            <li>保護您的帳戶安全</li>
            <li>遵守所有適用的法律法規</li>
            <li>尊重其他用戶的權利</li>
          </ul>
        </section>

        <section>
          <h2>4. 智慧財產權</h2>
          <p>所有內容，包括但不限於文字、圖像、音樂、視頻等，均受智慧財產權法保護。未經授權，不得複製、修改或分發。</p>
        </section>

        <section>
          <h2>5. 免責聲明</h2>
          <p>我們不保證服務的連續性、無錯誤或無病毒。我們不對因使用或無法使用服務而造成的任何損失負責。</p>
        </section>

        <section>
          <h2>6. 條款修改</h2>
          <p>我們保留隨時修改這些條款的權利。修改後的條款將在網站上發布，並在發布時生效。</p>
        </section>

        <section>
          <h2>7. 終止</h2>
          <p>我們保留因違反這些條款而終止或暫停您使用服務的權利。</p>
        </section>

        <section>
          <h2>8. 適用法律</h2>
          <p>這些條款受中華民國法律管轄，任何爭議應提交中華民國法院解決。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsPage'
}
</script>

<style scoped>
.terms-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.terms-container {
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

.terms-content section {
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
  .terms-page {
    padding: 1rem;
  }

  .terms-container {
    padding: 1rem;
  }
}
</style> 