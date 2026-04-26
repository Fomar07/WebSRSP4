<template>
  <section class="insight-card">
    <div class="headline">
      <div>
        <span class="label">Code Insight</span>
        <h3>Фрагмент, который можно показать в квесте</h3>
      </div>
      <span class="progress">{{ progressPercent }}%</span>
    </div>

    <div class="snippet-wrap">
      <pre><code>{{ selectedStage.snippet }}</code></pre>
    </div>

    <div class="grid">
      <div class="panel">
        <span class="label">Что объяснить студенту</span>
        <ul>
          <li v-for="takeaway in selectedStage.takeaways" :key="takeaway">
            {{ takeaway }}
          </li>
        </ul>
      </div>

      <div class="panel">
        <span class="label">Полезные ссылки</span>
        <ul>
          <li v-for="resource in resourceLinks" :key="resource.href">
            <a :href="resource.href" target="_blank" rel="noreferrer">
              {{ resource.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CodeInsightPanel",
  props: {
    progressPercent: {
      type: Number,
      default: 0,
    },
    resourceLinks: {
      type: Array,
      default: () => [],
    },
    selectedStage: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.insight-card {
  padding: 24px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(19, 34, 56, 0.1);
  box-shadow: 0 25px 65px rgba(19, 34, 56, 0.1);
  backdrop-filter: blur(18px);
}

.headline {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 14px;
}

.label {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(19, 34, 56, 0.58);
}

h3 {
  margin: 10px 0 0;
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(1.4rem, 2.6vw, 2rem);
}

.progress {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(242, 164, 72, 0.16);
  color: #9a5b10;
  font-weight: 800;
}

.snippet-wrap {
  margin-top: 18px;
  overflow: auto;
  border-radius: 24px;
  background: #132238;
}

pre {
  margin: 0;
  padding: 18px;
  font-size: 0.92rem;
  line-height: 1.7;
  color: #f2e9da;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.panel {
  padding: 18px;
  border-radius: 22px;
  background: rgba(19, 34, 56, 0.05);
}

.panel ul {
  margin: 12px 0 0;
  padding-left: 18px;
  line-height: 1.85;
}

.panel a {
  color: #17675f;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
