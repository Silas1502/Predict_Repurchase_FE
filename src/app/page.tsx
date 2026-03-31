import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  TrendingUp,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Target,
  Sparkles,
  Play,
  Award,
  Clock,
  Brain,
  Shield,
  History,
  Users,
  Package,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'AI Dự Đoán Thông Minh',
      description:
        'Mô hình ML được huấn luyện trên 100K+ đơn hàng thực tế để dự đoán chính xác hành vi mua lại của khách hàng.',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: Zap,
      title: 'Phân Tích Real-time',
      description:
        'Nhận kết quả dự đoán trong vài giây với dashboard trực quan và insights chi tiết.',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Target,
      title: 'Phân Khúc Khách Hàng',
      description:
        'Tự động phân loại khách hàng thành 3 nhóm: Tự hành, Tăng trưởng, Tối ưu chi phí.',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      icon: BarChart3,
      title: 'Báo Cáo Trực Quan',
      description:
        'Biểu đồ đồng hồ tương tác và phân tích chi tiết các yếu tố ảnh hưởng đến quyết định mua.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Shield,
      title: 'Bảo Mật Dữ Liệu',
      description:
        'Dữ liệu khách hàng được mã hóa và lưu trữ an toàn, tuân thủ các tiêu chuẩn bảo mật.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Tăng Trưởng Doanh Thu',
      description:
        'Xác định khách hàng tiềm năng cao để tối ưu chiến lược marketing và tăng tỷ lệ giữ chân.',
      color: 'bg-primary-100 text-primary-600',
    },
  ];

  const stats = [
    { value: '100K+', label: 'Đơn hàng phân tích', icon: Package },
    { value: '99.2%', label: 'Độ chính xác', icon: Award },
    { value: '< 3s', label: 'Thời gian phản hồi', icon: Clock },
    { value: '25+', label: 'Features ML', icon: Sparkles },
  ];

  const steps = [
    {
      number: '01',
      title: 'Nhập ID Khách Hàng',
      description: 'Nhập mã khách hàng hoặc tải lên dữ liệu giao dịch.',
      icon: Users,
    },
    {
      number: '02',
      title: 'Hệ Thống Phân Tích',
      description: 'AI xử lý và phân tích lịch sử mua hàng, tần suất, giá trị đơn.',
      icon: Brain,
    },
    {
      number: '03',
      title: 'Nhận Kết Quả & Hành Động',
      description: 'Xác suất mua lại, phân khúc khách hàng và đề xuất chiến lược.',
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - E-commerce Style */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-ecommerce opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm font-medium text-white mb-6 border border-white/20">
                <Sparkles className="w-4 h-4" />
                <span>Giải pháp AI cho E-commerce</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                Dự Đoán Hành Vi{' '}
                <span className="text-amber-300">Mua Lại</span>{' '}
                Của Khách Hàng
              </h1>
              
              {/* Description */}
              <p className="text-lg lg:text-xl text-white/80 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Tận dụng sức mạnh Machine Learning để dự đoán khả năng mua lại, 
                tối ưu chiến lược marketing và tăng tỷ lệ giữ chân khách hàng 
                cho doanh nghiệp thương mại điện tử.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/apply">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-700 hover:bg-gray-100 btn-ecommerce gap-2 px-8"
                  >
                    <Play className="w-5 h-5" />
                    Bắt đầu dự đoán
                  </Button>
                </Link>
                <Link href="/history">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white/50 text-white hover:bg-white/10 bg-transparent gap-2 px-8"
                  >
                    <History className="w-5 h-5" />
                    Xem lịch sử
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Miễn phí sử dụng</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Không cần đăng ký</span>
                </div>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="glass rounded-2xl p-6 text-center animate-slide-up h-full flex flex-col justify-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden mt-12 grid grid-cols-2 gap-4">
            {stats.slice(0, 4).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="glass rounded-xl p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-white/70 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - E-commerce Process */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Quy trình đơn giản
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Cách Thức Hoạt Động
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Chỉ 3 bước đơn giản để nhận dự đoán chính xác về hành vi mua lại của khách hàng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-200 to-primary-100" />
                  )}
                  
                  <Card className="card-hover border-0 shadow-lg shadow-secondary-100/50 relative z-10">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 gradient-ecommerce rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-bold mb-4">
                        Bước {step.number}
                      </span>
                      <h3 className="text-xl font-bold text-secondary-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-secondary-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 gradient-ecommerce-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-primary-700 rounded-full text-sm font-medium mb-4 shadow-sm">
              <Award className="w-4 h-4" />
              Tính năng nổi bật
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Giải Pháp Toàn Diện Cho E-commerce
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Mọi công cụ bạn cần để dự đoán và phân tích hành vi khách hàng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="card-hover border-0 shadow-lg shadow-secondary-100/50 bg-white"
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 gradient-navy relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white mb-8">
            <Target className="w-4 h-4" />
            Bắt đầu ngay hôm nay
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Sẵn sàng Tối Ưu Chiến Lược
            <br />
            <span className="text-amber-400">Giữ Chân Khách Hàng?</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Tham gia cùng các doanh nghiệp TMĐT hàng đầu đang sử dụng AI 
            để dự đoán hành vi khách hàng và tăng trưởng doanh thu
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button 
                size="lg" 
                className="bg-primary-500 hover:bg-primary-600 btn-ecommerce gap-2 px-8 text-lg"
              >
                <Play className="w-5 h-5" />
                Thực hiện Dự đoán
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Không cần thẻ tín dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Miễn phí hoàn toàn</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Kết quả tức thì</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
