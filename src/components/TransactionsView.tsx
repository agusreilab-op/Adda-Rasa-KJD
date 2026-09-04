import React, { useState, useRef, useEffect } from 'react';
import { Transaction } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  onOpenAddTransactionModal: (type?: 'IN' | 'OUT' | 'RETUR_OUT') => void;
  onOpenSalesExportModal?: () => void;
  onDeleteTransaction?: (transactionId: string) => void;
  onClearAllTransactions?: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onOpenAddTransactionModal,
  onOpenSalesExportModal,
  onDeleteTransaction,
  onClearAllTransactions,
}) => {
  const [filterType, setFilterType] = useState<
    'ALL' | 'IN' | 'OUT' | 'RETUR' | 'RETUR_IN' | 'RETUR_OUT'
  >('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    let matchesType = true;
    if (filterType === 'ALL') {
      matchesType = true;
    } else if (filterType === 'RETUR') {
      matchesType = t.type === 'RETUR_IN' || t.type === 'RETUR_OUT';
    } else {
      matchesType = t.type === filterType;
    }

    const matchesSearch =
      t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sourceDestination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.returnReason && t.returnReason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const totalIn = transactions
    .filter((t) => t.type === 'IN')
    .reduce((acc, t) => acc + (Number(t.quantity) || 0), 0);

  const totalOut = transactions
    .filter((t) => t.type === 'OUT')
    .reduce((acc, t) => acc + (Number(t.quantity) || 0), 0);

  const totalReturIn = transactions
    .filter((t) => t.type === 'RETUR_IN')
    .reduce((acc, t) => acc + (Number(t.quantity) || 0), 0);

  const totalReturOut = transactions
    .filter((t) => t.type === 'RETUR_OUT')
    .reduce((acc, t) => acc + (Number(t.quantity) || 0), 0);

  const totalReturCount = transactions.filter(
    (t) => t.type === 'RETUR_IN' || t.type === 'RETUR_OUT'
  ).length;

  const handleSelectAction = (type: 'IN' | 'OUT' | 'RETUR_OUT') => {
    setIsDropdownOpen(false);
    onOpenAddTransactionModal(type);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[#1a1b22] tracking-tight">
            Log Mutasi & Retur Transaksi
          </h2>
          <p className="text-[14px] text-[#444653] mt-0.5">
            Riwayat pencatatan barang masuk (supplier), penjualan & distribusi, serta pengembalian retur ke supplier.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto relative">
          {onClearAllTransactions && transactions.length > 0 && (
            <button
              id="btn-transaksi-hapus-semua"
              type="button"
              onClick={() => setIsConfirmClearOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-[#ba1a1a]/30 bg-[#ffdad6]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/80 rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
              title="Hapus semua data transaksi dan bersihkan riwayat"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              <span>Hapus Semua Transaksi</span>
            </button>
          )}

          {onOpenSalesExportModal && (
            <button
              id="btn-transaksi-download-penjualan"
              type="button"
              onClick={onOpenSalesExportModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-[#00288e]/30 bg-[#dde1ff]/30 text-[#00288e] hover:bg-[#dde1ff]/60 rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
              <span>Download Laporan Penjualan</span>
            </button>
          )}

          {/* Action Dropdown Button (Updated as requested) */}
          <div className="relative flex-1 md:flex-none" ref={dropdownRef}>
            <button
              id="btn-dropdown-catat-transaksi"
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00288e] text-white rounded-xl hover:bg-[#1e40af] text-[13px] font-bold transition-all shadow-sm cursor-pointer"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Catat Transaksi Stok</span>
              <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-[#c4c5d5]/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-[#c4c5d5]/30">
                  <p className="text-[11px] font-bold text-[#757684] uppercase tracking-wider">
                    Pilih Jenis Pencatatan
                  </p>
                </div>

                {/* Option 1: Catat Barang Masuk */}
                <button
                  type="button"
                  id="btn-menu-catat-barang-masuk"
                  onClick={() => handleSelectAction('IN')}
                  className="w-full px-4 py-3 text-left hover:bg-[#f0fdf4] transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/25 text-[#00714d] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#006c49] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#1a1b22] group-hover:text-[#006c49]">
                        Catat Barang Masuk
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#6cf8bb]/30 text-[#00714d]">
                        + IN
                      </span>
                    </div>
                    <p className="text-[12px] text-[#444653] mt-0.5 leading-snug">
                      Penerimaan pasokan barang baru dari supplier/pabrik (menambah stok).
                    </p>
                  </div>
                </button>

                {/* Option 2: Catat Penjualan */}
                <button
                  type="button"
                  id="btn-menu-catat-penjualan"
                  onClick={() => handleSelectAction('OUT')}
                  className="w-full px-4 py-3 text-left hover:bg-[#f4f2fc] transition-colors flex items-start gap-3 cursor-pointer group border-t border-[#c4c5d5]/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#dde1ff] text-[#00288e] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#00288e] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#1a1b22] group-hover:text-[#00288e]">
                        Catat Penjualan
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#dde1ff] text-[#00288e]">
                        - OUT
                      </span>
                    </div>
                    <p className="text-[12px] text-[#444653] mt-0.5 leading-snug">
                      Pengeluaran barang untuk penjualan ke konsumen atau outlet cabang.
                    </p>
                  </div>
                </button>

                {/* Option 3: Catat Barang Retur (Hanya ke Supplier) */}
                <button
                  type="button"
                  id="btn-menu-catat-barang-retur"
                  onClick={() => handleSelectAction('RETUR_OUT')}
                  className="w-full px-4 py-3 text-left hover:bg-[#fff8f7] transition-colors flex items-start gap-3 cursor-pointer group border-t border-[#c4c5d5]/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#ba1a1a] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">reply_all</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#1a1b22] group-hover:text-[#ba1a1a]">
                        Catat Barang Retur
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a]">
                        - Retur Supplier
                      </span>
                    </div>
                    <p className="text-[12px] text-[#444653] mt-0.5 leading-snug">
                      Pengembalian barang rusak, reject, atau expired khusus ke <strong>Supplier</strong>.
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] ambient-shadow border border-[#c4c5d5]/30">
          <div className="text-[12px] font-semibold text-[#444653] uppercase">Total Log Transaksi</div>
          <div className="text-[28px] font-bold text-[#1a1b22] mt-1">{transactions.length}</div>
          <div className="text-[12px] text-[#757684] mt-0.5">Seluruh aktivitas mutasi & retur</div>
        </div>

        <div className="bg-white p-5 rounded-[20px] ambient-shadow border border-[#c4c5d5]/30">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-semibold text-[#006c49] uppercase">Barang Masuk (In)</span>
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">arrow_downward</span>
          </div>
          <div className="text-[28px] font-bold text-[#006c49] mt-1">{totalIn} unit</div>
          <div className="text-[12px] text-[#006c49] mt-0.5">Diterima dari supplier</div>
        </div>

        <div className="bg-white p-5 rounded-[20px] ambient-shadow border border-[#c4c5d5]/30">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-semibold text-[#ba1a1a] uppercase">Barang Keluar (Out)</span>
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">arrow_upward</span>
          </div>
          <div className="text-[28px] font-bold text-[#ba1a1a] mt-1">{totalOut} unit</div>
          <div className="text-[12px] text-[#ba1a1a] mt-0.5">Didistribusikan ke cabang / konsumen</div>
        </div>

        <div className="bg-white p-5 rounded-[20px] ambient-shadow border border-[#c4c5d5]/30">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-semibold text-[#9a4500] uppercase">Total Retur ke Supplier</span>
            <span className="material-symbols-outlined text-[#9a4500] text-[20px]">reply_all</span>
          </div>
          <div className="text-[28px] font-bold text-[#9a4500] mt-1">
            {totalReturOut + totalReturIn} <span className="text-[16px] font-normal text-[#757684]">unit</span>
          </div>
          <div className="text-[12px] text-[#757684] mt-0.5 flex items-center gap-2">
            <span className="text-[#9a4500] font-medium">-{totalReturOut} Retur ke Vendor</span>
            {totalReturIn > 0 && <span>• +{totalReturIn} Internal</span>}
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-[24px] ambient-shadow border border-[#c4c5d5]/30 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[#c4c5d5]/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-[#00288e] text-white shadow-xs'
                  : 'bg-[#f4f2fc] text-[#444653] hover:bg-[#eeedf7]'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('IN')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                filterType === 'IN'
                  ? 'bg-[#006c49] text-white shadow-xs'
                  : 'bg-[#f4f2fc] text-[#444653] hover:bg-[#eeedf7]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
              Barang Masuk
            </button>
            <button
              onClick={() => setFilterType('OUT')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                filterType === 'OUT'
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-[#f4f2fc] text-[#444653] hover:bg-[#eeedf7]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
              Penjualan / Keluar
            </button>
            <button
              onClick={() => setFilterType('RETUR_OUT')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                filterType === 'RETUR_OUT'
                  ? 'bg-[#9a4500] text-white shadow-xs'
                  : 'bg-[#f4f2fc] text-[#9a4500] hover:bg-[#eeedf7]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">reply_all</span>
              Retur ke Supplier ({totalReturCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari produk, kode, tanggal, catatan..."
              className="w-full pl-10 pr-3 py-2 border border-[#c4c5d5] rounded-lg text-[13px] bg-[#fbf8ff] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20"
            />
          </div>
        </div>

        {/* Mobile Cards List (Touch-Friendly for Phones & Small Tablets) */}
        <div className="block md:hidden divide-y divide-[#c4c5d5]/30">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-[#757684]">
              <span className="material-symbols-outlined text-[32px] text-[#c4c5d5]">receipt_long</span>
              <p className="font-medium text-[13px] mt-1">Belum ada riwayat transaksi atau filter tidak cocok.</p>
            </div>
          ) : (
            filteredTransactions.map((t) => {
              const isIncoming = t.type === 'IN' || t.type === 'RETUR_IN';

              return (
                <div key={t.id} className="p-4 hover:bg-[#f4f2fc]/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-bold text-[#00288e] bg-[#dde1ff]/60 px-2 py-0.5 rounded">
                        {t.code}
                      </span>
                      <span className="text-[11px] text-[#757684]">{t.date}</span>
                    </div>

                    {onDeleteTransaction && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Hapus transaksi ${t.code} (${t.productName})?`)) {
                            onDeleteTransaction(t.id);
                          }
                        }}
                        className="p-1 text-[#ba1a1a] hover:bg-[#ffdad6]/60 rounded-md transition-colors"
                        title="Hapus Transaksi"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-[15px] text-[#1a1b22] leading-tight">
                        {t.productName}
                      </h4>
                      <span className="font-mono text-[11px] text-[#757684]">{t.productCode}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[16px] font-extrabold font-mono ${
                          t.type === 'IN'
                            ? 'text-[#006c49]'
                            : t.type === 'RETUR_IN'
                            ? 'text-[#006874]'
                            : t.type === 'RETUR_OUT'
                            ? 'text-[#ba1a1a]'
                            : 'text-[#00288e]'
                        }`}
                      >
                        {isIncoming ? '+' : '-'}{t.quantity} {t.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#c4c5d5]/25 text-[12px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {t.type === 'IN' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#6cf8bb]/20 text-[#00714d] border border-[#6cf8bb]/40">
                          <span className="material-symbols-outlined text-[12px]">arrow_downward</span>
                          MASUK
                        </span>
                      )}
                      {t.type === 'OUT' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#dde1ff] text-[#00288e] border border-[#00288e]/20">
                          <span className="material-symbols-outlined text-[12px]">point_of_sale</span>
                          PENJUALAN
                        </span>
                      )}
                      {t.type === 'RETUR_IN' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#006874]/15 text-[#006874] border border-[#006874]/30">
                          <span className="material-symbols-outlined text-[12px]">assignment_return</span>
                          RETUR MASUK
                        </span>
                      )}
                      {t.type === 'RETUR_OUT' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#93000a] border border-[#ffdad6]">
                          <span className="material-symbols-outlined text-[12px]">reply_all</span>
                          RETUR SUPPLIER
                        </span>
                      )}
                      <span className="text-[#444653] font-medium truncate max-w-[180px]">
                        {t.sourceDestination}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#757684] shrink-0">
                      Oleh: {t.createdBy}
                    </span>
                  </div>

                  {(t.returnReason || t.notes) && (
                    <div className="mt-2 text-[11px] text-[#757684] bg-[#f4f2fc]/60 rounded-lg p-2">
                      {t.returnReason && (
                        <div className="font-semibold text-[#93000a] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-[#ba1a1a]">report_problem</span>
                          <span>{t.returnReason}</span>
                        </div>
                      )}
                      {t.notes && <div>{t.notes}</div>}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-[#c4c5d5]/30">
            <thead className="bg-[#eeedf7]/50">
              <tr>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#444653] uppercase">
                  Kode Transaksi
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#444653] uppercase">
                  Tipe & Tanggal
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#444653] uppercase">
                  Produk
                </th>
                <th className="px-6 py-4 text-right text-[12px] font-semibold text-[#444653] uppercase">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#444653] uppercase">
                  Asal / Tujuan
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#444653] uppercase">
                  Alasan / Keterangan
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#444653] uppercase">
                  Petugas
                </th>
                {onDeleteTransaction && (
                  <th className="px-4 py-4 text-center text-[12px] font-semibold text-[#444653] uppercase w-20">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#c4c5d5]/20 text-[14px]">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => {
                  const isIncoming = t.type === 'IN' || t.type === 'RETUR_IN';

                  return (
                    <tr key={t.id} className="hover:bg-[#f4f2fc]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-[13px] text-[#00288e] font-semibold">
                        {t.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {t.type === 'IN' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#6cf8bb]/20 text-[#00714d] border border-[#6cf8bb]/40">
                              <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
                              MASUK
                            </span>
                          )}
                          {t.type === 'OUT' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#dde1ff] text-[#00288e] border border-[#00288e]/20">
                              <span className="material-symbols-outlined text-[13px]">point_of_sale</span>
                              PENJUALAN
                            </span>
                          )}
                          {t.type === 'RETUR_IN' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#006874]/15 text-[#006874] border border-[#006874]/30">
                              <span className="material-symbols-outlined text-[13px]">assignment_return</span>
                              RETUR MASUK
                            </span>
                          )}
                          {t.type === 'RETUR_OUT' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#ffdad6] text-[#93000a] border border-[#ffdad6]">
                              <span className="material-symbols-outlined text-[13px]">reply_all</span>
                              RETUR SUPPLIER
                            </span>
                          )}
                          <span className="text-[12px] text-[#1a1b22] font-semibold">{t.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-[#1a1b22]">
                        <div>{t.productName}</div>
                        <div className="text-[11px] text-[#757684] font-mono">{t.productCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-[14px] font-bold">
                        <span
                          className={
                            t.type === 'IN'
                              ? 'text-[#006c49]'
                              : t.type === 'RETUR_IN'
                              ? 'text-[#006874]'
                              : t.type === 'RETUR_OUT'
                              ? 'text-[#ba1a1a]'
                              : 'text-[#00288e]'
                          }
                        >
                          {isIncoming ? '+' : '-'}
                          {t.quantity} {t.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#444653]">
                        {t.sourceDestination}
                      </td>
                      <td className="px-6 py-4 text-[#757684] text-[13px] max-w-xs truncate">
                        {t.returnReason && (
                          <div className="font-semibold text-[#93000a] text-[12px] mb-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">report_problem</span>
                            <span>{t.returnReason}</span>
                          </div>
                        )}
                        <span>{t.notes || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] text-[#444653]">
                        {t.createdBy}
                      </td>
                      {onDeleteTransaction && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus transaksi ${t.code} (${t.productName})?`)) {
                                onDeleteTransaction(t.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/60 transition-colors cursor-pointer"
                            title="Hapus Transaksi"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={onDeleteTransaction ? 8 : 7} className="px-6 py-12 text-center text-[#757684]">
                    <span className="material-symbols-outlined text-[40px] text-[#757684] mb-2 block">
                      receipt_long
                    </span>
                    <p className="text-[15px] font-bold text-[#1a1b22]">
                      Belum Ada Riwayat Transaksi
                    </p>
                    <p className="text-[13px] text-[#757684] mt-1 max-w-md mx-auto mb-4">
                      Silakan catat mutasi stok baru menggunakan tombol pencatatan di bawah ini:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAction('IN')}
                        className="px-3.5 py-2 bg-[#006c49] text-white rounded-xl text-[12px] font-bold hover:bg-[#005237] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                        <span>Catat Barang Masuk</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAction('OUT')}
                        className="px-3.5 py-2 bg-[#00288e] text-white rounded-xl text-[12px] font-bold hover:bg-[#1e40af] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                        <span>Catat Penjualan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAction('RETUR_OUT')}
                        className="px-3.5 py-2 bg-[#ba1a1a] text-white rounded-xl text-[12px] font-bold hover:bg-[#93000a] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">reply_all</span>
                        <span>Catat Barang Retur (ke Supplier)</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear All Confirmation Modal */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#c4c5d5]/40 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">delete_forever</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#1a1b22]">
                Hapus Semua Data Transaksi?
              </h3>
              <p className="text-[13px] text-[#444653] mt-2 leading-relaxed">
                Tindakan ini akan <strong>menghapus seluruh {transactions.length} riwayat transaksi</strong> (mutasi masuk, penjualan, dan retur) secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="px-6 py-4 bg-[#fbf8ff] border-t border-[#c4c5d5]/30 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-4 py-2 text-[13px] font-bold text-[#444653] hover:bg-[#eeedf7] rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-clear-all-transactions"
                onClick={() => {
                  onClearAllTransactions?.();
                  setIsConfirmClearOpen(false);
                }}
                className="px-5 py-2 bg-[#ba1a1a] text-white text-[13px] font-bold rounded-xl hover:bg-[#93000a] transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                <span>Ya, Hapus Semua</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
