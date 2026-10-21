import { NextResponse } from 'next/server';
import { getUserTransactions } from '@/app/api/wastebank/supabase';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/simba_token=([^;]+)/);
  const userId = match ? decodeURIComponent(match[1]) : 'demo_user';
  const transactions = await getUserTransactions(userId);
  return NextResponse.json({ transactions });
}


// Mock transaction data – in a real app this would query a database
const transactions = [
  { id: 1, date: '2024-09-01', type: 'Setoran', amount: 30000, description: 'Plastik' },
  { id: 2, date: '2024-09-05', type: 'Setoran', amount: 45000, description: 'Kertas' },
  { id: 3, date: '2024-09-10', type: 'Penarikan', amount: -20000, description: 'Penarikan saldo' },
];

import { NextResponse } from 'next/server';
import { getUserTransactions } from '@/app/api/wastebank/supabase';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/simba_token=([^;]+)/);
  const userId = match ? decodeURIComponent(match[1]) : 'demo_user';
  const transactions = await getUserTransactions(userId);
  return NextResponse.json({ transactions });
}

import { getTransactions } from '@/app/api/wastebank/store';

export async function GET() {
  const transactions = getTransactions();
  return NextResponse.json({ transactions });
}
