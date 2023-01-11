import chii from 'chii'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { HtmlTagDescriptor } from 'vite'
import type { Options } from '../types'

function disableLogger<T extends (...args: any) => any>(cb: T) {
  return function (...args: Parameters<T>) {
    const logger = console
    const log = logger.log
    logger.log = () => {}
    cb(...args as Iterable<Parameters<T>>)
    logger.log = log
  }
}

export const startServer = disableLogger(chii.start)

export const injectClientScript = (options: Options, chiiUrl: string) => {
  const tag = 'script'
  const attrs = {
    embedded: options.embedded,
    src: `${chiiUrl}target.js`,
  }
  return {
    vite: () => {
      return {
        tag,
        attrs,
        injectTo: 'body',
      } as HtmlTagDescriptor
    },
    webpack: (ops: {
      headTags: HtmlWebpackPlugin.HtmlTagObject[]
      bodyTags: HtmlWebpackPlugin.HtmlTagObject[]
      outputName: string
      publicPath: string
      plugin: HtmlWebpackPlugin
    }) => {
      ops.bodyTags.push({
        tagName: tag,
        attributes: attrs,
        voidTag: false,
        meta: {},
      })
      return ops
    },
  }
}
