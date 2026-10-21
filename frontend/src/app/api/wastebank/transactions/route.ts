import { NextResponse } from 'next/server';

// Mock transaction data – in a real app this would query a database
const transactions = [
  { id: 1, date: '2024-09-01', type: 'Setoran', amount: 30000, description: 'Plastik' },
  { id: 2, date: '2024-09-05', type: 'Setoran', amount: 45000, description: 'Kertas' },
  { id: 3, date: '2024-09-10', type: 'Penarikan', amount: -20000, description: 'Penarikan saldo' },
];

export async function GET() {
  return NextResponse.json({ transactions });
}
