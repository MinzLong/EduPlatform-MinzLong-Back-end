import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import focusDirective from './directives/focus';
import store from './store/store'; // Correctly import the store


const app = createApp(App);

app.directive('focus', focusDirective);
app.use(router);
app.use(store);
app.mount('#app');
