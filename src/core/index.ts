import type { ChildProcess } from 'child_process'
import type { ChiiOptions } from 'chii'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import pick from 'lodash/pick'
import type { HtmlTagDescriptor, ViteDevServer } from 'vite'
import spawn from 'cross-spawn'
import localAccess from 'local-access'
import type { Options } from '../types'
import { deserializeArgs } from './utils'

let _service: ChildProcess | null = null

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
  chiiUrl: ReturnType<typeof localAccess>
  constructor(readonly options: Options) {
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
    this.chiiUrl = chiiUrl
  }

  async listen() {
    const { options } = this
    const args = deserializeArgs(pick(options, CHII_ARGS))
    _service = spawn('chii', ['start', ...args], {
      cwd: process.cwd(),
      stdio: ['inherit', 'ignore', 'inherit'],
      detached: false,
      // shell: process.platform === 'win32',
    })
  }

  close() {
    // if (_service && _service.pid)
    //   process.kill(-_service.pid)
    _service?.kill()
    _service = null
  }

  injectClientScript() {
    const { options } = this
    const tag = 'script'
    const attrs = {
      embedded: options.embedded,
      src: `${this.chiiUrl.network}target.js`,
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
        body?: HtmlWebpackPlugin.HtmlTagObject[]
        outputName: string
        publicPath: string
        plugin: HtmlWebpackPlugin
      }) => {
        (ops.bodyTags || ops.body)?.push({
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
