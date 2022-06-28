<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">新北市狹小巷道列管地圖</a>
      <button
        class="navbar-toggler"
        ref="navbarToggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        id="navbarToggler"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              class="nav-link"
              href=""
              >使用介紹</a
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled
            >
              統計資料
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
        </ul>
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            id="searchInput"
            placeholder="輸入查詢地址"
            aria-label="Search"
            v-model="searchContent"
          />
          <button
            class="btn btn-outline-success"
            type="submit"
            @click.prevent="doSearch()"
          >
            Search
          </button>
        </form>
      </div>
    </div>
    <div
      class="position-relative bg-success"
      style=""
      v-if="resultList.length > 0"
    >
      <div
        class="list-group position-absolute top-0 end-0 mt-lg-5 overflow-scroll bg-secondary border border-secondary"
        style="
          margin-top: 15vh;
          margin-right: 10vh;
          z-index: 3;
          height: 20vh;
          width: 70vw;
        "
      >
        <div class="bg-success position-relative">
          <h3 class="my-1">搜尋結果</h3>
          <button
            type="button"
            class="btn-close btn-close-white position-absolute top-0 end-0 mt-2 me-2"
            @click="closeSearchResult()"
          ></button>
        </div>
        <button
          v-for="(result, index) in resultList"
          :key="index"
          @click="passPosToMap(result.location)"
          class="list-group-item list-group-item-action list-group-item-dark"
          :disabled="result.Location == '查無此列管地點'"
        >
          {{ result.District }} {{ result.Location }}
        </button>
      </div>
    </div>
  </nav>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="color: black">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">快速入門</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h3>1.查詢特定地址是否列管</h3>
          <hr />
          <img
            class="mb-3"
            style="width: 70%"
            src="../assets/searchbar.png"
            alt=""
          />
          <h3>2.利用手機定位功能，查詢附近列管巷道</h3>
          <hr />
          <img
            class="mb-3"
            style="width: 30%"
            src="../assets/locate.png"
            alt=""
          />
          <h3>3.以街景服務，查看列管巷道情況</h3>
          <hr />
          <img
            class="mb-3"
            style="width: 30%"
            src="../assets/streetview.png"
            alt=""
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useGeolocation } from "../useGeolocation";
import { ref, inject, watch, onMounted, nextTick, computed } from "vue";
export default {
  emits: ["NavToApp"],
  setup(props, { emit }) {
    const { coords } = useGeolocation();
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    }));
    const searchContent = ref("");
    const resultList = ref([]);
    const data = require("../data/test.json");
    const jsonata = inject("$jsonQuery");
    const navbarToggler = ref(null);
    const doSearch = () => {
      var expression = jsonata(
        "*[`Location` ~> /" + searchContent.value + "/i ]"
      );
      var result = expression.evaluate(data);
      console.log(result);
      if (result == undefined) {
        resultList.value = [
          {
            District: "抱歉",
            Location: "查無此列管地點",
            location: { lat: currPos.value.lat, lng: currPos.value.lng },
          },
        ];
        console.log("no results");
      } else {
        resultList.value = result;
      }
    };
    watch(searchContent, () => {
      resultList.value.length = 0;
    });
    const closeSearchResult = () => {
      resultList.value.length = 0;
    };
    const passPosToMap = (pos) => {
      emit("NavToApp", pos);
      resultList.value.length = 0;
    };
    onMounted(() => {
      nextTick(() => {
        var navbarToggler2 = document.getElementById("navbarToggler");
        navbarToggler2.addEventListener("click", () => {
          resultList.value.length = 0;
        });
      });
    });
    return {
      searchContent,
      resultList,
      doSearch,
      passPosToMap,
      navbarToggler,
      closeSearchResult,
    };
  },
};
</script>
<style></style>
