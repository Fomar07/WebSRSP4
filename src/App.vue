<template>
  <div class="shell">
    <header class="hero">
      <div class="hero-copy">
        <span class="eyebrow">СРСП №4 • Vue.js Quest Demo</span>
        <h1>Vue Quest Lab</h1>
        <p class="lead">
          Интерактивный сюжетный стенд для викторины: студент проходит путь
          разработчика от запуска проекта до работы с компонентами,
          реактивностью и передачей props.
        </p>
        <div class="hero-metrics">
          <div class="metric-card">
            <span class="metric-label">Прогресс миссии</span>
            <strong>{{ progressPercent }}%</strong>
            <small>{{ completedStageCount }} из {{ stages.length }} этапов активированы</small>
          </div>
          <div class="metric-card accent">
            <span class="metric-label">Текущий score</span>
            <strong>{{ missionScore }}</strong>
            <small>Считается из задач, активности и выбранного этапа</small>
          </div>
        </div>
      </div>
      <aside class="hero-status">
        <div class="status-chip">
          <span>Текущий этап</span>
          <strong>{{ selectedStage.title }}</strong>
        </div>
        <div class="status-chip">
          <span>Режим игрока</span>
          <strong>{{ player.alias }}</strong>
        </div>
        <button class="ghost-button" type="button" @click="cycleTip">
          Следующая подсказка
        </button>
      </aside>
    </header>

    <main class="dashboard">
      <section class="stage-panel">
        <div class="section-heading">
          <div>
            <span class="section-kicker">Карта квеста</span>
            <h2>Путь Vue-разработчика</h2>
          </div>
          <label class="compact-field">
            <span>Фильтр</span>
            <select v-model="activeStageId">
              <option
                v-for="stage in stages"
                :key="stage.id"
                :value="stage.id"
              >
                {{ stage.order }}. {{ stage.title }}
              </option>
            </select>
          </label>
        </div>

        <transition-group
          name="stage-list"
          tag="div"
          class="stage-grid"
        >
          <QuestStageCard
            v-for="stage in stages"
            :key="stage.id"
            :stage="stage"
            :active="stage.id === activeStageId"
            :notes-count="notes.length"
            @focus-stage="activeStageId = stage.id"
            @toggle-step="toggleStep(stage.id, $event)"
          />
        </transition-group>
      </section>

      <section class="console-panel">
        <MissionConsole
          :selected-stage="selectedStage"
          :current-tip="currentTip"
          :mission-score="missionScore"
          :player="player"
          :notes="notes"
          :activity-log="activityLog"
          @add-note="addNote"
          @boost-score="boostScore"
          @rename-player="renamePlayer"
        />
      </section>
    </main>

    <section class="insight-layout">
      <CodeInsightPanel
        :selected-stage="selectedStage"
        :progress-percent="progressPercent"
        :resource-links="resourceLinks"
      />

      <aside class="summary-card">
        <span class="section-kicker">Почему это подходит под задание</span>
        <h2>Что демонстрирует проект</h2>
        <ul>
          <li>Компонентную архитектуру на `.vue` файлах.</li>
          <li>Реактивность через `ref`, `reactive`, `computed` и `watch`.</li>
          <li>Передачу `props` в дочерние компоненты.</li>
          <li>Сюжетную структуру, на которую можно опереть Kahoot-квест.</li>
        </ul>
      </aside>
    </section>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import QuestStageCard from "./components/QuestStageCard.vue";
import MissionConsole from "./components/MissionConsole.vue";
import CodeInsightPanel from "./components/CodeInsightPanel.vue";

const questStages = [
  {
    id: "setup",
    order: 1,
    title: "Установка зависимостей",
    tag: "Vite + Vue",
    difficulty: "Старт",
    narrative:
      "Разработчик получает чистую рабочую директорию и должен выбрать современный способ запуска проекта.",
    goal:
      "Понять, почему для новых Vue-проектов рекомендуют Vite и команду create-vue.",
    codeFocus: "src/App.vue и точка входа src/main.js",
    questionAnchor:
      "Какой инструмент сейчас рекомендуется для старта Vue-проекта вместо Vue CLI?",
    steps: [
      { id: "setup-1", label: "Проверить стартовую команду проекта", done: true },
      { id: "setup-2", label: "Определить роль Vite в проекте", done: true },
      { id: "setup-3", label: "Собрать стартовую структуру приложения", done: false },
    ],
    snippet: `npm create vue@latest\ncd vue-quest-lab\nnpm install\nnpm run dev`,
    takeaways: [
      "Vite быстро поднимает dev-сервер и поддерживает Vue SFC.",
      "Vue CLI находится в maintenance mode и чаще нужен только для старых проектов.",
    ],
  },
  {
    id: "components",
    order: 2,
    title: "Создание компонента",
    tag: "SFC",
    difficulty: "База",
    narrative:
      "После инициализации проекта интерфейс нужно разбить на переиспользуемые части.",
    goal:
      "Показать, как структура Single File Component делит шаблон, логику и стиль.",
    codeFocus: "src/components/QuestStageCard.vue",
    questionAnchor:
      "Из каких трех основных блоков обычно состоит файл .vue?",
    steps: [
      { id: "components-1", label: "Выделить карточку этапа в отдельный компонент", done: true },
      { id: "components-2", label: "Передать данные в компонент через props", done: false },
      { id: "components-3", label: "Изолировать локальные стили компонента", done: false },
    ],
    snippet:
      `<template>\n  <QuestStageCard :stage="stage" />\n</template>\n\n<script>\nexport default {\n  props: {\n    stage: Object,\n  },\n};\n<\\/script>`,
    takeaways: [
      "Компоненты помогают разбивать приложение на читаемые независимые блоки.",
      "SFC-файлы делают шаблон и логику связанными, но не смешивают ответственность.",
    ],
  },
  {
    id: "reactivity",
    order: 3,
    title: "Работа с data и methods",
    tag: "ref / reactive",
    difficulty: "Средний",
    narrative:
      "Когда интерфейс оживает, приложение начинает реагировать на действия пользователя.",
    goal:
      "Закрепить, как ref, reactive и computed управляют изменяемым состоянием.",
    codeFocus: "src/App.vue",
    questionAnchor:
      "Почему изменение значения в ref обновляет интерфейс без ручного рендера?",
    steps: [
      { id: "reactivity-1", label: "Добавить ref для активного этапа", done: true },
      { id: "reactivity-2", label: "Посчитать прогресс через computed", done: false },
      { id: "reactivity-3", label: "Отслеживать действия пользователя через watch", done: false },
    ],
    snippet:
      `const activeStageId = ref("setup");\nconst commandCount = ref(3);\nconst player = reactive({ alias: "Dev Runner", score: 68 });`,
    takeaways: [
      "ref подходит для примитивов и точечных значений.",
      "reactive удобно использовать для объектов с несколькими связанными полями.",
    ],
  },
  {
    id: "props",
    order: 4,
    title: "Передача props",
    tag: "Данные вниз",
    difficulty: "Финиш",
    narrative:
      "На финальном этапе данные нужно передать дочерним компонентам, не ломая логику приложения.",
    goal:
      "Понять однонаправленный поток данных и связь между родителем и дочерним компонентом.",
    codeFocus: "src/components/MissionConsole.vue",
    questionAnchor:
      "Почему props передаются от родителя к дочернему компоненту, а не наоборот?",
    steps: [
      { id: "props-1", label: "Передать текущий этап в MissionConsole", done: true },
      { id: "props-2", label: "Показать вычисленные показатели в дочернем блоке", done: false },
      { id: "props-3", label: "Обновить интерфейс после пользовательского выбора", done: false },
    ],
    snippet:
      `<MissionConsole\n  :selected-stage="selectedStage"\n  :mission-score="missionScore"\n  :current-tip="currentTip"\n/>`,
    takeaways: [
      "Props помогают держать источник правды в родителе.",
      "Для обратной связи дочерний компонент обычно отправляет событие наверх.",
    ],
  },
];

const missionTips = [
  "Откройте src/App.vue и найдите ref для activeStageId.",
  "Посмотрите, как компонент QuestStageCard получает stage через props.",
  "Сравните ref и reactive: какой вариант используется для player?",
  "Вспомните, почему onMounted нужен после первичного рендера.",
];

const resourceLinks = [
  {
    label: "Vue Tooling Guide",
    href: "https://vuejs.org/guide/scaling-up/tooling",
  },
  {
    label: "Reactivity Fundamentals",
    href: "https://vuejs.org/guide/essentials/reactivity-fundamentals.html",
  },
  {
    label: "Lifecycle Hooks",
    href: "https://vuejs.org/guide/essentials/lifecycle.html",
  },
];

export default {
  name: "App",
  components: {
    QuestStageCard,
    MissionConsole,
    CodeInsightPanel,
  },
  setup() {
    const stages = ref(
      questStages.map((stage) => ({
        ...stage,
        steps: stage.steps.map((step) => ({ ...step })),
      })),
    );
    const activeStageId = ref("setup");
    const tipIndex = ref(0);
    const notes = ref([
      "В App.vue используется Composition API для управления состоянием.",
      "MissionConsole получает данные через props и не владеет источником состояния.",
    ]);
    const activityLog = ref([
      "Квест инициализирован.",
      "Игроку доступен первый этап маршрута.",
    ]);
    const player = reactive({
      alias: "Dev Runner",
      score: 68,
    });

    const selectedStage = computed(
      () =>
        stages.value.find((stage) => stage.id === activeStageId.value) ??
        stages.value[0],
    );

    const completedStageCount = computed(
      () =>
        stages.value.filter((stage) =>
          stage.steps.every((step) => step.done),
        ).length,
    );

    const completedSteps = computed(() =>
      stages.value.flatMap((stage) => stage.steps).filter((step) => step.done)
        .length,
    );

    const totalSteps = computed(() =>
      stages.value.reduce((accumulator, stage) => accumulator + stage.steps.length, 0),
    );

    const progressPercent = computed(() =>
      Math.round((completedSteps.value / totalSteps.value) * 100),
    );

    const missionScore = computed(() =>
      Math.min(
        100,
        player.score +
          completedStageCount.value * 6 +
          notes.value.length * 2 +
          (selectedStage.value.id === "props" ? 4 : 0),
      ),
    );

    const currentTip = computed(() => missionTips[tipIndex.value]);

    const cycleTip = () => {
      tipIndex.value = (tipIndex.value + 1) % missionTips.length;
    };

    const toggleStep = (stageId, stepId) => {
      const stage = stages.value.find((item) => item.id === stageId);

      if (!stage) {
        return;
      }

      const step = stage.steps.find((item) => item.id === stepId);

      if (!step) {
        return;
      }

      step.done = !step.done;
      activityLog.value.unshift(
        `${stage.title}: "${step.label}" ${step.done ? "выполнено" : "снято"}.`,
      );
    };

    const addNote = (note) => {
      if (!note.trim()) {
        return;
      }

      notes.value.unshift(note.trim());
      activityLog.value.unshift("Добавлена новая заметка по проекту.");
    };

    const boostScore = () => {
      player.score = Math.min(92, player.score + 3);
      activityLog.value.unshift("Игрок усилил score через мини-действие.");
    };

    const renamePlayer = (alias) => {
      if (!alias.trim()) {
        return;
      }

      player.alias = alias.trim();
      activityLog.value.unshift(`Игрок сменил alias на "${player.alias}".`);
    };

    watch(activeStageId, (nextStageId, previousStageId) => {
      if (!previousStageId) {
        return;
      }

      activityLog.value.unshift(
        `Маршрут переключен: ${previousStageId} -> ${nextStageId}.`,
      );
    });

    onMounted(() => {
      activityLog.value.unshift(
        "onMounted: интерфейс готов к показу и может работать с DOM.",
      );
    });

    return {
      activeStageId,
      activityLog,
      completedStageCount,
      currentTip,
      cycleTip,
      missionScore,
      notes,
      player,
      progressPercent,
      renamePlayer,
      resourceLinks,
      selectedStage,
      stages,
      toggleStep,
      addNote,
      boostScore,
    };
  },
};
</script>

<style scoped>
.shell {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
  padding: 26px 0 42px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.9fr);
  gap: 22px;
  align-items: stretch;
}

.hero-copy,
.hero-status,
.stage-panel,
.console-panel,
.summary-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(19, 34, 56, 0.1);
  box-shadow: 0 25px 65px rgba(19, 34, 56, 0.1);
  backdrop-filter: blur(18px);
}

.hero-copy {
  padding: 32px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
}

.hero-copy::after {
  content: "";
  position: absolute;
  inset: auto -70px -80px auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(242, 164, 72, 0.52), transparent 68%);
}

.hero-status {
  padding: 24px;
  border-radius: 30px;
  display: grid;
  gap: 14px;
  align-content: start;
}

.eyebrow,
.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(42, 157, 143, 0.12);
  color: #17675f;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 14px 0 0;
  font-family: "Space Grotesk", sans-serif;
  line-height: 0.95;
}

h1 {
  font-size: clamp(2.8rem, 6vw, 5rem);
}

h2 {
  font-size: clamp(1.55rem, 3vw, 2.4rem);
}

.lead {
  width: min(62ch, 100%);
  margin: 18px 0 0;
  font-size: 1.06rem;
  line-height: 1.8;
  color: rgba(19, 34, 56, 0.82);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.metric-card,
.status-chip,
.summary-card,
.compact-field select {
  border-radius: 22px;
}

.metric-card {
  padding: 18px 20px;
  background: rgba(19, 34, 56, 0.05);
}

.metric-card.accent {
  background: linear-gradient(135deg, rgba(242, 164, 72, 0.18), rgba(42, 157, 143, 0.16));
}

.metric-label,
.status-chip span,
.compact-field span {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(19, 34, 56, 0.64);
}

.metric-card strong,
.status-chip strong {
  display: block;
  margin-top: 10px;
  font-size: 2rem;
  line-height: 1;
}

.metric-card small {
  display: block;
  margin-top: 10px;
  line-height: 1.6;
  color: rgba(19, 34, 56, 0.72);
}

.status-chip {
  padding: 18px;
  background: rgba(19, 34, 56, 0.05);
}

.ghost-button {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, #132238, #225b63);
  color: #f9f4ea;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.ghost-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(19, 34, 56, 0.18);
}

.dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
  gap: 22px;
  margin-top: 22px;
}

.stage-panel,
.console-panel {
  border-radius: 30px;
  padding: 24px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 18px;
  margin-bottom: 18px;
}

.compact-field {
  display: grid;
  gap: 8px;
  min-width: 230px;
}

.compact-field select {
  width: 100%;
  min-height: 50px;
  border: 1px solid rgba(19, 34, 56, 0.14);
  padding: 0 14px;
  font: inherit;
  background: rgba(255, 255, 255, 0.88);
  color: #132238;
}

.stage-grid {
  display: grid;
  gap: 16px;
}

.insight-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.75fr);
  gap: 22px;
  margin-top: 22px;
}

.summary-card {
  padding: 24px;
  align-self: stretch;
}

.summary-card ul {
  margin: 18px 0 0;
  padding-left: 18px;
  line-height: 1.9;
}

.stage-list-enter-active,
.stage-list-leave-active {
  transition: all 220ms ease;
}

.stage-list-enter-from,
.stage-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 1080px) {
  .hero,
  .dashboard,
  .insight-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .shell {
    width: min(100% - 18px, 100%);
    padding-top: 14px;
  }

  .hero-copy,
  .hero-status,
  .stage-panel,
  .console-panel,
  .summary-card {
    border-radius: 24px;
    padding: 18px;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .section-heading {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
