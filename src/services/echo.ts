import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo<any>
  }
}

window.Pusher = Pusher

const REVERB_KEY = import.meta.env.VITE_REVERB_APP_KEY || 'autobid_key_998877'
const REVERB_HOST = import.meta.env.VITE_REVERB_HOST || window.location.hostname || 'localhost'
const REVERB_PORT = import.meta.env.VITE_REVERB_PORT || 8080
const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME || 'http'

export const echo = new Echo({
  broadcaster: 'reverb',
  key: REVERB_KEY,
  wsHost: REVERB_HOST,
  wsPort: Number(REVERB_PORT),
  wssPort: Number(REVERB_PORT),
  forceTLS: REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
})

window.Echo = echo

export default echo
