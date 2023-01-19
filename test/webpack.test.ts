import { runPluginTest } from './util'

runPluginTest({
  namespace: 'webpack',
  devServerOptions: {
    port: 8081,
  },
  chiiServerOptions: {
    port: 8080,
    pathname: '/',
  },
})
