import { Redis } from '@upstash/redis'

const isStoreCloudRedis = false

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL ||"",
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN ||""})

// const redis = Redis.fromEnv();

export const getItemData = async (key: string):Promise<string> => {

    // console.log("XXXXX: " + process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL)

    if(!isStoreCloudRedis) {
        return window.localStorage.getItem(key)||"";
    }

    try {
      const data = await redis.get(key);
      console.log("XXXXX: " + data)
      console.log("XXXXX: " + JSON.stringify(data))

      return JSON.stringify(data) as string
    } catch (error: any) {
      console.error("Error fetching files:", error.message)
      return ""
    }
}

export const setItemData = async (key: string, value: string) => {
    if(!isStoreCloudRedis) {
        return window.localStorage.setItem(key, value);
    }
    
    try {
      const data = await redis.set(key, value);
      console.log("XXXXX: " + data)
    } catch (error: any) {
      console.error("Error fetching files:", error.message)
      return null
    }
}

export const removeItemData = async (key: string, value: string) => {
    try {
      const data = await redis.del(key, value);
      console.log("XXXXX: " + data)
    } catch (error: any) {
      console.error("Error fetching files:", error.message)
      return null
    }
}


