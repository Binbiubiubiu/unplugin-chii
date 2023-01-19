import { beforeAll, describe, expect, it, vi } from 'vitest'
import { ChiiServer } from '../../src/core'
import { delay, expectChiiServerIsRunning } from '../util'

describe('core/index', async () => {
  let server: ChiiServer

  beforeAll(() => {
    server = new ChiiServer({
      port: 8080,
      domain: 'localhost:8080',
      basePath: '/',
      embedded: false,
    })
  })

  it('ChiiServer.listen and ChiiServer.close is ok', async () => {
    server.listen()
    await delay(1)
    try {
      await expectChiiServerIsRunning('http://localhost:8080/', 'index.html')
    }
    finally {
      server.close()
    }
  })

  it('ChiiServer.configureViteDevServer is ok', async () => {
    const mockServer: any = {
      listen: vi.fn(() => 0),
      close: vi.fn(() => 0),
    }
    server.configureViteDevServer(mockServer)
    mockServer.listen()
    await delay(1)
    try {
      await expectChiiServerIsRunning('http://localhost:8080/', 'index.html')
    }
    finally {
      mockServer.close()
    }
  })

  it('ChiiServer.injectClientScript is ok', async () => {
    const { vite, webpack } = server.injectClientScript()
    const tag = 'script'
    const attrs = {
      embedded: false,
      src: `${server.chiiUrl.network}target.js`,
    }
    expect(vite()).toEqual({
      tag,
      attrs,
      injectTo: 'body',
    })

    expect(webpack({ bodyTags: [] } as any)).toEqual({
      bodyTags: [{
        tagName: tag,
        attributes: attrs,
        voidTag: false,
        meta: {},
      }],
    })
  })
})
