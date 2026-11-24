'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShieldAlert,
  Users,
  Award,
  Layers,
  Activity,
  Mail,
  FileText,
  Plus,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Search,
  ExternalLink,
  Calendar,
  Lock,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'overview' | 'draws' | 'users' | 'jobs' | 'emails' | 'audit'>('overview');

  // Modals & form state
  const [showCreateDrawModal, setShowCreateDrawModal] = useState(false);
  const [showWinningModal, setShowWinningModal] = useState(false);
  const [selectedDrawForWinning, setSelectedDrawForWinning] = useState<any>(null);

  // New Draw form fields
  const [drawNumber, setDrawNumber] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [sourceRef, setSourceRef] = useState('Bangladesh Bank Gazette Notification');
  const [drawFormError, setDrawFormError] = useState('');

  // Winning Numbers bulk text
  const [winningCategory, setWinningCategory] = useState<'first' | 'second' | 'third' | 'fourth' | 'fifth'>('first');
  const [winningNumbersText, setWinningNumbersText] = useState('');
  const [winningModalMsg, setWinningModalMsg] = useState('');

  // Queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.admin.getStats(),
    enabled: user?.role === 'admin'
  });

  const { data: drawsData, isLoading: drawsLoading } = useQuery({
    queryKey: ['admin-draws'],
    queryFn: () => api.draws.list({ limit: 50 }),
    enabled: user?.role === 'admin'
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.admin.getUsers({ limit: 50 }),
    enabled: user?.role === 'admin' && activeTab === 'users'
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => api.admin.getJobs(),
    enabled: user?.role === 'admin' && activeTab === 'jobs'
  });

  const { data: emailLogsData, isLoading: emailsLoading } = useQuery({
    queryKey: ['admin-emails'],
    queryFn: () => api.admin.getEmailLogs(),
    enabled: user?.role === 'admin' && activeTab === 'emails'
  });

  const { data: auditLogsData, isLoading: auditLoading } = useQuery({
    queryKey: ['admin-audit'],
    queryFn: () => api.admin.getAuditLogs(),
    enabled: user?.role === 'admin' && activeTab === 'audit'
  });

  // Mutations
  const createDrawMutation = useMutation({
    mutationFn: (body: any) => api.draws.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-draws'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setShowCreateDrawModal(false);
      setDrawNumber('');
      setDrawDate('');
      setPublicationDate('');
    },
    onError: (err: any) => {
      setDrawFormError(err.message || 'Failed to create draw');
    }
  });

  const publishDrawMutation = useMutation({
    mutationFn: (id: string) => api.draws.publish(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-draws'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      alert(`Draw verified & published! Automated matching executed with ${data.matchingResult?.matchedCount || 0} wins.`);
    },
    onError: (err: any) => {
      alert(`Publish error: ${err.message}`);
    }
  });

  const triggerMatchMutation = useMutation({
    mutationFn: (drawId: string) => api.admin.runMatchingJob(drawId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      alert(`Matching completed! Matched: ${data.data?.matchedCount || 0} winning bonds.`);
    },
    onError: (err: any) => {
      alert(`Matching failed: ${err.message}`);
    }
  });

  const addWinningNumbersMutation = useMutation({
    mutationFn: ({ drawId, winningNumbers }: { drawId: string; winningNumbers: any[] }) =>
      api.draws.addWinningNumbers(drawId, winningNumbers),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-draws'] });
      setWinningModalMsg(`Successfully saved ${res.addedCount} winning numbers.`);
      setWinningNumbersText('');
      setTimeout(() => {
        setShowWinningModal(false);
        setWinningModalMsg('');
      }, 1500);
    },
    onError: (err: any) => {
      setWinningModalMsg(`Error: ${err.message}`);
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.admin.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const retryEmailMutation = useMutation({
    mutationFn: (id: string) => api.admin.retryEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-emails'] });
      alert('Email retry queued and executed.');
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Admin Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          This administrative dashboard is restricted to authorized platform administrators only.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-card hover:bg-muted/50 border border-border text-foreground rounded-xl text-sm font-semibold transition-colors"
        >
          Return to User Dashboard
        </Link>
      </div>
    );
  }

  const handleCreateDraw = (e: React.FormEvent) => {
    e.preventDefault();
    setDrawFormError('');
    createDrawMutation.mutate({
      drawNumber: drawNumber.trim(),
      drawDate: new Date(drawDate),
      publicationDate: publicationDate ? new Date(publicationDate) : new Date(drawDate),
      officialSource: sourceRef
    });
  };

  const handleSaveWinningNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrawForWinning) return;

    const rawNums = winningNumbersText
      .split(/[\n,; ]+/)
      .map((s) => s.trim().replace(/\D/g, ''))
      .filter((s) => s.length > 0)
      .map((s) => s.padStart(7, '0'));

    if (rawNums.length === 0) {
      setWinningModalMsg('Please enter at least one 7-digit number');
      return;
    }

    const prizeTitles: Record<string, { en: string; bn: string; amount: number }> = {
      first: { en: 'First Prize', bn: '১ম পুরস্কার', amount: 600000 },
      second: { en: 'Second Prize', bn: '২য় পুরস্কার', amount: 325000 },
      third: { en: 'Third Prize', bn: '৩য় পুরস্কার', amount: 100000 },
      fourth: { en: 'Fourth Prize', bn: '৪র্থ পুরস্কার', amount: 50000 },
      fifth: { en: 'Fifth Prize', bn: '৫ম পুরস্কার', amount: 10000 }
    };

    const meta = prizeTitles[winningCategory];
    const winningNumbers = rawNums.map((num) => ({
      bondNumber: num,
      prizeCategory: winningCategory,
      prizeTitleEn: meta.en,
      prizeTitleBn: meta.bn,
      prizeAmount: meta.amount,
      applicableSeries: 'all'
    }));

    addWinningNumbersMutation.mutate({
      drawId: selectedDrawForWinning._id,
      winningNumbers
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Platform Administration
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage official draws, winning numbers, automated matching jobs, users, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateDrawModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Draw</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Total Users</span>
          <div className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Saved Bonds</span>
          <div className="text-2xl font-bold text-emerald-400">{stats?.totalBonds || 0}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Total Draws</span>
          <div className="text-2xl font-bold text-foreground">{stats?.totalDraws || 0}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Winning Matches</span>
          <div className="text-2xl font-bold text-amber-400">{stats?.totalMatches || 0}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Total Prizes Disbursed</span>
          <div className="text-lg font-bold text-foreground truncate">
            {formatCurrency(stats?.totalPrizeDisbursed || 0)}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Failed Emails</span>
          <div className="text-2xl font-bold text-rose-400">{stats?.failedEmails || 0}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1 text-sm font-medium">
        {[
          { key: 'overview', label: 'Overview & Cron Health', icon: Activity },
          { key: 'draws', label: 'Draws & Winning Numbers', icon: Award },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'jobs', label: 'Matching Executions', icon: Play },
          { key: 'emails', label: 'Email Logs', icon: Mail },
          { key: 'audit', label: 'Audit Trail', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 pb-2.5 px-4 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Automated Matching Engine & Background Cron Status</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The matching engine runs automatically on verified draw releases and checks all eligible saved bonds against the official winning list. Purchase date eligibility (60 days) and 20% tax calculations are enforced automatically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-background rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted-foreground">Engine Mode</span>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Batch-Indexed Idempotent
                </div>
              </div>
              <div className="p-4 bg-background rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted-foreground">Cron Worker</span>
                <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" /> Active (Runs Hourly)
                </div>
              </div>
              <div className="p-4 bg-background rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted-foreground">Email Notifications</span>
                <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" /> Auto-Dispatched via Resend
                </div>
              </div>
            </div>
          </div>

          {/* Recent Jobs in Overview */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-foreground">Recent Job Executions</h3>
            {stats?.recentJobs?.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent matching jobs recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground bg-muted/20">
                      <th className="py-2.5 px-3">Job Name</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Trigger Type</th>
                      <th className="py-2.5 px-3">Bonds Checked</th>
                      <th className="py-2.5 px-3">Matches Found</th>
                      <th className="py-2.5 px-3">Started At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stats?.recentJobs?.map((job: any) => (
                      <tr key={job._id}>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{job.jobName}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              job.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : job.status === 'failed'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 uppercase text-muted-foreground">{job.triggerType}</td>
                        <td className="py-2.5 px-3 font-mono">{job.bondsChecked}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                          {job.matchesFound}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{formatDate(job.startedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DRAWS MANAGEMENT */}
      {activeTab === 'draws' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Official Prize Bond Draws</h3>
            <button
              onClick={() => setShowCreateDrawModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Draw</span>
            </button>
          </div>

          <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold uppercase">
                  <th className="py-3 px-4">Draw #</th>
                  <th className="py-3 px-4">Draw Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Source Reference</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drawsData?.draws?.map((draw) => (
                  <tr key={draw._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground font-mono text-sm">
                      #{draw.drawNumber}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{formatDate(draw.drawDate)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          draw.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-zinc-500/10 text-zinc-400'
                        }`}
                      >
                        {draw.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {draw.isVerified ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">
                      {draw.officialSource}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDrawForWinning(draw);
                          setShowWinningModal(true);
                        }}
                        className="px-2.5 py-1 bg-card hover:bg-muted/50 border border-border rounded-lg text-foreground font-medium text-[11px]"
                      >
                        + Numbers
                      </button>

                      {!draw.isPublished && (
                        <button
                          onClick={() => publishDrawMutation.mutate(draw._id)}
                          disabled={publishDrawMutation.isPending}
                          className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg font-bold text-[11px]"
                        >
                          Verify & Publish
                        </button>
                      )}

                      <button
                        onClick={() => triggerMatchMutation.mutate(draw._id)}
                        disabled={triggerMatchMutation.isPending}
                        className="px-2.5 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg font-bold text-[11px]"
                      >
                        Run Matcher
                      </button>

                      <Link
                        href={`/draws/${draw._id}`}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground font-semibold inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Registered User Profiles</h3>
          <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold uppercase">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Role Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usersData?.users?.map((u: any) => (
                  <tr key={u._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{u.name}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.isEmailVerified ? (
                        <span className="text-emerald-400 font-medium">Verified</span>
                      ) : (
                        <span className="text-muted-foreground">Unverified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      {u._id !== (user._id || user.id) && (
                        <button
                          onClick={() =>
                            updateUserRoleMutation.mutate({
                              userId: u._id,
                              role: u.role === 'admin' ? 'user' : 'admin'
                            })
                          }
                          className="px-2.5 py-1 bg-card hover:bg-muted/50 border border-border rounded-lg text-foreground font-medium text-[11px]"
                        >
                          Make {u.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MATCHING EXECUTIONS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Matching Job Execution History</h3>
          <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold uppercase">
                  <th className="py-3 px-4">Job Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Trigger</th>
                  <th className="py-3 px-4">Bonds Checked</th>
                  <th className="py-3 px-4">Matches Found</th>
                  <th className="py-3 px-4">Prize Total</th>
                  <th className="py-3 px-4">Execution Time</th>
                  <th className="py-3 px-4">Started At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobsData?.jobs?.map((job: any) => (
                  <tr key={job._id}>
                    <td className="py-3 px-4 font-semibold text-foreground">{job.jobName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          job.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 uppercase text-muted-foreground">{job.triggerType}</td>
                    <td className="py-3 px-4 font-mono">{job.bondsChecked}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {job.matchesFound}
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      {formatCurrency(job.totalPrizeWon || 0)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{job.executionTimeMs} ms</td>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(job.startedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: EMAIL LOGS */}
      {activeTab === 'emails' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Notification Email Logs</h3>
          <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold uppercase">
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {emailLogsData?.logs?.map((el: any) => (
                  <tr key={el._id}>
                    <td className="py-3 px-4 font-semibold text-foreground">{el.recipientEmail}</td>
                    <td className="py-3 px-4 text-muted-foreground max-w-sm truncate">{el.subject}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          el.status === 'sent'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : el.status === 'failed'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {el.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{el.attempts}</td>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(el.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      {el.status === 'failed' && (
                        <button
                          onClick={() => retryEmailMutation.mutate(el._id)}
                          className="px-2.5 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg font-bold text-[11px]"
                        >
                          Retry Email
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Administrative Audit Trail</h3>
          <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold uppercase">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogsData?.logs?.map((al: any) => (
                  <tr key={al._id}>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(al.createdAt)}</td>
                    <td className="py-3 px-4 font-bold text-foreground">{al.user?.name || 'System'}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{al.action}</td>
                    <td className="py-3 px-4 text-muted-foreground">{al.entityType}</td>
                    <td className="py-3 px-4 text-muted-foreground max-w-sm truncate">
                      {JSON.stringify(al.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE DRAW */}
      {showCreateDrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">Create Official Prize Bond Draw</h3>

            {drawFormError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {drawFormError}
              </div>
            )}

            <form onSubmit={handleCreateDraw} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Draw Number (e.g. 119)
                </label>
                <input
                  type="text"
                  required
                  placeholder="119"
                  value={drawNumber}
                  onChange={(e) => setDrawNumber(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Official Draw Date
                </label>
                <input
                  type="date"
                  required
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Publication Date
                </label>
                <input
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Official Source Reference
                </label>
                <input
                  type="text"
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDrawModal(false)}
                  className="px-4 py-2 bg-muted/40 hover:bg-muted text-foreground rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createDrawMutation.isPending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  {createDrawMutation.isPending ? 'Saving...' : 'Save Draft Draw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD WINNING NUMBERS */}
      {showWinningModal && selectedDrawForWinning && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">
              Add Winning Numbers (Draw #{selectedDrawForWinning.drawNumber})
            </h3>

            {winningModalMsg && (
              <div className="p-3 bg-muted border border-border rounded-xl text-foreground text-xs">
                {winningModalMsg}
              </div>
            )}

            <form onSubmit={handleSaveWinningNumbers} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Prize Category
                </label>
                <select
                  value={winningCategory}
                  onChange={(e) => setWinningCategory(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="first">First Prize (Tk 600,000)</option>
                  <option value="second">Second Prize (Tk 325,000)</option>
                  <option value="third">Third Prize (Tk 100,000)</option>
                  <option value="fourth">Fourth Prize (Tk 50,000)</option>
                  <option value="fifth">Fifth Prize (Tk 10,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  7-Digit Winning Numbers (One per line or comma-separated)
                </label>
                <textarea
                  rows={6}
                  placeholder="0123456&#10;0678901"
                  value={winningNumbersText}
                  onChange={(e) => setWinningNumbersText(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs font-mono text-foreground focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWinningModal(false)}
                  className="px-4 py-2 bg-muted/40 hover:bg-muted text-foreground rounded-xl text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={addWinningNumbersMutation.isPending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  {addWinningNumbersMutation.isPending ? 'Saving...' : 'Add Winning Numbers'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
