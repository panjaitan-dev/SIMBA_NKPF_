import { NextResponse } from 'next/server';
import { getBalance } from '@/app/api/wastebank/store';

export async function GET() {
  const balance = getBalance();
  return NextResponse.json({ balance });
}
