import { onUnmounted, onMounted, ref } from "vue";

export function useGeolocation() {
  const coords = ref({ latitude: 122, longitude: 25 });
  const isSupported = "navigator" in window && "geolocation" in navigator;
  var watchoptions = {
    enableHighAccuracy: true,
  };
  let watcher = null;
  onMounted(() => {
    if (isSupported) {
      watcher = navigator.geolocation.watchPosition(
        (position) => (coords.value = position.coords),
        consoleErr,
        watchoptions
      );
    } else {
      alert("此瀏覽器不支援定位");
    }
  });
  onUnmounted(() => {
    if (watcher) navigator.geolocation.clearWatch(watcher);
  });

  return { coords, isSupported };
}
function consoleErr(err) {
  alert(err, "系統維修中....");
  alert(err.code, "系統維修中....");
  alert(err.message, "系統維修中....");
}
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
