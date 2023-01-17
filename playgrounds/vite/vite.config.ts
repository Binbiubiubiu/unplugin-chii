import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from 'unplugin-chii/vite'

export default defineConfig({
  plugins: [
    Unplugin({
      port: 8082,
    }),
    Inspect({}),
  ],
})
