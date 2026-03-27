'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  History, 
  LineChart, 
  Menu, 
  X, 
  Sparkles,
  Package,
  Home
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/apply', label: 'Dự đoán', icon: LineChart },
  { href: '/history', label: 'Lịch sử', icon: History },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 gradient-ecommerce rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/30 transition-shadow duration-300">
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  )}
                >
                  <Icon className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-primary-600' : 'text-secondary-400'
                  )} />
                  {item.label}
                </Link>
              );
            })}
            
            {/* CTA Button */}
            <Link href="/apply" className="ml-2">
              <Button 
                size="sm" 
                className="btn-ecommerce gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Dự đoán ngay
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200/50 glass">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5',
                    isActive ? 'text-primary-600' : 'text-secondary-400'
                  )} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-2 pb-1">
              <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full btn-ecommerce gap-2 justify-center">
                  <Sparkles className="w-4 h-4" />
                  Dự đoán ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
