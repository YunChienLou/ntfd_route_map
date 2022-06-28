// var Loader = require("@googlemaps/js-api-loader");
// import { Loader } from "@googlemaps/js-api-loader";
var request = require("request");
async function dataFormator() {
  const json = require("./data/data.json");
  for (let index = 0; index < json.length; index++) {
    var dangerRoad = json[index];
    // 字串找其中數字 以得知寬度、長度
    var roadInfo = numberGrabber(dangerRoad.The_width_and_length);
    dangerRoad.width = roadInfo.width;
    dangerRoad.long = roadInfo.long;
    dangerRoad.location = await FindByKeyWord(
      dangerRoad.District + dangerRoad.Location
    );
    console.log(dangerRoad);
  }
  // 存成檔案

  var fs = require("fs");
  var data = JSON.stringify(json);
  fs.writeFile("./data/test.json", data, function (err) {
    if (err) {
      console.log(err);
    }
  });
}
// 取代原The_width_and_length 改成 width , long 或是 抓第一個數字 定義寬度 分成 1~2 2~3 3~4 m
// 新增Latitude , Longitude 欄位 用location搜尋 geocoder api

function numberGrabber(str) {
  var roadInfo = {
    width: 0,
    long: 0,
  };
  var numArr = str.match(/\d+(\.\d+)?/g);
  roadInfo.width = numArr[0];
  roadInfo.long = numArr[2] || numArr[1];
  return roadInfo;
}

async function FindByKeyWord(str) {
  var location = {
    lat: 0,
    lng: 0,
  };
  var API_KEY = "AIzaSyAUix8SWrqOyR5XSpuGQk_62AdR0idfW9o";
  var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";

  var address = encodeURI(str);
  console.log(typeof address, address);

  var url = BASE_URL + address + "&key=" + API_KEY;
  console.log("url:", url);

  return new Promise(function (resolve, reject) {
    request(url, function (error, response, results) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(results);
        var resultNum  = data.results.length;
        if ((resultNum === 0 )) {
          location.lat = 0;
          location.lng = 0;
          resolve(location);
        }else{
        location.lat = data.results[0].geometry.location.lat;
        location.lng = data.results[0].geometry.location.lng;
        resolve(location);
        }
      } else {
        // The request failed, handle it
        console.log("The request failed", error);
        reject(error);
      }
    });
  });
}

dataFormator();
