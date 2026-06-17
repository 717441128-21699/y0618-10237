import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, LayoutDashboard, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

const links = [
  { label: "运作机制", href: "/#how" },
  { label: "当期预告", href: "/#preview" },
  { label: "订阅方案", href: "/#plans" },
  { label: "运营后台", href: "/admin/analytics" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.currentUser);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goCta = () => {
    setOpen(false);
    if (currentUser) navigate("/dashboard");
    else navigate("/subscribe");
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="container">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500",
            scrolled ? "glass shadow-deep" : "bg-transparent",
          )}
        >
          <Logo />

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="px-4 py-2 text-sm text-cream-300 hover:text-amber-300 transition-colors rounded-full hover:bg-amber-300/5"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentUser && location.pathname !== "/dashboard" && (
              <Button variant="secondary" size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="w-4 h-4" />
                我的主页
              </Button>
            )}
            <Button size="sm" onClick={goCta} className="hidden sm:inline-flex">
              <Sparkles className="w-4 h-4" />
              {currentUser ? "查看本期" : "立即订阅"}
            </Button>
            <button
              className="lg:hidden p-2 text-cream-100"
              onClick={() => setOpen(!open)}
              aria-label="菜单"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden mt-2 glass rounded-3xl p-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm text-cream-200 hover:text-amber-300 hover:bg-amber-300/5 rounded-xl"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
