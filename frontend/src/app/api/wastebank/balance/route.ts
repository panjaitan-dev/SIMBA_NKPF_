import { NextResponse } from 'next/server';
import { getUserBalance } from '@/app/api/wastebank/supabase';

export async function GET(request: Request) {
  // Extract user identifier from cookie (simba_token) – fallback to demo user
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/simba_token=([^;]+)/);
  const userId = match ? decodeURIComponent(match[1]) : 'demo_user';
  const balance = await getUserBalance(userId);
  return NextResponse.json({ balance });
}

import { getBalance } from '@/app/api/wastebank/store';

export async function GET() {
  const balance = getBalance();
  return NextResponse.json({ balance });
}
