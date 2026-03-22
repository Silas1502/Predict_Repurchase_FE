import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SystemStatus } from '@/components/system/SystemStatus';
import {
  Brain,
  TrendingUp,
  History,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'Dự Đoán Bằng AI',
      description:
        'Mô hình machine learning được huấn luyện trên dữ liệu thương mại điện tử Olist để dự đoán hành vi mua lại của khách hàng.',
    },
    {
      icon: Zap,
      title: 'Phân Tích Nhanh',
      description:
        'Nhận ngay xác suất mua lại với thông tin chi tiết chỉ trong vài giây.',
    },
    {
      icon: History,
      title: 'Lịch Sử Giao Dịch',
      description:
        'Dễ dàng nhập dữ liệu giao dịch của khách hàng hoặc nhập thủ công để phân tích.',
    },
    {
      icon: BarChart3,
      title: 'Phân Tích Trực Quan',
      description:
        'Biểu đồ đồng hồ tương tác và phân tích chi tiết các yếu tố cho mỗi dự đoán.',
    },
    {
      icon: Shield,
      title: 'Bảo Mật Dữ Liệu',
      description:
        'Tất cả dự đoán được lưu trữ an toàn và có thể xem lại bất kỳ lúc nào từ trang lịch sử.',
    },
    {
      icon: TrendingUp,
      title: 'Thông Tin Kinh Doanh',
      description:
        'Xác định khách hàng tiềm năng cao và tối ưu chiến lược marketing của bạn.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Nhập Dữ Liệu Khách Hàng',
      description: 'Nhập ID khách hàng và lịch sử giao dịch của họ.',
    },
    {
      number: '02',
      title: 'Điền Nhanh (Tùy chọn)',
      description: 'Sử dụng Lấy Lịch Sử để tự động điền từ dữ liệu hiện có.',
    },
    {
      number: '03',
      title: 'Nhận Dự Đoán',
      description: 'Nhận xác suất mua lại bằng AI và thông tin chi tiết.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-8">
              <SparklesIcon className="w-4 h-4" />
              Phân Tích TMĐT Bằng AI
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Dự Đoán Hành Vi Mua Lại Của Khách Hàng
            </h1>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Tận dụng machine learning để xác định khách hàng nào có khả năng mua lại.
              Tối ưu nỗ lực marketing và tăng tỷ lệ giữ chân khách hàng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button size="lg" variant="primary" className="bg-white text-primary-700 hover:bg-gray-100">
                  Bắt đầu Dự đoán
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/history">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Xem Lịch sử
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats & System Status */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-4xl font-bold">25+</p>
              <p className="text-primary-200 mt-1">Tính năng ML</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-4xl font-bold">Thời gian thực</p>
              <p className="text-primary-200 mt-1">Dự đoán</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-4xl font-bold">99%+</p>
              <p className="text-primary-200 mt-1">Độ chính xác</p>
            </div>
            <div className="lg:col-span-1">
              <SystemStatus showDetails={false} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cách Thức Hoạt Động</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bắt đầu dự đoán mua lại chỉ với ba bước đơn giản
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <span className="text-5xl font-bold text-primary-100 absolute top-4 right-4">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 relative z-10">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tính Năng Chính</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mọi thứ bạn cần để dự đoán và phân tích hành vi mua lại của khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng Bắt đầu Dự đoán?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Tham gia cùng các doanh nghiệp sử dụng AI để tối ưu chiến lược giữ chân khách hàng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Thực hiện Dự đoán Đầu tiên
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-500" />
              <span>Không cần thẻ tín dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-500" />
              <span>Miễn phí sử dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-500" />
              <span>Kết quả tức thì</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}
