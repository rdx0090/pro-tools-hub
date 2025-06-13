// This is the final, working code for Vercel Serverless Functions
// It uses the REST API directly and correctly builds the URL.

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // These environment variables are automatically added by Vercel when you link a KV store
  const KV_REST_API_URL = process.env.KV_REST_API_URL;
  const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

  // If the variables are not found, something is wrong with the Vercel project linking.
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'KV environment variables not found.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // We build the full URL with the 'incr' command
    const response = await fetch(`${KV_REST_API_URL}/incr/magickit_visitors`, {
      headers: {
        'Authorization': `Bearer ${KV_REST_API_TOKEN}`,
      },
      // IMPORTANT: We must use the POST method for the 'incr' command
      method: 'POST', 
    });

    if (!response.ok) {
        // If the response is not ok, we get the error text to see what went wrong
        const errorText = await response.text();
        throw new Error(`Failed to increment counter: ${errorText}`);
    }

    // The response for 'incr' gives us the new number in the 'data' field
    const { data } = await response.json();

    // Return the new count as a JSON response
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
    console.error("Error in API route:", error); // Log the full error on the server
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}