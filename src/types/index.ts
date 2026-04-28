export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'member' | 'admin';
  referralCode: string;
  referredBy: string | null;
  balance: number;
  totalInvested: number;
  totalProfit: number;
  totalWithdrawn: number;
  walletAddress: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  createdAt: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minInvest: number;
  maxInvest: number;
  profitPercent: number;
  duration: number; // in days
  minWithdraw: number;
  description: string;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  status: 'active' | 'completed';
  startDate: string;
  endDate: string;
  lastProfitDate: string;
  totalProfit: number;
  reinvested: boolean;
}

export interface Deposit {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt: string | null;
}

export interface Withdrawal {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt: string | null;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredUsername: string;
  bonus: number;
  createdAt: string;
}
