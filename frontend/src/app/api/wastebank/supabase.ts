import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserBalance(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId);
  if (error) throw error;
  const total = data.reduce((sum, row) => sum + (row.amount as number), 0);
  return total;
}

export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createWithdrawal(userId: string, amount: number) {
  if (amount <= 0) throw new Error('Invalid amount');
  // Verify balance first
  const balance = await getUserBalance(userId);
  if (amount > balance) throw new Error('Insufficient balance');
  const newTx = {
    user_id: userId,
    date: new Date().toISOString(),
    type: 'Penarikan',
    amount: -amount,
    description: 'Penarikan saldo',
  };
  const { data, error } = await supabase.from('transactions').insert(newTx).select();
  if (error) throw error;
  return data[0];
}
