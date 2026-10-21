// Simple in‑memory store for the waste‑bank demo
// NOTE: This data lives only in the serverless function instance and resets on each restart.

type Transaction = {
  id: number;
  date: string; // ISO string
  type: 'Setoran' | 'Penarikan';
  amount: number; // positive for setoran, negative for penarikan
  description: string;
};

let balance = 125_000; // initial mock balance (IDR)
let transactions: Transaction[] = [
  { id: 1, date: '2024-09-01', type: 'Setoran', amount: 30_000, description: 'Plastik' },
  { id: 2, date: '2024-09-05', type: 'Setoran', amount: 45_000, description: 'Kertas' },
  { id: 3, date: '2024-09-10', type: 'Penarikan', amount: -20_000, description: 'Penarikan saldo' },
];

export function getBalance() {
  return balance;
}

export function getTransactions() {
  return transactions;
}

export function withdraw(amount: number) {
  if (amount <= 0) throw new Error('Invalid amount');
  if (amount > balance) throw new Error('Insufficient balance');
  balance -= amount;
  const newTx: Transaction = {
    id: transactions.length + 1,
    date: new Date().toISOString(),
    type: 'Penarikan',
    amount: -amount,
    description: 'Penarikan saldo',
  };
  transactions.unshift(newTx); // newest first
  return newTx;
}
