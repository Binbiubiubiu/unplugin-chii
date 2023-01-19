import path from 'path'
import fs from 'fs'
import type { ChildProcess } from 'child_process'
import fetch from 'node-fetch'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import spawn from 'cross-spawn'
import cheerio from 'cheerio'
import terminate from 'terminate/promise'
import type { Options as LocalAccessOptions } from 'local-access'
import localAccess from 'local-access'
import waitPort from 'wait-port'

export const fixtures = (...args: string[]) =>
  path.join(__dirname, 'fixtures', ...args)
export const delay = async (sec: number) => {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
}

interface PluginTestConfigOptions {
  namespace: string
  chiiServerOptions: LocalAccessOptions
  devServerOptions: LocalAccessOptions
}

export function runPluginTest(ops: PluginTestConfigOptions) {
  const { namespace, chiiServerOptions, devServerOptions } = ops
  const chiiUrl = localAccess(chiiServerOptions)
  const devServerUrl = localAccess(devServerOptions)
  let service: ChildProcess | null = null

  describe(namespace, () => {
    beforeAll(async () => {
      service = spawn('npm', ['run', `play:${namespace}`], {
        // stdio: ['inherit', 'ignore', 'inherit'],
        cwd: process.cwd(),
        detached: true,
        shell: process.platform === 'win32',
      })
      await waitPort({
        port: +devServerOptions.port!,
      })
    })

    afterAll(async () => {
      if (service && service.pid)
        await terminate(service.pid)
      service = null
    })

    it('chii page is ok', async () => {
      await expectChiiServerIsRunning(chiiUrl.local, 'index.html')
    })

    it('target.js has injected', async () => {
      const html = await fetch(devServerUrl.local).then(res => res.text())
      const $ = cheerio.load(html)
      const scripts = $('body')
        .find('script')
        .filter(function () {
          return $(this).attr('src') === `${chiiUrl.network}target.js`
        })
      expect(scripts.length).toBe(1)
    })
  })
}

export async function expectChiiServerIsRunning(url: string, filename: string) {
  const format = (txt: string) => txt.replace(/[\r\n]/g, '')
  const expectHtml = fs.readFileSync(fixtures(filename)).toString()
  const html = await fetch(url).then(res => res.text())
  expect(format(html)).toEqual(format(expectHtml))
}
