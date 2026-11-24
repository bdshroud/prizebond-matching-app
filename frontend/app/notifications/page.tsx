'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';
import {
  Bell,
  CheckCheck,
  Trophy,
  Calendar,
  Info,
  Trash2,
  ExternalLink,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', filterType],
    queryFn: () =>
      api.notifications.list({
        type: filterType === 'all' ? undefined : filterType,
        limit: 50
      }),
    enabled: !!user
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.notifications.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => api.notifications.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <Bell className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Sign In to View Notifications</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Receive real-time alerts for official draw releases and winning bond matches.
        </p>
        <Link
          href="/login?redirect=/notifications"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'winner':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'new_draw':
        return <Calendar className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-emerald-500" />
            <span>Notification Center</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay informed with official draw notifications, winning alerts, and account updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted/50 border border-border text-foreground rounded-xl text-sm font-medium transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1 text-sm">
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'winner', label: 'Winning Alerts' },
          { key: 'new_draw', label: 'Draw Releases' },
          { key: 'system', label: 'System & Admin' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`pb-2.5 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
              filterType === tab.key
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-muted/40 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Notifications</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You're all caught up! When official draw results match your bonds or new draws are verified, you'll see alerts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                n.isRead
                  ? 'bg-card border-border'
                  : 'bg-emerald-950/20 border-emerald-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    n.type === 'winner'
                      ? 'bg-amber-500/10 border-amber-500/20'
                      : n.type === 'new_draw'
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}
                >
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      {n.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-4 pt-2 text-xs">
                    {(n.link || n.data?.link) && (
                      <Link
                        href={n.link || n.data?.link}
                        className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {!n.isRead && (
                      <button
                        onClick={() => markReadMutation.mutate(n._id)}
                        className="text-muted-foreground hover:text-foreground font-medium"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotificationMutation.mutate(n._id)}
                      className="text-muted-foreground hover:text-rose-400 font-medium inline-flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
