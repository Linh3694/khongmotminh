import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

// import heroBg from '/herosection.webp'

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  termsAgreed: boolean;
}
import heroAsset1 from '/hero-asset-01.webp'
import heroAsset2 from '/hero-asset-02.webp'
import heroAsset3 from '/hero-asset-03.webp'
import heroAsset4 from '/hero-asset-04.webp'


const HeroSection = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    termsAgreed: false
  });

  // API base URL
  const API_BASE = 'http://localhost:3000/api';

  // Lấy số lượng users khi component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/stats`);
      const data = await response.json();

      if (data.success) {
        setTotalUsers(data.data.totalUsers);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) {
      return 'Vui lòng nhập họ và tên';
    }
    if (!formData.email.trim()) {
      return 'Vui lòng nhập email';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) {
      return 'Vui lòng nhập số điện thoại';
    }
    if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      return 'Số điện thoại không hợp lệ';
    }
    if (!formData.termsAgreed) {
      return 'Vui lòng đồng ý với điều khoản sử dụng';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setMessageType('error');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('');

      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Đăng ký thành công!');
        setMessageType('success');
        setTotalUsers(data.totalUsers);

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          termsAgreed: false
        });
      } else {
        setMessage(data.message || 'Đăng ký thất bại');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setMessage('Lỗi kết nối server. Vui lòng thử lại.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat w-full h-[890px] flex items-center justify-center"
      style={{ backgroundImage: `url(/herosection.webp)` }}
    >

      {/* Hero Assets Grid - 3 assets vertical */}
      <div className="absolute z-10 top-[2%] left-[10%] items-center justify-start">
        <div>
          <img
            src={heroAsset1}
            alt="Hero Asset 1"
            className="w-24 h-24 md:w-[700px] md:h-auto object-cover"
          />
        </div>

        <div className="my-2">
          <img
            src={heroAsset2}
            alt="Hero Asset 2"
            className="w-24 h-24 md:w-[1000px] md:h-auto object-cover"
          />
        </div>

        <div>
          <img
            src={heroAsset3}
            alt="Hero Asset 3"
            className="w-24 h-24 md:w-[400px] md:h-auto object-cover"
          />
        </div>
      </div>

      {/* Hero Asset 4 - Bottom Right */}
      <div className="absolute bottom-0 right-0 z-10">
        <img
          src={heroAsset4}
          alt="Hero Asset 4"
          className="w-20 h-20 md:w-[900px] md:h-auto object-cover"
        />
      </div>

      {/* Main Text Content - Above form */}
      <div className="absolute top-1/3 left-0 right-0 z-15 flex flex-col items-center justify-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-10 drop-shadow-lg font-sans ">
          TOGETHER FOR ONLINE SAFETY
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg text-center font-sans">
          CHUNG TAY VÌ MỘT KHÔNG GIAN MẠNG AN TOÀN VÀ NHÂN VĂN
        </h2>

        {/* Counter */}
       
      </div>
        <div className="absolute bottom-10 left-[10%] z-15 flex flex-col items-start justify-center mt-10">
            <div className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
            {isLoading ? '...' : totalUsers}
            </div>
            <p className="text-xl md:text-3xl text-white mb-16 drop-shadow-lg uppercase font-bold">
            Người đã thực hiện ký cam kết
            </p>
        </div>
    
    </section>
  );
};

export default HeroSection
