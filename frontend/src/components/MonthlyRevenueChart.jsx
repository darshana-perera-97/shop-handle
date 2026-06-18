import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PRIMARY_COLOR = '#2D7FF9';

function formatAxisValue(amount) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${Math.round(amount / 1000)}k`;
  return String(amount);
}

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-doc-border bg-white px-3 py-2 text-xs shadow-card">
      <p className="mb-1 font-semibold text-doc-navy">{label}</p>
      <p className="font-medium text-doc-primary">
        Rs. {payload[0].value.toLocaleString('en-LK')}
      </p>
    </div>
  );
}

export default function MonthlyRevenueChart({ data }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#A3AED0' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatAxisValue}
              tick={{ fontSize: 10, fill: '#A3AED0' }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: '#E8F0FE' }} />
            <Bar
              dataKey="amount"
              name="Revenue"
              fill={PRIMARY_COLOR}
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={PRIMARY_COLOR}
                  fillOpacity={entry.isCurrent ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
