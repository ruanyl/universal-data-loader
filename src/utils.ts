import { Meta } from './DataLoader.types';
import {LoaderStatus} from './DataLoaderState';

export interface Competitors {
  [key: string]: Promise<any>;
}

export type All<T> = {
  [P in keyof T]: any;
}

export const defaultDataKeyFunc = (name: string, _?: any) => `${name}/default`

export const isDataValid = (data: LoaderStatus, meta: Meta): boolean => {
  const cacheExpiresIn = meta.cacheExpiresIn ? meta.cacheExpiresIn : 0
  if (data && (Date.now() - data.lastUpdateTime!) < cacheExpiresIn) {
    return true
  }
  return false
}

export const race = (competitors: Competitors) => {
  const promiseList = Object.keys(competitors).map(key => {
    return mapPromiseWithKey(key, competitors[key])
  })
  return Promise.race(promiseList)
}

export const all = (competitors: Competitors) => {
  const promiseList = Object.keys(competitors).map(key => {
    return mapPromiseWithKey(key, competitors[key])
  })
  return Promise.all(promiseList).then(results => {
    let value: All<Competitors> = {}
    results.forEach(result => {
      value = { ...value, ...result }
    })
    return value
  })
}

const mapPromiseWithKey = (key: string, promise: Promise<any>) => {
  return promise.then(v => ({ [key]: v }))
}
