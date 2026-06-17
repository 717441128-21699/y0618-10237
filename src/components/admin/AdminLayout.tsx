import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Boxes,
  BarChart3,
  ChevronLeft,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/products", label: "商品池", icon: Package, desc: "管理商品与标签" },
  { to: "/admin/boxes", label: "盲盒配置", icon: Boxes, desc: "期次与商品组合" },
  { to: "/admin/analytics", label: "数据分析", icon: BarChart3, desc: "订阅与续订洞察" },
];

export function AdminLayout({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-ink-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-72 bg-ink-850 border-r border-cream-100/5 flex flex-col z-50 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-cream-100/5">
          <Logo />
          <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300/70">
            运营后台
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all group",
                  active
                    ? "bg-amber-300/10 text-amber-300"
                    : "text-cream-400 hover:bg-cream-100/5 hover:text-cream-100",
                )}
              >
                <Icon className={cn("w-5 h-5", active && "text-amber-300")} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[10px] text-cream-400/60">{item.desc}</div>
                </div>
                {active && <span className="w-1 h-6 rounded-full bg-amber-300" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream-100/5 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-cream-400 hover:text-cream-100 rounded-xl hover:bg-cream-100/5 transition-colors"
          >
            <Home className="w-4 h-4" />
            回到前台
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink-950/70 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass border-b border-cream-100/5">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-cream-100"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link to="/dashboard" className="hidden lg:flex items-center gap-1 text-xs text-cream-400 hover:text-amber-300">
                <ChevronLeft className="w-3.5 h-3.5" />
                前台
              </Link>
              <h1 className="font-display text-xl text-cream-100">{title}</h1>
            </div>
            {action}
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
