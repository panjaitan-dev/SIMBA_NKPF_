import { NextResponse } from 'next/server';
import { createWithdrawal } from '@/app/api/wastebank/supabase';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    // Extract userId from token cookie (or fallback)
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/simba_token=([^;]+)/);
    const userId = match ? decodeURIComponent(match[1]) : 'demo_user';
    const tx = await createWithdrawal(userId, numericAmount);
    return NextResponse.json({ success: true, transaction: tx });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
;
import { withdraw } from '@/app/api/wastebank/store';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    const tx = withdraw(numericAmount);
    return NextResponse.json({ success: true, transaction: tx });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
