import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createClient();  // No arguments needed here

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to the sign-in page
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all dashboard routes
};
