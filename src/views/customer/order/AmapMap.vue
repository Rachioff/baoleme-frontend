<template>
  <div id="container" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const apiKey = import.meta.env.VITE_AMAP_API_KEY
const apiSecret = import.meta.env.VITE_AMAP_API_SECRET


// 替换为你自己申请的 key 和安全密钥
const AMAP_KEY = apiKey
const AMAP_SECURITY_CODE = apiSecret

// 添加这段代码来扩展 window 的类型
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string
    }
  }
}


onMounted(() => {
  // 1. 安全配置，必须在 loader.js 前设置
  window._AMapSecurityConfig = {
    securityJsCode: AMAP_SECURITY_CODE
  }

  // 2. 动态引入 loader.js 脚本
  const loaderScript = document.createElement('script')
  loaderScript.src = 'https://webapi.amap.com/loader.js'
  loaderScript.onload = () => {

    AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0'
    }).then((AMap: any) => {
      const map = new AMap.Map('container', {
        zoom: 13,
        center: [116.397428, 39.90923]
      })

      // 添加一个 Marker
      const marker = new AMap.Marker({
        position: [116.397428, 39.90923]
      })
      map.add(marker)

      // 信息窗体
      const infoWindow = new AMap.InfoWindow({
        isCustom: true,
        content: '<div style="padding: 8px;">HELLO, AMAP!</div>',
        offset: new AMap.Pixel(16, -45)
      })

      marker.on('click', (e: any) => {
        infoWindow.open(map, e.target.getPosition())
      })

      // 添加折线
      const lineArr = [
        [116.368904, 39.913423],
        [116.382122, 39.901176],
        [116.387271, 39.912501],
        [116.398258, 39.9046]
      ]
      const polyline = new AMap.Polyline({
        path: lineArr,
        strokeColor: '#3366FF',
        strokeWeight: 5,
        strokeStyle: 'solid'
      })
      map.add(polyline)
    }).catch((e: any) => {
      console.error('AMap load error', e)
    })
  }

  document.head.appendChild(loaderScript)
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
}
</style>
