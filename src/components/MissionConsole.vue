<template>
  <div class="console">
    <div class="console-head">
      <div>
        <span class="label">Интерактивная зона</span>
        <h3>Mission Console</h3>
      </div>
      <span class="score">Score {{ missionScore }}</span>
    </div>

    <div class="tip-card">
      <span class="label">Активная подсказка</span>
      <p>{{ currentTip }}</p>
    </div>

    <div class="focus-card">
      <span class="label">Текущий этап</span>
      <h4>{{ selectedStage.title }}</h4>
      <p>{{ selectedStage.goal }}</p>
      <strong>Контрольный вопрос:</strong>
      <p>{{ selectedStage.questionAnchor }}</p>
    </div>

    <form class="input-card" @submit.prevent="submitNote">
      <label class="field">
        <span class="label">Добавить заметку к демо</span>
        <textarea
          v-model="draftNote"
          rows="3"
          placeholder="Например: В selectedStage данные вычисляются через computed."
        />
      </label>
      <div class="button-row">
        <button type="submit">Сохранить заметку</button>
        <button type="button" class="secondary" @click="$emit('boost-score')">
          Поднять score
        </button>
      </div>
    </form>

    <label class="field">
      <span class="label">Alias игрока</span>
      <input
        v-model="draftAlias"
        type="text"
        placeholder="Dev Runner"
        @change="submitAlias"
      />
    </label>

    <div class="split">
      <div class="log-card">
        <span class="label">Последние действия</span>
        <ul>
          <li v-for="entry in activityLog.slice(0, 4)" :key="entry">
            {{ entry }}
          </li>
        </ul>
      </div>

      <div class="log-card">
        <span class="label">Краткие заметки</span>
        <ul>
          <li v-for="note in notes.slice(0, 4)" :key="note">
            {{ note }}
          </li>
        </ul>
      </div>
    </div>

    <div class="player-card">
      <span class="label">Игрок</span>
      <strong>{{ player.alias }}</strong>
      <small>Базовый score: {{ player.score }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "MissionConsole",
  props: {
    activityLog: {
      type: Array,
      default: () => [],
    },
    currentTip: {
      type: String,
      default: "",
    },
    missionScore: {
      type: Number,
      default: 0,
    },
    notes: {
      type: Array,
      default: () => [],
    },
    player: {
      type: Object,
      required: true,
    },
    selectedStage: {
      type: Object,
      required: true,
    },
  },
  emits: ["add-note", "boost-score", "rename-player"],
  data() {
    return {
      draftAlias: this.player.alias,
      draftNote: "",
    };
  },
  watch: {
    "player.alias"(nextValue) {
      this.draftAlias = nextValue;
    },
  },
  methods: {
    submitAlias() {
      this.$emit("rename-player", this.draftAlias);
    },
    submitNote() {
      this.$emit("add-note", this.draftNote);
      this.draftNote = "";
    },
  },
};
</script>

<style scoped>
.console {
  display: grid;
  gap: 14px;
}

.console-head,
.tip-card,
.focus-card,
.input-card,
.log-card,
.player-card,
.field input,
.field textarea {
  border-radius: 22px;
}

.console-head,
.tip-card,
.focus-card,
.input-card,
.log-card,
.player-card {
  padding: 18px;
  background: rgba(19, 34, 56, 0.05);
}

.console-head {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.label {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(19, 34, 56, 0.58);
}

h3,
h4 {
  margin: 8px 0 0;
  font-family: "Space Grotesk", sans-serif;
}

h3 {
  font-size: 1.7rem;
}

h4 {
  font-size: 1.3rem;
}

.score {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(42, 157, 143, 0.14);
  color: #17675f;
  font-weight: 800;
}

.tip-card p,
.focus-card p {
  margin: 10px 0 0;
  line-height: 1.75;
}

.field {
  display: grid;
  gap: 8px;
}

.field textarea,
.field input {
  width: 100%;
  border: 1px solid rgba(19, 34, 56, 0.14);
  background: rgba(255, 255, 255, 0.84);
  padding: 14px;
  font: inherit;
  resize: vertical;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

button {
  min-height: 48px;
  padding: 0 18px;
  border: 0;
  border-radius: 16px;
  background: #132238;
  color: #f7f2e8;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

button.secondary {
  background: rgba(19, 34, 56, 0.08);
  color: #132238;
}

.split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.log-card ul {
  margin: 12px 0 0;
  padding-left: 18px;
  line-height: 1.8;
}

.player-card strong {
  display: block;
  margin-top: 10px;
  font-size: 1.3rem;
}

.player-card small {
  display: block;
  margin-top: 8px;
  color: rgba(19, 34, 56, 0.72);
}

@media (max-width: 640px) {
  .split,
  .button-row {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
