import kebabCase from 'lodash/kebabCase'

function deserializeKey(key: string, value: any): string[] {
  key = `--${kebabCase(key)}`
  switch (typeof value) {
    case 'boolean':
    case 'string':
      return value ? [`${key}`, `${value}`] : []
    case 'undefined':
    case 'object':
      return value === null
        ? []
        : deserializeArgs(value as Record<string, any>)
    default:
      return [`${key}`, `${value}`]
  }
}

export function deserializeArgs(obj: Record<string, any>): string[] {
  return Object.keys(obj)
    .reduce((arr, k) => arr.concat(deserializeKey(k, obj[k])), [] as string[])
    .filter(Boolean)
}
