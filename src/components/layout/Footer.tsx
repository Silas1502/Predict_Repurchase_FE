import { Package, Github, Mail, MapPin, Phone, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="gradient-navy text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-ecommerce rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-secondary-900 leading-tight">
                  AI<span className="text-primary-600">Predict</span>
                </span>
                <span className="text-xs text-secondary-500 font-medium">
                  Dự đoán mua lại
                </span>
              </div>
            </Link>
            <p className="text-sm text-secondary-400 mb-4 leading-relaxed">
              Giải pháp AI dự đoán hành vi mua lại của khách hàng cho doanh nghiệp.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
              Sản phẩm
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/apply" className="hover:text-white transition-colors flex items-center gap-1">
                  Dự đoán mua lại
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-white transition-colors">
                  Lịch sử dự đoán
                </Link>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  API Documentation
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Pricing
                </span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
              Công ty
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Về chúng tôi
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Tuyển dụng
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Liên hệ
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary-400" />
                </div>
                <span>support@olistai.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary-800 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary-400" />
                </div>
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary-400" />
                </div>
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-500">
              © {currentYear} AI Predict. Đã đăng ký bản quyền.
            </p>
            <div className="flex gap-6 text-sm text-secondary-500">
              <span className="hover:text-white transition-colors cursor-pointer">
                Chính sách bảo mật
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Điều khoản sử dụng
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
