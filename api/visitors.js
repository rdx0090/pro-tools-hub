// Yeh Vercel ke server par chalega
import { kv } from '@vercel/kv';

export default async function handler(request) {
  try {
    // 'magickit_total_visitors' naam ki key se count ko +1 karo
    const newTotal = await kv.incr('magickit_total_visitors');

    // Naye count ko wapas bhej do
    return new Response(
      JSON.stringify({ value: newTotal }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Taaki koi error na aaye
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}