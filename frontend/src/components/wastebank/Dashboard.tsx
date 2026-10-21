import React, { useState } from 'react';
import { Leaf, CreditCard, ArrowDownToLine } from 'lucide-react';
import TransactionTable from './TransactionTable';
import WithdrawForm from './WithdrawForm';

export default function Dashboard() {
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Mock data – replace with real API calls later
  const balance = 125_000; // in rupiah
  const transactions = [
    { id: 1, date: '2024-09-01', type: 'Setoran', amount: 30_000, description: 'Plastik' },
    { id: 2, date: '2024-09-05', type: 'Setoran', amount: 45_000, description: 'Kertas' },
    { id: 3, date: '2024-09-10', type: 'Penarikan', amount: -20_000, description: 'Penarikan saldo' },
  ];

  return (
    <section className="py-12 bg-slate-50" id="wastebank-dashboard">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">
          Bank Sampah Saya
        </h1>

        {/* Balance Card */}
        <div className="bg-emerald-600 text-white rounded-2xl p-6 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            <span className="text-lg font-medium">Saldo</span>
          </div>
          <span className="text-2xl font-bold">{balance.toLocaleString('id-ID')} IDR</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowWithdraw(true)}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded"
          >
            <ArrowDownToLine className="w-5 h-5" />
            Ajukan Penarikan
          </button>
        </div>

        {/* Transaction History */}
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Riwayat Transaksi</h2>
        <TransactionTable data={transactions} />

        {/* Withdraw Modal */}
        {showWithdraw && (
          <WithdrawForm
            currentBalance={balance}
            onClose={() => setShowWithdraw(false)}
          />
        )}
      </div>
    </section>
  );
}
