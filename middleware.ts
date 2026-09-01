import { next } from '@vercel/edge';
import { kv } from '@vercel/kv';

// Define which paths this middleware runs on
export const config = {
  matcher: ['/api/:path*', '/submit'],
};

const RATE_LIMIT_WINDOW_SECONDS = 60; 
const MAX_REQUESTS = 10; 

export default async function middleware(request: Request) {
  // Extract the client IP. On Vercel, this is passed via headers.
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  try {
    // Increment the request count for this IP
    const currentRequests = await kv.incr(ip);
    
    // If it's the first request in the window, set the expiration
    if (currentRequests === 1) {
      await kv.expire(ip, RATE_LIMIT_WINDOW_SECONDS);
    }
    
    // Check if the limit has been exceeded
    if (currentRequests > MAX_REQUESTS) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': RATE_LIMIT_WINDOW_SECONDS.toString(),
          'X-RateLimit-Limit': MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
        }
      });
    }
    
    // If not exceeded, allow the request to proceed normally
    const res = next();
    res.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.headers.set('X-RateLimit-Remaining', (MAX_REQUESTS - currentRequests).toString());
    
    return res;
    
  } catch (error) {
    // Fail open: If KV is down, we don't want to completely break the application
    console.error('Rate limiting KV error:', error);
    return next();
  }
}
