import { ref } from 'vue';

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export function useGeolocation() {
  const coordinates = ref<GeolocationCoordinates | null>(null);
  const error = ref<GeolocationError | null>(null);
  const isLocating = ref(false);

  const getCurrentLocation = (options?: PositionOptions): Promise<GeolocationCoordinates> => {
    isLocating.value = true;
    error.value = null;
    coordinates.value = null;

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = { code: -1, message: '浏览器不支持地理位置服务。' };
        error.value = err;
        isLocating.value = false;
        reject(err);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          coordinates.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
          };
          isLocating.value = false;
          resolve(coordinates.value);
        },
        (err) => {
          error.value = {
            code: err.code,
            message: mapGeolocationErrorCodeToMessage(err.code),
          };
          isLocating.value = false;
          reject(error.value);
        },
        options
      );
    });
  };

  const mapGeolocationErrorCodeToMessage = (code: number): string => {
    switch (code) {
      case 1: // PERMISSION_DENIED
        return '用户已拒绝地理位置请求。';
      case 2: // POSITION_UNAVAILABLE
        return '无法获取当前位置信息。';
      case 3: // TIMEOUT
        return '获取地理位置信息超时。';
      default:
        return '获取地理位置时发生未知错误。';
    }
  };

  return {
    coordinates,
    error,
    isLocating,
    getCurrentLocation,
  };
}