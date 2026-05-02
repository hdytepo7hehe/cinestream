import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting map (simple in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;

  // Get or initialize rate limit
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_WINDOW };

  // Reset if window expired
  if (record.resetTime < now) {
    record.count = 0;
    record.resetTime = now + RATE_WINDOW;
  }

  record.count++;
  rateLimitMap.set(ip, record);

  // Check rate limit
  if (record.count > RATE_LIMIT) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT));
  response.headers.set('X-RateLimit-Remaining', String(RATE_LIMIT - record.count));
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};