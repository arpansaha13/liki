import { isAbsolute, resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'

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

export function writeJsonFile(path: string, json: Object): Promise<void> {
  return writeFile(path, JSON.stringify(json))
}

/** If the path is relative, then convert it to absolute with respect to process.cwd(). */
export function makeAbsolute(path: string) {
  if (!isAbsolute(path)) return resolve(process.cwd(), path)
  return path
}
