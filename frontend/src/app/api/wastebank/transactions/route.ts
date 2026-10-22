import { NextResponse } from 'next/server';
import { getUserTransactions } from '@/app/api/wastebank/supabase';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/simba_token=([^;]+)/);
  const userId = match ? decodeURIComponent(match[1]) : 'demo_user';
  const transactions = await getUserTransactions(userId);
  return NextResponse.json({ transactions });
}
