<template>
  <Nav
    @NavToApp="
      (pos) => {
        passLocation = pos;
      }
    "
  />
  <Map :passInLocation="passLocation" />
  <Footer />
</template>

<script>
import Nav from "@/components/Nav.vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";

import { onMounted, ref, watch } from "vue";
export default {
  name: "App",
  components: {
    Nav,
    Footer,
    Map,
  },
  
  setup() {
    const passLocation = ref({});
    const passAppToMap = () => {};
    watch(passLocation, passAppToMap());
    onMounted(() => {});
    return { passLocation };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  background: #2c3e50;
  height: 120vh;
  margin: 0%;
}
</style>
