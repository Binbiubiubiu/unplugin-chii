import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../../src/vite'

export default defineConfig({
  server: {
    port: 8081,
  },
  plugins: [
    Unplugin({
      port: 8080,
    }),
    Inspect({}),
  ],
})
