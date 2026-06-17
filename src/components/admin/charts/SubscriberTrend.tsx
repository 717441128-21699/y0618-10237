import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { period: string; subscribers: number; renewed: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <div className="text-cream-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-cream-300">{p.name}:</span>
          <span className="text-cream-100 font-mono">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function SubscriberTrend({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8B04B" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#E8B04B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="renGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B5B" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#FF6B5B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.05)" vertical={false} />
        <XAxis dataKey="period" stroke="#B8A98E" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#B8A98E" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="subscribers"
          name="订阅人数"
          stroke="#E8B04B"
          strokeWidth={2}
          fill="url(#subGrad)"
        />
        <Area
          type="monotone"
          dataKey="renewed"
          name="续订人数"
          stroke="#FF6B5B"
          strokeWidth={2}
          fill="url(#renGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
