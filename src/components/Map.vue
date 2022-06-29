<template>
  <div class="loading"></div>
  <div class="position-relative" id="map2">
    <div class="" style="z-index: 1">
      <p>track mode : {{ states.trackMode }}</p>
      <p>目前位置 : {{ currPos }}</p>
    </div>
    <button
      type="button"
      style="z-index: 1; width: 40px; height: 40px; padding: 3px"
      class="btn btn-warning position-absolute top-50 end-0 me-2"
      @click.prevent="
        () => {
          states.trackMode = true;
          followClient();
        }
      "
    >
      <img
        src="https://earth.google.com/images/kml-icons/track-directional/track-14.png"
        style="width: 20px; padding-bottom: 4px"
        alt="locate_my_pos"
      />
    </button>
    <div id="map" class="text-dark" style="width: 100%; height: 80vh" />
  </div>

  <div class="info container">
    <div class="row">
      <div class="col my-2">
        <img
          style="width: 30px"
          src="https://maps.google.com/mapfiles/kml/pal3/icon45.png"
          alt=""
        />
        <h4 class="text-success">路寬超過3.5公尺</h4>
      </div>
      <div class="col my-2">
        <img
          style="width: 30px"
          src="https://maps.google.com/mapfiles/kml/pal4/icon15.png"
          alt=""
        />
        <h4 class="text-warning">路寬介於2.2~3.5公尺</h4>
      </div>
      <div class="col my-2">
        <img
          style="width: 30px"
          src="https://maps.google.com/mapfiles/kml/shapes/caution.png"
          alt=""
        />
        <h4 class="text-danger">路寬小於2.2公尺</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { useGeolocation } from "../useGeolocation";
import { Loader } from "@googlemaps/js-api-loader";
import {
  toRaw,
  watch,
  computed,
  ref,
  onMounted,
  onUnmounted,
  reactive,
} from "vue";
import targetData from "../data/test.json";

export default {
  props: ["passInLocation"],
  setup(props) {
    const isInit = ref(false);
    const { coords } = useGeolocation();
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    }));
    const states = reactive({
      google: null,
      map: null,
      markers: null,
      center: null,
      clientTarget: [],
      trackMode: true,
      trackCountDown: 0,
    });
    const clientTarget = ref(null);
    let clickListener = null;
    const isLoading = false;
    var timeOut = window.setTimeout(() => {
      states.trackMode = true;
    }, 5000);
    onMounted(async () => {
      await initMap();
      handleLoadMarkers();
    });
    onUnmounted(async () => {
      if (clickListener) clickListener.remove();
      if (timeOut) clearListeners(timeOut);
    });

    // const haversineDistance = (pos1, pos2) => {
    //   const R = 3958.8; // Radius of the Earth in miles
    //   const rlat1 = pos1.lat * (Math.PI / 180); // Convert degrees to radians
    //   const rlat2 = pos2.lat * (Math.PI / 180); // Convert degrees to radians
    //   const difflat = rlat2 - rlat1; // Radian difference (latitudes)
    //   const difflon = (pos2.lng - pos1.lng) * (Math.PI / 180); // Radian difference (longitudes)
    //   const d =
    //     2 *
    //     R *
    //     Math.asin(
    //       Math.sqrt(
    //         Math.sin(difflat / 2) * Math.sin(difflat / 2) +
    //           Math.cos(rlat1) *
    //             Math.cos(rlat2) *
    //             Math.sin(difflon / 2) *
    //             Math.sin(difflon / 2)
    //       )
    //     );
    //   return d;
    // };
    // const distance = computed(() =>
    //   otherPos.value === null
    //     ? 0
    //     : haversineDistance(currPos.value, otherPos.value)
    // );

    const initMap = async () => {
      const mapDiv = document.getElementById("map");
      const loader = new Loader({
        apiKey: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
        version: "weekly",
        language: "zh-TW",
      });
      states.google = await loader.load();
      states.map = new states.google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.05825, lng: 121.49093 },
        zoom: 12,
        mapTypeControl: true,
        fullscreenControl: true,
        scaleControl: true,
        minZoom: 11,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
        },
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        scaleControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });
      // We add a DOM event here to show an alert if the DIV containing the
      // map is clicked.
      // states.google.maps.event.addDomListener(mapDiv, "center_changed", () => {
      //   states.trackMode = false;
      //   clearTimeout(timeOut);
      //   timeOut = window.setTimeout(() => {
      //     states.trackMode = true;
      //   }, 5000);
      // });
      states.map.addListener("center_changed", () => {
        states.trackMode = false;
        clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
          states.trackMode = true;
        }, 5000);
      });
      isInit.value = true;
      console.log("init finished");
    };

    const followClient = () => {
      if (clientTarget.value != null && states.trackMode == true) {
        toRaw(clientTarget.value).setMap(null);
        console.log("clear pre posi");
        console.log(clientTarget.value);
      }
      if (isInit.value == true && states.trackMode == true) {
        states.center = new states.google.maps.LatLng(
          currPos.value.lat,
          currPos.value.lng
        );
        states.map.panTo(states.center);
        states.map.setZoom(16);
        console.log("出發找Client");

        var marker = new states.google.maps.Marker({
          position: { lat: currPos.value.lat, lng: currPos.value.lng },
          map: states.map,
          title: "您的位置",
          draggable: false,
          icon: {
            url: "https://maps.google.com/mapfiles/kml/pal3/icon28.png",
            size: new states.google.maps.Size(30, 30),
            scaledSize: new states.google.maps.Size(30, 30),
          },
        });
        clientTarget.value = marker;
      }
    };
    watch(currPos, () => {
      followClient();
    });
    watch(props, (newprops) => {
      var goToLocation = newprops.passInLocation;
      states.trackMode = false;
      states.center = new states.google.maps.LatLng(
        goToLocation.lat,
        goToLocation.lng
      );
      states.map.panTo(states.center);
      states.map.setZoom(20);
    });
    const handleLoadMarkers = async () => {
      var prev_infowindow = false;
      targetData.forEach((i) => {
        var bannedVehical = "";
        var iconUrlLink;
        if (i.width >= 3.5) {
          iconUrlLink = "https://maps.google.com/mapfiles/kml/pal3/icon45.png";
          bannedVehical = "請注意，有可能道路過窄";
        } else if (3.5 >= i.width && i.width > 2.2) {
          iconUrlLink = "https://maps.google.com/mapfiles/kml/pal4/icon15.png";
          bannedVehical = "救災車輛無法通行";
        } else {
          iconUrlLink =
            "https://maps.google.com/mapfiles/kml/shapes/caution.png";
          bannedVehical = "救護車輛無法通行";
        }
        var contentString = `<div id="content" style="color: black"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">${i.Location}</h1><div id="bodyContent"><p><b>地址:${i.District}${i.Location}</b></br><b>道路資訊:${i.The_width_and_length}</b></br><b>所屬轄區:${i.Fire_Branch}</b></br><b style="color:red">警告:${bannedVehical}</b></div></div>`;
        var infowindow = new states.google.maps.InfoWindow({
          content: contentString,
        });

        var marker = new states.google.maps.Marker({
          position: { lat: i.location.lat, lng: i.location.lng },
          map: states.map,
          title: i.Location,
          draggable: false,
          icon: {
            url: iconUrlLink,
            size: new states.google.maps.Size(30, 30),
            scaledSize: new states.google.maps.Size(30, 30),
          },
        });
        states.google.maps.event.addListener(marker, "click", function () {
          if (prev_infowindow) {
            prev_infowindow.close();
          }
          states.map.setZoom(20);
          states.center = new states.google.maps.LatLng(
            i.location.lat,
            i.location.lng
          );
          states.map.panTo(states.center);
          prev_infowindow = infowindow;
          infowindow.open({
            anchor: marker,
            map,
            shouldFocus: true,
          });
        });
        states.google.maps.event.addListener(
          infowindow,
          "closeclick",
          function () {
            states.map.setZoom(16); //removes the marker
            // then, remove the infowindows name from the array
          }
        );
      });
    };

    return { currPos, isLoading, states, followClient };
  },
};
</script>
<style></style>
