'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { IPrizeBond } from '../../types';
import { formatBnDigits, formatDate } from '../../lib/utils';
import {
  Coins,
  Plus,
  Upload,
  Download,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  FileText,
  Filter
} from 'lucide-react';

export default function BondsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [bonds, setBonds] = useState<IPrizeBond[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBond, setEditingBond] = useState<IPrizeBond | null>(null);

  // Form states
  const [singleNumber, setSingleNumber] = useState('');
  const [singleSeries, setSingleSeries] = useState('');
  const [singlePurchaseDate, setSinglePurchaseDate] = useState('');
  const [singleNotes, setSingleNotes] = useState('');

  const [bulkInput, setBulkInput] = useState('');
  const [bulkSeries, setBulkSeries] = useState('');
  const [bulkDate, setBulkDate] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // CSV file ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchBonds = async () => {
    setLoading(true);
    try {
      const res = await api.bonds.list({
        page,
        limit: 20,
        search,
        series: seriesFilter
      });
      setBonds(res.bonds);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bonds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchBonds();
    }
  }, [isAuthenticated, authLoading, page, search, seriesFilter]);

  // Handle single bond addition
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.bonds.add({
        bondNumber: singleNumber,
        series: singleSeries,
        purchaseDate: singlePurchaseDate || null,
        notes: singleNotes
      });
      setMessage('প্রাইজবন্ড সফলভাবে যোগ করা হয়েছে!');
      setIsAddModalOpen(false);
      setSingleNumber('');
      setSingleSeries('');
      setSinglePurchaseDate('');
      setSingleNotes('');
      fetchBonds();
    } catch (err: any) {
      setError(err.message || 'Failed to add prize bond');
    }
  };

  // Handle bulk add
  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setBulkSubmitting(true);

    try {
      const lines = bulkInput
        .split(/[\n,;]+/)
        .map((n) => n.trim())
        .filter(Boolean);

      const items = lines.map((num) => ({
        bondNumber: num,
        series: bulkSeries,
        purchaseDate: bulkDate || null
      }));

      const res = await api.bonds.bulkAdd(items);
      setMessage(`সফলভাবে ${res.addedCount}টি বন্ড যোগ করা হয়েছে (${res.duplicateCount}টি ডুপ্লিকেট বাদ পড়েছে)।`);
      setIsBulkModalOpen(false);
      setBulkInput('');
      setBulkSeries('');
      setBulkDate('');
      fetchBonds();
    } catch (err: any) {
      setError(err.message || 'Bulk addition failed');
    } finally {
      setBulkSubmitting(false);
    }
  };

  // Handle edit bond
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBond) return;

    try {
      await api.bonds.update(editingBond._id, {
        bondNumber: editingBond.bondNumber,
        series: editingBond.series,
        purchaseDate: editingBond.purchaseDate,
        notes: editingBond.notes,
        isEnabled: editingBond.isEnabled
      });
      setMessage('বন্ড সফলভাবে আপডেট করা হয়েছে');
      setIsEditModalOpen(false);
      setEditingBond(null);
      fetchBonds();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };

  // Handle delete bond
  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`আপনি কি নিশ্চিত প্রাইজবন্ড #${num} মুছে ফেলতে চান?`)) return;

    try {
      await api.bonds.delete(id);
      setMessage(`বন্ড #${num} মুছে ফেলা হয়েছে`);
      fetchBonds();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  // Handle CSV upload
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const res = await api.bonds.importCSV(file);
      setMessage(`CSV থেকে ${res.addedCount}টি বন্ড সফলভাবে ইমপোর্ট করা হয়েছে!`);
      fetchBonds();
    } catch (err: any) {
      setError(err.message || 'CSV Import failed');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Coins className="w-6 h-6 text-blue-600" />
            <span>আমার সংরক্ষিত প্রাইজবন্ড</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-mono font-bold">
              {formatBnDigits(total)}টি বন্ড
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            আপনার ১০০ টাকা মূল্যমানের সকল প্রাইজবন্ড সংরক্ষণ, সম্পাদনা ও ব্যবস্থাপনা করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSV File Input Hidden */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCSVUpload}
            accept=".csv,.txt"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all cursor-pointer"
            title="Import CSV"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>CSV ইমপোর্ট</span>
          </button>

          <a
            href={api.bonds.exportCSVUrl()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>CSV এক্সপোর্ট</span>
          </a>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>বাল্ক যোগ (Bulk Add)</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>বন্ড যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage('')} className="p-1 hover:bg-emerald-100 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="p-1 hover:bg-rose-100 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="বন্ড নম্বর বা নোট দিয়ে খুঁজুন (যেমন: 0562947)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={seriesFilter}
            onChange={(e) => {
              setSeriesFilter(e.target.value);
              setPage(1);
            }}
            placeholder="সিরিজ ফিল্টার (কক, খখ)"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
          />
        </div>
      </div>

      {/* Bonds Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">বন্ড নম্বর (৭ ডিজিট)</th>
                <th className="py-3 px-4">সিরিজ</th>
                <th className="py-3 px-4">ক্রয়ের তারিখ</th>
                <th className="py-3 px-4">নোট / মন্তব্য</th>
                <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>লোড হচ্ছে...</span>
                  </td>
                </tr>
              ) : bonds.length > 0 ? (
                bonds.map((bond) => (
                  <tr key={bond._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                        {bond.bondNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {bond.series ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {bond.series}
                        </span>
                      ) : (
                        <span className="text-slate-400">সকল সিরিজ</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {bond.purchaseDate ? formatDate(bond.purchaseDate) : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {bond.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bond.isEnabled
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {bond.isEnabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingBond(bond);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bond._id, bond.bondNumber)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো প্রাইজবন্ড পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>পৃষ্ঠা {formatBnDigits(page)} / {formatBnDigits(totalPages)}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                আগের
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                পরের
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Single Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>নতুন প্রাইজবন্ড যোগ করুন</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSingle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বন্ড নম্বর (সঠিক ৭ ডিজিট) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={7}
                  value={singleNumber}
                  onChange={(e) => setSingleNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="যেমন: 0562947"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সিরিজ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={singleSeries}
                  onChange={(e) => setSingleSeries(e.target.value)}
                  placeholder="যেমন: কক, খখ (খালি রাখলে সব সিরিজ)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ক্রয়ের তারিখ (ঐচ্ছিক - ৬০ দিন রুল যাচাইয়ের জন্য)
                </label>
                <input
                  type="date"
                  value={singlePurchaseDate}
                  onChange={(e) => setSinglePurchaseDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নোট / বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={singleNotes}
                  onChange={(e) => setSingleNotes(e.target.value)}
                  placeholder="যেমন: সোনালী ব্যাংক থেকে ক্রয়"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>একসাথে একাধিক বন্ড যোগ করুন (Bulk Add)</span>
              </h3>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বন্ড নম্বরগুলোর তালিকা (প্রতি লাইনে বা কমা দিয়ে লিখুন) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="0562947&#10;0289134&#10;0142857, 0783921"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সিরিজ (সবগুলোর জন্য)
                  </label>
                  <input
                    type="text"
                    value={bulkSeries}
                    onChange={(e) => setBulkSeries(e.target.value)}
                    placeholder="যেমন: কক"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্রয়ের তারিখ
                  </label>
                  <input
                    type="date"
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={bulkSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {bulkSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>সব যোগ করুন</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingBond && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">বন্ড তথ্য সম্পাদনা</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বন্ড নম্বর
                </label>
                <input
                  type="text"
                  required
                  maxLength={7}
                  value={editingBond.bondNumber}
                  onChange={(e) => setEditingBond({ ...editingBond, bondNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সিরিজ
                </label>
                <input
                  type="text"
                  value={editingBond.series || ''}
                  onChange={(e) => setEditingBond({ ...editingBond, series: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নোট
                </label>
                <input
                  type="text"
                  value={editingBond.notes || ''}
                  onChange={(e) => setEditingBond({ ...editingBond, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableCheck"
                  checked={editingBond.isEnabled}
                  onChange={(e) => setEditingBond({ ...editingBond, isEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="enableCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ড্র যাচাইয়ের জন্য সক্রিয় রাখুন
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
