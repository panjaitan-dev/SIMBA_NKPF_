import { NextResponse } from 'next/server';
import { getUserBalance } from '@/app/api/wastebank/supabase';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/simba_token=([^;]+)/);
  const userId = match ? decodeURIComponent(match[1]) : 'demo_user';
  try {
    const balance = await getUserBalance(userId);
    return NextResponse.json({ balance });
  } catch (err) {
    return NextResponse.json({ balance: 0 });
  }
}
