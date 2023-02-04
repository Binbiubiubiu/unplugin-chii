import { createUnplugin } from 'unplugin'
import { bold, cyan, green } from 'kolorist'
import type HtmlWebpackPluginType from 'html-webpack-plugin'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import type { Options } from './types'
import { ChiiServer } from './core'

type HtmlWebpackPlugin = typeof HtmlWebpackPluginType

const name = 'unplugin-chii'

export default createUnplugin<Options>((options = {}) => {
  const chiiServer = new ChiiServer(options)
  const { chiiUrl } = chiiServer
  const ics = chiiServer.injectClientScript()

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
      if (!(options.enable ?? process.env.WEBPACK_SERVE))
        return

      const pluginName = `${name}/webpack`
      const logger = compiler.getInfrastructureLogger(pluginName)

      let htmlPlugin: HtmlWebpackPlugin
      try {
        htmlPlugin = require(
          'html-webpack-plugin',
        )
      }
      catch (e) {
        return
      }

      compiler.hooks.compilation.tap(pluginName, (compilation) => {
        // above html-webpack-plugin@4.x
        if (htmlPlugin.getHooks) {
          htmlPlugin
            .getHooks(compilation)
            .alterAssetTagGroups.tapPromise(pluginName, async ops =>
              ics.webpack(ops),
            )
          return
        }
        // html-webpack-plugin@3.2
        const hooks = compilation.hooks as any
        if (hooks.htmlWebpackPluginAlterAssetTags) {
          hooks.htmlWebpackPluginAlterAssetTags.tapPromise(pluginName, async (ops: any) =>
            ics.webpack(ops),
          )
        }
      })

      const devServer = compiler.options.devServer as DevServerConfiguration
      if (devServer) {
        const onListening = devServer.onListening
        devServer.onListening = (devServer) => {
          if (!devServer)
            return
          onListening?.(devServer)
          logger.info(`Chii starting server at ${cyan(chiiUrl.local)}`)
        }
      }
      chiiServer.listen()
    },
    vite: {
      enforce: 'pre',
      apply(_, { command }) {
        return options.enable ?? command === 'serve'
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

        chiiServer.configureViteDevServer(server)
      },
      transformIndexHtml(html) {
        return {
          html,
          tags: [ics.vite()],
        }
      },
    },
  }
})
