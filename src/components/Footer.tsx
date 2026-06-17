import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-cream-100/5 mt-32">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 max-w-sm text-sm text-cream-400 leading-relaxed">
              每月一盒，根据你的偏好与禁忌智能策展的精选商品盲盒。
              让选择疲劳退场，让惊喜每月准时抵达。
            </p>
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300 mb-4">产品</h4>
            <ul className="space-y-2 text-sm text-cream-400">
              <li><Link to="/subscribe" className="hover:text-cream-100">订阅方案</Link></li>
              <li><Link to="/dashboard" className="hover:text-cream-100">我的盲盒</Link></li>
              <li><Link to="/#how" className="hover:text-cream-100">运作机制</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300 mb-4">运营</h4>
            <ul className="space-y-2 text-sm text-cream-400">
              <li><Link to="/admin/products" className="hover:text-cream-100">商品池</Link></li>
              <li><Link to="/admin/boxes" className="hover:text-cream-100">盲盒配置</Link></li>
              <li><Link to="/admin/analytics" className="hover:text-cream-100">数据分析</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-cream-100/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-400/60 font-mono">
            © 2026 盲选盒子 · BlindBox Monthly · 数据为演示用途
          </p>
          <p className="text-xs text-cream-400/60 font-mono">为惊喜而生 · Crafted with care</p>
        </div>
      </div>
    </footer>
  );
}
