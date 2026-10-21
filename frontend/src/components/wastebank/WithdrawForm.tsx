import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

type Props = {
  currentBalance: number;
  onClose: () => void;
};

export default function WithdrawForm({ currentBalance, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount.replace(/[^0-9]/g, ''));
    if (isNaN(val) || val <= 0) {
      setError('Masukkan jumlah penarikan yang valid');
      return;
    }
    if (val > currentBalance) {
      setError('Jumlah melebihi saldo Anda');
      return;
    }
    setError('');
    // Call backend API to request withdrawal
    const submit = async () => {
      try {
        const res = await fetch('/api/wastebank/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: val }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Gagal mengirim permintaan');
          return;
        }
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      } catch (e) {
        setError('Terjadi kesalahan jaringan');
      }
    };
    submit();
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Ajukan Penarikan</h2>
        {success ? (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
            <span>Permintaan berhasil dikirim!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Jumlah (IDR)</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="contoh: 50000"
                className="w-full px-3 py-2 bg-slate-700 text-slate-100 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded"
            >
              <CheckCircle className="w-4 h-4" />
              Kirim Permintaan
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
