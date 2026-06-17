import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { category: string; label: string; count: number }[];
}

const COLORS = ["#FF6B5B", "#E8B04B", "#7FB069", "#D99A2E", "#E84A38", "#5C9447"];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <span className="text-cream-300">{item.name}：</span>
      <span className="text-cream-100 font-mono">{item.value} 次</span>
    </div>
  );
}

export function UnsubscribePie({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-2xl text-cream-100">{total}</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cream-400">退订</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-cream-300 flex-1 truncate">{d.label}</span>
            <span className="text-xs font-mono text-cream-100">{d.count}</span>
            <span className="text-xs text-cream-400 w-10 text-right">
              {Math.round((d.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
