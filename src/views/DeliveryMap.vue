<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted } from "vue";

(window as any)._AMapSecurityConfig = {
    serviceHost: import.meta.env.VITE_AMAP_SERVICE,
}

let map: any
let AMap: any

interface Props {
    startLongitude: number
    startLatitude: number
    currentLongitude: number
    currentLatitude: number
    endLongitude: number
    endLatitude: number
}
const props = defineProps<Props>()

onMounted(async () => {
    AMap = await AMapLoader.load({
        key: import.meta.env.VITE_AMAP_KEY,
        version: "2.0",
        plugins: ["AMap.Scale"],
    })
    map = new AMap.Map("container", {
        viewMode: '3D',
        zoom: 11,
        center: [props.currentLongitude, props.currentLatitude],
    })
})


</script>
<template>
    <div id="container"></div>
</template>