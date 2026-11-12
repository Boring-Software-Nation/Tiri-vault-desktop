import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const RPC_DEFAULTS: Record<string, string> = {
  calibration: 'https://api.calibration.node.glif.io/rpc/v1',
  mainnet: 'https://api.node.glif.io/rpc/v1',
}

/**
 * Fills the Content-Security-Policy `connect-src` in index.html from the build settings,
 * so the app may talk exactly to its relay (HTTP + WebSocket) and its Filecoin RPC endpoint.
 */
function tiriCsp(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const origin = (url: string | undefined, name: string): string[] => {
    if (!url) return []
    try {
      return [new URL(url).origin.replace(/^ws(s?):\/\/(.*)$/, 'ws$1://$2')]
    } catch {
      throw new Error(`${name} is not a valid URL: ${url}`)
    }
  }
  const network = env.VITE_FILECOIN_NETWORK === 'mainnet' ? 'mainnet' : 'calibration'
  const sources = new Set<string>([
    "'self'",
    ...origin(env.VITE_API_HOST, 'VITE_API_HOST'),
    ...origin(env.VITE_WS_URL, 'VITE_WS_URL'),
    ...origin(env.VITE_FILECOIN_RPC_URL || RPC_DEFAULTS[network], 'VITE_FILECOIN_RPC_URL'),
  ])
  return {
    name: 'tiri-csp',
    buildStart() {
      if (mode === 'production' && !env.VITE_API_HOST) {
        this.warn('VITE_API_HOST is not set: the app will not be able to reach a relay.')
      }
    },
    transformIndexHtml(html) {
      if (!html.includes('%TIRI_CONNECT_SRC%')) throw new Error('index.html is missing %TIRI_CONNECT_SRC%')
      return html.replace('%TIRI_CONNECT_SRC%', [...sources].join(' '))
    },
  }
}

export default defineConfig(({ mode }) => ({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '~': resolve('src/renderer/src')
      }
    },
    plugins: [vue(), tiriCsp(mode)],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html'),
          "hat-sh-worker": resolve(__dirname, 'src/renderer/hat-sh-worker.js')
        },
        output: {
          entryFileNames: `[name].js`  // Keeps output files easy to locate
        }
      }
    }
  }
}))
