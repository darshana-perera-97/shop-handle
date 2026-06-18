import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = {
  cashIn: '#2D7FF9',
  cashOut: '#4FD1C5',
};

function formatAxisValue(amount) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${Math.round(amount / 1000)}k`;
  return String(amount);
}

function CashFlowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-doc-border bg-white px-3 py-2 text-xs shadow-card">
      <p className="mb-1.5 font-semibold text-doc-navy">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-medium" style={{ color: entry.color }}>
          {entry.name}: Rs. {entry.value.toLocaleString('en-LK')}
        </p>
      ))}
    </div>
  );
}

export default function CashFlowLineChart({ data }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-xs font-medium">
          <span className="flex items-center gap-2 text-doc-navy">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.cashIn }} />
            Cash in
          </span>
          <span className="flex items-center gap-2 text-doc-navy">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.cashOut }} />
            Cash out
          </span>
        </div>
        <p className="text-xs text-doc-muted">Last 14 days</p>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#A3AED0' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tickFormatter={formatAxisValue}
              tick={{ fontSize: 10, fill: '#A3AED0' }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<CashFlowTooltip />} />
            <Line
              type="monotone"
              dataKey="cashIn"
              name="Cash in"
              stroke={COLORS.cashIn}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#fff', stroke: COLORS.cashIn, strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#fff', stroke: COLORS.cashIn, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="cashOut"
              name="Cash out"
              stroke={COLORS.cashOut}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#fff', stroke: COLORS.cashOut, strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#fff', stroke: COLORS.cashOut, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
