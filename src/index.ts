import { createUnplugin } from 'unplugin'
import { bold, cyan, green } from 'kolorist'
import localAccess from 'local-access'
import type HtmlWebpackPluginType from 'html-webpack-plugin'
import type { Options } from './types'
import { injectClientScript, startServer } from './server'

type HtmlWebpackPlugin = typeof HtmlWebpackPluginType

const name = 'unplugin-chii'

export default createUnplugin<Options>((options = {}) => {
  options = Object.assign(
    {
      port: 8080,
      basePath: '/',
      embedded: false,
    },
    options,
  )

  const chiiUrl = localAccess({
    https: options.https,
    port: options.port,
    pathname: options.basePath,
  })
  if (options.domain) {
    const url = `${options.https ? 'https' : 'http'}://${options.domain}${
      options.basePath
    }`
    chiiUrl.local = url
    chiiUrl.network = url
  }

  const ics = injectClientScript(options, chiiUrl.network)

  return {
    name,
    enforce: 'pre',
    transformInclude() {
      // return id.endsWith('main.ts')
      return undefined
    },
    transform() {
      // return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
      return undefined
    },
    webpack(compiler) {
      if (!process.env.WEBPACK_SERVE)
        return

      const pluginName = `${name}/webpack`
      const logger = compiler.getInfrastructureLogger(pluginName)
      const { devServer } = compiler.options
      if (devServer) {
        const cb = devServer.onListening ?? (() => {})
        devServer.onListening = (server: any) => {
          if (!server)
            return
          cb(server)
          logger.info(`Chii starting server at ${cyan(chiiUrl.local)}`)
        }
      }

      (async (compiler) => {
        let htmlPlugin: HtmlWebpackPlugin
        try {
          htmlPlugin = await import('html-webpack-plugin') as unknown as HtmlWebpackPlugin
        }
        catch (e) {
          return
        }
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
          htmlPlugin.getHooks(compilation).alterAssetTagGroups.tapPromise(pluginName, async ops => ics.webpack(ops))
        })
        startServer(options)
      })(compiler)
    },
    vite: {
      enforce: 'pre',
      apply(_, { command }) {
        return command === 'serve'
      },
      async configResolved() {
        startServer(options)
      },
      configureServer(server) {
        const _print = server.printUrls
        server.printUrls = () => {
          const colorUrl = (url: string) =>
            green(url.replace(/:(\d+)\//, (_, port) => `:${bold(port)}/`))
          _print()
          // eslint-disable-next-line no-console
          console.log(
            `  ${green('➜')}  ${bold('Chii')}: ${colorUrl(chiiUrl.local)}`,
          )
        }
      },
      transformIndexHtml(html) {
        return {
          html,
          tags: [
            ics.vite(),
          ],
        }
      },
    },
  }
})
