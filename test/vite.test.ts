import { runPluginTest } from './util'

runPluginTest({
  namespace: 'vite',
  devServerOptions: {
    port: 8081,
  },
  chiiServerOptions: {
    port: 8080,
    pathname: '/',
  },
})
