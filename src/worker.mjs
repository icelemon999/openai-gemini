// src/worker.mjs

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  /**
   * The main fetch handler for the Worker.
   * @param {Request} request - The incoming HTTP request object.
   * @param {Env} env - An object containing environment variables and bindings (like KV namespaces, R2 buckets, secrets).
   * @param {ExecutionContext} ctx - An object containing methods like ctx.waitUntil(), used for tasks after the response.
   * @returns {Promise<Response>} - A promise that resolves to the HTTP response object.
   */
  async fetch(request, env, ctx) {
    // 1. Get information from the request (URL, method, headers, body)
    const url = new URL(request.url);
    const method = request.method;

    console.log(`Received a ${method} request for ${url.pathname}`);

    // 2. Perform logic based on the request
    //    - Route to different handlers based on path (e.g., /api/users, /about)
    //    - Fetch data from another API or your origin server
    //    - Read/write to Cloudflare KV, R2, D1, etc. using the 'env' object
    //    - Modify request/response headers
    //    - Perform authentication/authorization

    // Example: Simple routing based on path
    if (url.pathname === '/hello') {
      return new Response('Hello from the Worker!');
    }

    if (url.pathname === '/api/data') {
      // Example: Fetching data from an external API
      const apiResponse = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const data = await apiResponse.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Example: Using an environment variable (secret) defined in Cloudflare
    if (url.pathname === '/secret') {
       if (env.MY_SECRET) {
         return new Response(`My secret value starts with: ${env.MY_SECRET.substring(0, 3)}...`);
       } else {
         return new Response('MY_SECRET environment variable not set.', { status: 500 });
       }
    }

    // 3. Construct and return a Response object
    //    If no specific route matched, return a default response or 404
    return new Response('Welcome to the Worker! Try /hello or /api/data', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  // You can optionally define other handlers like 'scheduled' for Cron Triggers
  // async scheduled(controller, env, ctx) {
  //   // Code to run on a schedule
  //   console.log("Scheduled event triggered!");
  //   ctx.waitUntil(someAsyncTask());
  // }
};

// Helper function (optional)
// async function someAsyncTask() {
//   // Perform some background task
// }
