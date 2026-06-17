import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
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

  const maxRevenue = Math.max(...monthlyRevenue.map((month) => month.amount), 1);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" subtitle="Full view of shop analytics" />

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
          <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 80%, #E8F0FE 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8F0FE 0%, transparent 40%)',
              }}
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="max-w-sm">
                <h2 className="text-xl font-bold text-doc-navy">Welcome back!</h2>
                <p className="mt-2 text-sm leading-relaxed text-doc-muted">
                  You have {dashboardStats.chequesToBank} cheques to bank and{' '}
                  {formatCurrency(dashboardStats.overdueAmount)} in overdue bills.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/overdue-bills"
                    className="rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
                  >
                    View overdue bills
                  </Link>
                  <Link
                    to="/cash-in"
                    className="rounded-2xl border-2 border-doc-primary bg-white px-5 py-2.5 text-sm font-semibold text-doc-primary transition hover:bg-doc-primary-light"
                  >
                    Record payment
                  </Link>
                </div>
              </div>
              <div className="hidden shrink-0 sm:block">
                <ShopIllustration />
              </div>
            </div>
          </div>

          <section>
            <h2 className="mb-4 text-lg font-bold text-doc-navy">Monthly revenue</h2>
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <div className="flex items-end justify-between gap-3" style={{ height: '160px' }}>
                {monthlyRevenue.map(({ month, amount, isCurrent }) => (
                  <div key={month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-lg bg-doc-primary transition-all"
                        style={{
                          height: `${(amount / maxRevenue) * 100}%`,
                          minHeight: amount > 0 ? '8px' : '0',
                          opacity: isCurrent ? 1 : 0.5,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-doc-muted">{month}</span>
                  </div>
                ))}
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
}
