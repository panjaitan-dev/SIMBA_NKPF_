import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type Transaction = {
  id: number;
  date: string; // ISO date string
  type: 'Setoran' | 'Penarikan';
  amount: number; // positive for setoran, negative for penarikan
  description: string;
};

type Props = {
  data: Transaction[];
};

export default function TransactionTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Tanggal</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Tipe</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-slate-600">Jumlah</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50">
              <td className="px-4 py-2 text-sm text-slate-800">{new Date(tx.date).toLocaleDateString('id-ID')}</td>
              <td className="px-4 py-2 text-sm text-slate-800 flex items-center gap-1">
                {tx.type === 'Setoran' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                )}
                {tx.type}
              </td>
              <td className="px-4 py-2 text-sm font-medium text-right text-slate-800">
                {tx.amount.toLocaleString('id-ID')}
                {' '}IDR
              </td>
              <td className="px-4 py-2 text-sm text-slate-600">{tx.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
