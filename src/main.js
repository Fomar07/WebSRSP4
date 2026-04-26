const { loadModule } = window["vue3-sfc-loader"];

const loaderOptions = {
  moduleCache: {
    vue: window.Vue,
  },
  getFile(url) {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`Не удалось загрузить ${url}`);
      }

      return response.text();
    });
  },
  addStyle(textContent) {
    const style = Object.assign(document.createElement("style"), {
      textContent,
    });

    document.head.appendChild(style);
  },
};

const RootComponent = window.Vue.defineAsyncComponent(() =>
  loadModule("./src/App.vue", loaderOptions),
);

window.Vue.createApp(RootComponent).mount("#app");
