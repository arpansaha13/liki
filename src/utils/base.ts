import { readFile } from 'node:fs/promises'

export const rDefault = (r: any) => r.default()

export function isNullOrUndefined(v: any): v is null | undefined {
  return v === null || typeof v === 'undefined'
}

export async function readJsonFile(path: string) {
  // TODO: Use dynamic import when NodeJs adds support for import assertions
  // return import(pathToFileURL(path).href, {
  //   assert: { type: 'json' },
  // })
  const file = await readFile(path, 'utf8')
  return JSON.parse(file)
}
