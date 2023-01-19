import kebabCase from 'lodash/kebabCase'

export function deserializeKey(key: string, value: any): string[] {
  key = `--${kebabCase(key)}`
  if (!value)
    return []
  switch (typeof value) {
    case 'boolean':
      return [key]
    case 'string':
      return [key, value]
    case 'object':
      return value === null
        ? []
        : deserializeArgs(value as Record<string, any>)
    default:
      return [key, `${value}`]
  }
}

export function deserializeArgs(obj: Record<string, any>): string[] {
  return Object.keys(obj)
    .reduce((arr, k) => arr.concat(deserializeKey(k, obj[k])), [] as string[])
    .filter(Boolean)
}
