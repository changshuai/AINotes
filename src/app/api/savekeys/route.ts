import { headers } from 'next/headers'
import { kv } from "@vercel/kv";

export async function GET(request: Request) {
    return new Response('Hello, Next.js!', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
}

export async function POST(request: Request) {
    const headersList = headers()
    const apiKey = headersList.get('API-Key')
    const openAIkey = headersList.get('OPENKEY')

    if(apiKey){
        await kv.set(apiKey, openAIkey);
        return Response.json({ apiKey})
    }
    else
        return new Response('apikey is null', {
            status: 501,
        })
}