export type Role = 'user' | 'admin';

export interface IUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isEmailVerified: boolean;
  notificationPreferences: {
    emailOnWin: boolean;
    emailOnNewDraw: boolean;
    inAppNotifications: boolean;
  };
  createdAt?: string;
}

export interface IPrizeBond {
  _id: string;
  user: string;
  bondNumber: string;
  series: string;
  purchaseDate: string | null;
  notes: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IWinningNumber {
  _id: string;
  draw: string;
  bondNumber: string;
  prizeCategory: 'first' | 'second' | 'third' | 'fourth' | 'fifth';
  prizeTitleBn: string;
  prizeTitleEn: string;
  prizeAmount: number;
  applicableSeries: string;
}

export interface IDraw {
  _id: string;
  drawNumber: string;
  drawDate: string;
  publicationDate: string;
  officialSource: string;
  isVerified: boolean;
  isPublished: boolean;
  description: string;
  seriesType: string;
  totalPrizes: number;
  totalWinningAmount: number;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  matchingStats?: {
    totalBondsChecked: number;
    matchedCount: number;
    totalPrizeWon: number;
    durationMs?: number;
    processedAt?: string;
  };
  createdAt: string;
}

export interface IMatch {
  _id: string;
  user: string;
  bond: string | IPrizeBond;
  draw: string | IDraw;
  winningNumber: string;
  bondNumber: string;
  series: string;
  drawNumber: string;
  drawDate: string;
  prizeCategory: string;
  prizeTitleBn: string;
  prizeTitleEn: string;
  grossAmount: number;
  estimatedTax: number;
  netAmount: number;
  claimDeadline: string;
  emailSent: boolean;
  emailDeliveryStatus: string;
  isClaimed: boolean;
  createdAt: string;
}

export interface INotification {
  _id: string;
  user: string;
  type: 'winner' | 'new_draw' | 'system' | 'reminder';
  title: string;
  message: string;
  link?: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface IDashboardStats {
  statistics: {
    totalBonds: number;
    activeBonds: number;
    totalCheckedDraws: number;
    totalWinningBonds: number;
    totalEstimatedPrizeMoney: number;
    totalEstimatedNetMoney: number;
  };
  nextScheduledDrawDate: string;
  latestPublishedDraw: IDraw | null;
  recentNotifications: INotification[];
  recentDraws: IDraw[];
  recentWins: IMatch[];
}
