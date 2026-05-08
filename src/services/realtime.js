import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echoInstance = null;

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function getEchoInstance(token, backendUrl) {
  if (echoInstance) {
    return echoInstance;
  }

  const wsHost = import.meta.env.VITE_WS_HOST || '127.0.0.1';
  const wsPort = toInt(import.meta.env.VITE_WS_PORT, 8081);
  const wssPort = toInt(import.meta.env.VITE_WS_PORT, 8081);
  const forceTls = import.meta.env.VITE_WS_TLS === 'true';
  const appKey = import.meta.env.VITE_WS_APP_KEY || 'devity-key';

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: appKey,
    wsHost,
    wsPort,
    wssPort,
    forceTLS: forceTls,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${backendUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  return echoInstance;
}

export function clearEchoInstance() {
  if (!echoInstance) {
    return;
  }

  echoInstance.disconnect();
  echoInstance = null;
}
