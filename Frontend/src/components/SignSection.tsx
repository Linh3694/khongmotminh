import { useState, useEffect } from 'react';

const SignSection = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Fetch tổng số users khi component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stats');
        const data = await response.json();
        if (data.success) {
          setTotalUsers(data.data.totalUsers);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
      }
    };

    fetchStats();
  }, []);

  // Hàm xử lý submit form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formData = new FormData(event.currentTarget);
    const userData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      currentPosition: formData.get('currentPosition'),
      termsAgreed: formData.get('termsAgreed') === 'on'
    };

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({ type: 'success', message: 'Đăng ký thành công! Chào mừng bạn tham gia cộng đồng.' });
        setTotalUsers(data.totalUsers); // Cập nhật counter từ response
        // Reset form
        event.currentTarget.reset();
      } else {
        setSubmitMessage({ type: 'error', message: data.message });
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setSubmitMessage({ type: 'error', message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="bg-[#3500E0] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Quote */}
        <div className="text-center text-white mb-12">
          <p className="text-3xl md:text-4xl font-bold leading-[52px] uppercase">
Bạn đã sẵn sàng chung tay vì một không gian mạng an toàn?          </p>
        </div>

        {/* Registration Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            

            {submitMessage && (
              <div className={`mb-6 p-4 rounded-md ${
                submitMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {submitMessage.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    className="w-full px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đang học/Công tác tại *
                  </label>
                  <input
                    name="currentPosition"
                    type="text"
                    className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Đại học Quốc gia Hà Nội, Công ty ABC..."
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0987654321"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    name="termsAgreed"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    TÔI CAM KẾT - CÙNG NHAU AN TOÀN TRỰC TUYẾN
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đăng ký tham gia'}
              </button>
            </form>
          </div>
        </div>

        {/* Counter Display */}
        <div className="text-center text-white mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 inline-block">
            <div className="text-2xl md:text-3xl font-bold">
              {totalUsers.toLocaleString('vi-VN')}
            </div>
            <div className="text-sm opacity-90">
              Thành viên đã tham gia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignSection
