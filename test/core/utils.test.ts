import { describe, expect, it } from 'vitest'
import { deserializeArgs, deserializeKey } from '../../src/core/utils'

describe('core/utils', () => {
  it('deserializeKey is ok', () => {
    expect(deserializeKey('sslCert', 'mockText')).toEqual(['--ssl-cert', 'mockText'])
    expect(deserializeKey('sslCert', '')).toEqual([])
    expect(deserializeKey('https', false)).toEqual([])
    expect(deserializeKey('https', true)).toEqual(['--https'])
    expect(deserializeKey('https', undefined)).toEqual([])
    expect(deserializeKey('nestObject', { a: 1, b: '2' })).toEqual(['--a', '1', '--b', '2'])
    expect(deserializeKey('nestObject', null)).toEqual([])
  })

  it('deserializeArgs is ok', () => {
    expect(deserializeArgs({
      port: 8080,
      host: 'localhost',
      domain: 'localhost:8080',
      cdn: 'http://localhost',
      https: true,
      sslCert: 'mockSslCert',
      sslKey: 'mockSslKey',
      basePath: '/',
    })).toEqual([
      '--port',
      '8080',
      '--host',
      'localhost',
      '--domain',
      'localhost:8080',
      '--cdn',
      'http://localhost',
      '--https',
      '--ssl-cert',
      'mockSslCert',
      '--ssl-key',
      'mockSslKey',
      '--base-path',
      '/'])
  })
})
