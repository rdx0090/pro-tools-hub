// This is the final, working code for Vercel Serverless Functions

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const KV_REST_API_URL = process.env.KV_REST_API_URL;
  const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'KV environment variables not found.' }), { status: 500 });
  }

  try {
    // Correctly call the INCR command and wait for the response
    const response = await fetch(`${KV_REST_API_URL}/incr/magickit_visitors`, {
      headers: {
        'Authorization': `Bearer ${KV_REST_API_TOKEN}`,
      },
      method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`Failed to increment: ${await response.text()}`);
    }

    // The result from 'incr' is in the 'data' field.
    const result = await response.json();
    const newCount = result.data; // THE FIX IS HERE

    // Return the new count in a 'value' field for our frontend to use
    return new Response(
      JSON.stringify({ value: newCount }), // We send it back as { "value": ... }
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
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}