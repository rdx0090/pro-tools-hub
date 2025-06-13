// This is the final, working code for Vercel Serverless Functions
// It uses the REST API directly, so it will work without any packages.

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Yeh environment variables Vercel apne aap add kar deta hai
  const KV_URL = process.env.KV_URL;
  const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_REST_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'KV environment variables not found.' }), { status: 500 });
  }

  try {
    // REST API ka 'INCR' command istemal karein
    const response = await fetch(`${KV_URL}/incr/magickit_visitors`, {
      headers: {
        'Authorization': `Bearer ${KV_REST_API_TOKEN}`,
      },
    });

    if (!response.ok) {
        throw new Error(`Failed to increment counter: ${await response.text()}`);
    }

    const { data } = await response.json();

    // Naye count ko wapas bhej do
    return new Response(
      JSON.stringify({ value: data }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
      }
    );
  } catch (error) {
    console.error(error); // Log the error on the server
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}