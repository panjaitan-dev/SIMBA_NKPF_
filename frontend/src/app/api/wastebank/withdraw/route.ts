import { NextResponse } from 'next/server';
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
