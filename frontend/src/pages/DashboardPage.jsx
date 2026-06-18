import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CashFlowLineChart from '../components/CashFlowLineChart';
import MonthlyRevenueChart from '../components/MonthlyRevenueChart';
import {
  RevenueIcon,
  BillsIcon,
  OverdueIcon,
  PatientsIcon,
  CashInIcon,
  ChequeIcon,
  ShopIllustration,
} from '../components/icons';
import useAppData from '../context/AppDataContext';
import {
  computeDashboardStats,
  computeDailyCashFlow,
  computeMonthlyRevenue,
  computeRecentActivity,
} from '../data/dashboardHelpers';
import { formatCurrency } from '../data/mockData';

const activityStyles = {
  payment: 'text-doc-teal',
  bill: 'text-doc-primary',
  cheque: 'text-doc-navy',
  alert: 'text-red-500',
};

export default function DashboardPage() {
  const {
    loading,
    error,
    customerList,
    billList,
    paymentList,
    chequeList,
    collections,
  } = useAppData();

  const dashboardStats = useMemo(
    () =>
      computeDashboardStats({
        customerList,
        billList,
        paymentList,
        chequeList,
        collections,
      }),
    [customerList, billList, paymentList, chequeList, collections],
  );

  const monthlyRevenue = useMemo(
    () => computeMonthlyRevenue(paymentList),
    [paymentList],
  );

  const recentActivity = useMemo(
    () => computeRecentActivity({ billList, paymentList, chequeList }),
    [billList, paymentList, chequeList],
  );

  const dailyCashFlow = useMemo(
    () => computeDailyCashFlow(paymentList, billList),
    [paymentList, billList],
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Dashboard" subtitle="Full view of shop analytics" />
        <div className="rounded-2xl border border-doc-border bg-white px-5 py-8 text-center shadow-card">
          <p className="text-sm text-doc-muted">Loading shop data...</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-doc-border bg-white shadow-card"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Dashboard" subtitle="Full view of shop analytics" />
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 shadow-card">
          <p className="text-sm font-semibold text-red-600">Could not load dashboard data</p>
          <p className="mt-1 text-sm text-red-500">{error}</p>
          <p className="mt-3 text-xs text-doc-muted">
            Make sure the backend is running and you are signed in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" subtitle="Full view of shop analytics" />

      <div className="relative overflow-hidden rounded-2xl border border-doc-primary/10 bg-gradient-to-r from-doc-primary-light/50 via-white to-white px-4 py-3 shadow-card sm:px-5 sm:py-3.5">
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-doc-primary/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-doc-primary to-doc-teal"
          aria-hidden
        />
        <div className="relative flex flex-col gap-3 pl-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pl-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-6">
            <div className="min-w-0 shrink-0">
              <h2 className="text-base font-bold tracking-tight text-doc-navy sm:text-lg">Welcome back!</h2>
              <p className="mt-0.5 text-xs leading-snug text-doc-muted sm:text-sm">
                You have {dashboardStats.chequesToBank} cheques to bank and{' '}
                {formatCurrency(dashboardStats.overdueAmount)} in overdue bills.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/overdue-bills"
                className="rounded-xl bg-doc-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-doc-primary/20 transition hover:bg-doc-primary-dark sm:px-4 sm:py-2 sm:text-sm"
              >
                View overdue bills
              </Link>
              <Link
                to="/cash-in"
                className="rounded-xl border border-doc-primary/30 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-doc-primary backdrop-blur-sm transition hover:border-doc-primary hover:bg-doc-primary-light sm:px-4 sm:py-2 sm:text-sm"
              >
                Record payment
              </Link>
            </div>
          </div>
          <div className="hidden shrink-0 sm:block [&_svg]:w-24">
            <ShopIllustration />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats.totalRevenue)}
          subtitle="This month"
          icon={RevenueIcon}
          accent="primary"
        />
        <StatCard
          title="Outstanding Credit"
          value={formatCurrency(dashboardStats.outstandingCredit)}
          subtitle="Across all customers"
          icon={BillsIcon}
          accent="warning"
        />
        <StatCard
          title="Overdue Amount"
          value={formatCurrency(dashboardStats.overdueAmount)}
          subtitle="Requires follow-up"
          icon={OverdueIcon}
          accent="danger"
        />
        <StatCard
          title="Active Customers"
          value={dashboardStats.activeCustomers}
          subtitle={`${dashboardStats.billsThisMonth} bills this month`}
          icon={PatientsIcon}
          accent="teal"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <section>
            <h2 className="mb-4 text-lg font-bold text-doc-navy">Recent activity</h2>
            <ul className="flex flex-col gap-2.5">
              {recentActivity.length === 0 ? (
                <li className="rounded-2xl border border-doc-border bg-white px-4 py-6 text-center text-sm text-doc-muted shadow-card">
                  No recent activity yet.
                </li>
              ) : (
                recentActivity.map((item) => (
                  <li
                    key={item.sortKey}
                    className="flex items-center gap-3 rounded-2xl border border-doc-border bg-white px-4 py-3 text-sm shadow-card"
                  >
                    <span className={`flex-1 font-medium ${activityStyles[item.type]}`}>
                      {item.label}
                    </span>
                    <span className="text-xs font-semibold text-doc-navy">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-xs text-doc-muted">{item.time}</span>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <section>
            <h2 className="mb-4 text-lg font-bold text-doc-navy">Monthly revenue</h2>
            <MonthlyRevenueChart data={monthlyRevenue} />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-doc-navy">Quick summary</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Payments this month', value: dashboardStats.paymentsThisMonth, icon: CashInIcon },
                { title: 'Bills this month', value: dashboardStats.billsThisMonth, icon: BillsIcon },
                { title: 'Cheques to bank', value: dashboardStats.chequesToBank, icon: ChequeIcon },
              ].map(({ title, value, icon: Icon }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-2xl border border-doc-border bg-white p-5 shadow-card"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-doc-primary-light text-doc-primary">
                    <Icon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-doc-navy">{title}</p>
                    <p className="text-2xl font-bold text-doc-primary">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-doc-navy">Daily cash flow</h2>
            <CashFlowLineChart data={dailyCashFlow} />
          </section>
        </div>
      </div>
    </div>
  );
}
