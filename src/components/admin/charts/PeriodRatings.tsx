import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: { periodLabel: string; rating: number; reviewCount: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <div className="text-cream-300 mb-1">{label}</div>
      <div className="text-cream-100 font-mono">评分 {item.rating} · {item.reviewCount} 评价</div>
    </div>
  );
}

export function PeriodRatings({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.05)" vertical={false} />
        <XAxis dataKey="periodLabel" stroke="#B8A98E" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 5]} stroke="#B8A98E" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(232,176,75,0.05)" }} />
        <Bar dataKey="rating" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.rating >= 4.5 ? "#7FB069" : d.rating >= 4 ? "#E8B04B" : "#FF6B5B"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
