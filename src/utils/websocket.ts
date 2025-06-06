// 实时反馈定位
import { ref } from 'vue'

export function useWebSocket(url:string) {
  const socket = new WebSocket(url)

  socket.onopen = () => {
    console.log('WebSocket connected')
  }

  socket.onerror = (e) => {
    console.error('WebSocket error:', e)
  }

  function sendLocation(data:any) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'location_update',
        payload: data
      }))
    }
  }

  return { sendLocation }
}
