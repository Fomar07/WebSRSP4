<template>
  <article class="card" :class="{ active }">
    <button class="card-header" type="button" @click="$emit('focus-stage')">
      <div>
        <span class="order">Этап {{ stage.order }}</span>
        <h3>{{ stage.title }}</h3>
      </div>
      <span class="tag">{{ stage.tag }}</span>
    </button>

    <p class="narrative">{{ stage.narrative }}</p>

    <div class="meta-row">
      <span>{{ stage.difficulty }}</span>
      <span>{{ stage.codeFocus }}</span>
      <span>{{ notesCount }} заметки</span>
    </div>

    <div class="step-list">
      <label
        v-for="step in stage.steps"
        :key="step.id"
        class="step-item"
      >
        <input
          :checked="step.done"
          type="checkbox"
          @change="$emit('toggle-step', step.id)"
        />
        <span>{{ step.label }}</span>
      </label>
    </div>
  </article>
</template>

<script>
export default {
  name: "QuestStageCard",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    notesCount: {
      type: Number,
      default: 0,
    },
    stage: {
      type: Object,
      required: true,
    },
  },
  emits: ["focus-stage", "toggle-step"],
};
</script>

<style scoped>
.card {
  padding: 18px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(248, 242, 232, 0.98));
  border: 1px solid rgba(19, 34, 56, 0.08);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.card.active {
  transform: translateY(-2px);
  border-color: rgba(42, 157, 143, 0.5);
  box-shadow: 0 20px 34px rgba(42, 157, 143, 0.12);
}

.card-header {
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.order {
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(19, 34, 56, 0.6);
}

h3 {
  margin: 8px 0 0;
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.45rem;
  line-height: 1.05;
}

.tag {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(242, 164, 72, 0.16);
  color: #9a5b10;
  font-size: 0.82rem;
  font-weight: 800;
}

.narrative {
  margin: 14px 0 0;
  line-height: 1.8;
  color: rgba(19, 34, 56, 0.8);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.meta-row span {
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(19, 34, 56, 0.06);
  font-size: 0.8rem;
  color: rgba(19, 34, 56, 0.72);
}

.step-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.step-item input {
  inline-size: 18px;
  block-size: 18px;
  accent-color: #2a9d8f;
}
</style>
