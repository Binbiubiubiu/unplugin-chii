import type { ChildProcessWithoutNullStreams } from 'child_process'
import { spawn } from 'child_process'
import type { ChiiOptions } from 'chii'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import pick from 'lodash/pick'
import type {} from '@umijs/utils'
import type { HtmlTagDescriptor, ViteDevServer } from 'vite'
import type { Options } from '../types'
import { deserializeArgs } from './utils'

let _service: ChildProcessWithoutNullStreams | null = null

const CHII_ARGS = [
  'port',
  'host',
  'domain',
  'cdn',
  'https',
  'sslCert',
  'sslKey',
  'basePath',
] as (keyof ChiiOptions)[]

export class ChiiServer {
  constructor(readonly options: Options) {}

  listen() {
    const { options } = this
    const args = deserializeArgs(pick(options, CHII_ARGS))
    _service = spawn('chii', ['start', ...args], {
      cwd: process.cwd(),
      detached: false,
    })
    _service.stderr.once('data', (data) => {
      console.error(`[chii]:${data}`)
    })
  }

  close() {
    _service?.kill()
    _service = null
  }

  injectClientScript(chiiUrl: string) {
    const { options } = this
    const tag = 'script'
    const attrs = {
      embedded: options.embedded,
      src: `${chiiUrl}target.js`,
    } as Record<string, any>
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

  configureViteDevServer(server: ViteDevServer) {
    (['listen', 'close'] as const).forEach((key) => {
      const callback = server[key] as any
      if (!callback)
        return
      server[key] = async (...args: [...Parameters<typeof callback>]) => {
        this[key]()
        return callback(...args)
      }
    })
  }
}
