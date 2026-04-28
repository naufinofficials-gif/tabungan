import type { User, InvestmentPlan, Investment, Deposit, Withdrawal, Referral } from '../types';

const KEYS = {
  USERS: 'primeinvest_users',
  PLANS: 'primeinvest_plans',
  INVESTMENTS: 'primeinvest_investments',
  DEPOSITS: 'primeinvest_deposits',
  WITHDRAWALS: 'primeinvest_withdrawals',
  REFERRALS: 'primeinvest_referrals',
  CURRENT_USER: 'primeinvest_current_user',
};

function get<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Users
export function getUsers(): User[] {
  return get<User[]>(KEYS.USERS, []);
}

export function saveUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  set(KEYS.USERS, users);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username === username);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email);
}

export function getUserByReferralCode(code: string): User | undefined {
  return getUsers().find(u => u.referralCode === code);
}

// Plans
export function getPlans(): InvestmentPlan[] {
  const defaultPlans: InvestmentPlan[] = [
    {
      id: 'plan-1',
      name: 'Starter Plan',
      minInvest: 50000,
      maxInvest: 500000,
      profitPercent: 1.5,
      duration: 30,
      minWithdraw: 25000,
      description: 'Cocok untuk pemula yang ingin memulai investasi dengan modal kecil.',
    },
    {
      id: 'plan-2',
      name: 'Silver Plan',
      minInvest: 500000,
      maxInvest: 2000000,
      profitPercent: 2.0,
      duration: 45,
      minWithdraw: 50000,
      description: 'Investasi menengah dengan return yang lebih tinggi.',
    },
    {
      id: 'plan-3',
      name: 'Gold Plan',
      minInvest: 2000000,
      maxInvest: 10000000,
      profitPercent: 2.5,
      duration: 60,
      minWithdraw: 100000,
      description: 'Investasi premium dengan profit maksimal.',
    },
    {
      id: 'plan-4',
      name: 'Diamond Plan',
      minInvest: 10000000,
      maxInvest: 50000000,
      profitPercent: 3.0,
      duration: 90,
      minWithdraw: 250000,
      description: 'Investasi eksklusif untuk investor serius.',
    },
    {
      id: 'plan-5',
      name: 'Platinum Plan',
      minInvest: 50000000,
      maxInvest: 200000000,
      profitPercent: 4.0,
      duration: 120,
      minWithdraw: 500000,
      description: 'Plan tertinggi dengan keuntungan maksimum.',
    },
  ];
  return get<InvestmentPlan[]>(KEYS.PLANS, defaultPlans);
}

export function savePlans(plans: InvestmentPlan[]): void {
  set(KEYS.PLANS, plans);
}

// Investments
export function getInvestments(): Investment[] {
  return get<Investment[]>(KEYS.INVESTMENTS, []);
}

export function saveInvestment(inv: Investment): void {
  const items = getInvestments();
  const idx = items.findIndex(i => i.id === inv.id);
  if (idx >= 0) items[idx] = inv;
  else items.push(inv);
  set(KEYS.INVESTMENTS, items);
}

export function getUserInvestments(userId: string): Investment[] {
  return getInvestments().filter(i => i.userId === userId);
}

// Deposits
export function getDeposits(): Deposit[] {
  return get<Deposit[]>(KEYS.DEPOSITS, []);
}

export function saveDeposit(dep: Deposit): void {
  const items = getDeposits();
  const idx = items.findIndex(d => d.id === dep.id);
  if (idx >= 0) items[idx] = dep;
  else items.push(dep);
  set(KEYS.DEPOSITS, items);
}

export function getUserDeposits(userId: string): Deposit[] {
  return getDeposits().filter(d => d.userId === userId);
}

// Withdrawals
export function getWithdrawals(): Withdrawal[] {
  return get<Withdrawal[]>(KEYS.WITHDRAWALS, []);
}

export function saveWithdrawal(wd: Withdrawal): void {
  const items = getWithdrawals();
  const idx = items.findIndex(w => w.id === wd.id);
  if (idx >= 0) items[idx] = wd;
  else items.push(wd);
  set(KEYS.WITHDRAWALS, items);
}

export function getUserWithdrawals(userId: string): Withdrawal[] {
  return getWithdrawals().filter(w => w.userId === userId);
}

// Referrals
export function getReferrals(): Referral[] {
  return get<Referral[]>(KEYS.REFERRALS, []);
}

export function saveReferral(ref: Referral): void {
  const items = getReferrals();
  items.push(ref);
  set(KEYS.REFERRALS, items);
}

export function getUserReferrals(userId: string): Referral[] {
  return getReferrals().filter(r => r.referrerId === userId);
}

// Current user session
export function getCurrentUser(): User | null {
  return get<User | null>(KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): void {
  set(KEYS.CURRENT_USER, user);
}

// Initialize admin
export function initAdmin(): void {
  const users = getUsers();
  if (!users.find(u => u.role === 'admin')) {
    const admin: User = {
      id: 'admin-' + Date.now(),
      username: 'admin',
      email: 'admin@primeinvest.com',
      password: 'admin123',
      fullName: 'Administrator',
      role: 'admin',
      referralCode: 'ADMIN' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      referredBy: null,
      balance: 0,
      totalInvested: 0,
      totalProfit: 0,
      totalWithdrawn: 0,
      walletAddress: '',
      bankName: '',
      bankAccount: '',
      bankAccountName: '',
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
    set(KEYS.USERS, users);
  }
}

// Process daily profits
export function processDailyProfits(): void {
  const investments = getInvestments();
  const users = getUsers();
  const now = new Date();
  let changed = false;

  for (const inv of investments) {
    if (inv.status !== 'active') continue;

    const lastProfit = new Date(inv.lastProfitDate);
    const hoursDiff = (now.getTime() - lastProfit.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
      const plan = getPlans().find(p => p.id === inv.planId);
      if (!plan) continue;

      const dailyProfit = (inv.amount * plan.profitPercent) / 100;
      inv.totalProfit += dailyProfit;
      inv.lastProfitDate = now.toISOString();

      const user = users.find(u => u.id === inv.userId);
      if (user) {
        user.balance += dailyProfit;
        user.totalProfit += dailyProfit;
      }

      const endDate = new Date(inv.endDate);
      if (now >= endDate) {
        inv.status = 'completed';
        if (user) {
          user.balance += inv.amount;
        }
      }

      changed = true;
      saveInvestment(inv);
    }
  }

  if (changed) {
    set(KEYS.USERS, users);
  }
}

// Seed demo data
export function seedDemoData(): void {
  initAdmin();
  // Ensure plans exist
  getPlans();
}
