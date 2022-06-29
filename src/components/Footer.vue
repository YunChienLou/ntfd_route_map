<template>
  <div class="pt-5 pb-5 footer bg-dark">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-xs-12 about-company border-bottom pt-3">
          <h4>資料來源</h4>
          <p class="pr-5 text-white-50">
            <a href="https://data.gov.tw/dataset/126164"
              >政府資料開放平台，新北市狹小巷道列管清冊
              https://data.gov.tw/dataset/126164</a
            >
          </p>
        </div>
        <div class="col-lg-4 col-xs-12 links border-bottom pt-3">
          <h4 class="mt-lg-0 mt-sm-3">最後更新時間</h4>
          {{ lastUpdateTime }}
          <h4 class="mt-sm-3">資料筆數:{{ dataAmount }}</h4>
        </div>
        <div class="col-lg-4 col-xs-12 location border-bottom pt-3">
          <h4 class="mt-lg-0 mt-sm-4">發現問題? Bug?</h4>
          <p>有任何問題,反映改進意見,請聯繫我</p>
          <p>ryan58147@gmail.com</p>
        </div>
      </div>
      <div class="row mt-5 ">
        <div class="col copyright">
          <p class="">
            <small class="text-white-50"
              >© {{ currentYear }} 三重義消 隊員 羅云謙 All Rights
              Reserved.</small
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from "@vue/runtime-core";
import updateRecord from "../data/updateHistory.json";

export default {
  setup() {
    const currentYear = new Date().getFullYear();
    const lastUpdateTime = ref("");
    const dataAmount = ref(Number);
    onMounted(() => {
      let temp = updateRecord[updateRecord.length - 1].lastTime;
      lastUpdateTime.value = new Date(temp);
      dataAmount.value = updateRecord[updateRecord.length - 1].dataAmount;
    });

    return {
      currentYear,
      lastUpdateTime,
      dataAmount,
    };
  },
};
</script>
