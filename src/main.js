import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import JsonQuery from "jsonata";


const app = createApp(App);
app.provide("$jsonQuery",JsonQuery);
app.mount("#app");
