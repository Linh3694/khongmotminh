import { useState, useEffect } from 'react';
import { getApiUrl, API_ENDPOINTS } from '@/config/api';

const SignSection = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Fetch tổng số users khi component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = getApiUrl(API_ENDPOINTS.STATS);
        console.log('Fetching stats from:', apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.error(`API response not ok: ${response.status} ${response.statusText}`);
          return;
        }

        const data = await response.json();
        console.log('Stats response:', data);

        if (data.success) {
          setTotalUsers(data.data.totalUsers);
        } else {
          console.error('API returned success=false:', data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        if (error instanceof SyntaxError) {
          console.error('Response không phải JSON. Có thể backend chưa chạy hoặc trả về HTML error page.');
        }
      }
    };

    fetchStats();
  }, []);

  // Hàm xử lý submit form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Lưu reference đến form element trước khi async để tránh lỗi null
    const form = event.currentTarget;
    
    const formData = new FormData(form);
    const userData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      currentPosition: formData.get('currentPosition'),
      termsAgreed: formData.get('termsAgreed') === 'on'
    };

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      // Kiểm tra cả status code (200-299) và data.success
      if (response.ok && data.success) {
        // Sử dụng message từ server hoặc message mặc định
        const successMessage = data.message || 'Ký cam kết thành công. Cảm ơn bạn đã tham gia.';
        setSubmitMessage({ type: 'success', message: successMessage });
        
        // Cập nhật số lượng users từ response
        if (data.totalUsers !== undefined && typeof data.totalUsers === 'number') {
          setTotalUsers(data.totalUsers);
        } else {
          // Nếu không có trong response, fetch lại từ API stats để đảm bảo chính xác
          try {
            const statsResponse = await fetch(getApiUrl(API_ENDPOINTS.STATS));
            const statsData = await statsResponse.json();
            if (statsData.success && statsData.data?.totalUsers !== undefined) {
              setTotalUsers(statsData.data.totalUsers);
            }
          } catch (statsError) {
            console.error('Lỗi khi lấy thống kê:', statsError);
            // Không hiển thị lỗi cho user vì đăng ký đã thành công
          }
        }
        
        // Reset form sau khi thành công - kiểm tra null trước khi reset
        if (form) {
          form.reset();
        }
      } else {
        // Xử lý lỗi từ server (400, 500, etc.)
        const errorMessage = data.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        setSubmitMessage({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setSubmitMessage({ 
        type: 'error', 
        message: 'Có lỗi xảy ra khi đăng ký. Vui lòng kiểm tra kết nối và thử lại.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="bg-[#3500E0] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Quote */}
        <div className="text-center text-white mb-12 mt-20">
          <p className="text-xl md:text-5xl font-sans-bold leading-[52px] uppercase">
           Bạn đã sẵn sàng chung tay vì một không gian mạng an toàn?        
          </p>
        </div>

        {/* Registration Card */}
        <div className="max-w-6xl mx-auto">
          <div className="p-8">
            {submitMessage && (
              <div className={`mb-6 p-6 rounded-lg shadow-md font-sans-normal text-lg ${
                submitMessage.type === 'success'
                  ? 'bg-green-50 border-2 border-green-300 text-green-800'
                  : 'bg-red-50 border-2 border-red-300 text-red-800'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${
                    submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {submitMessage.type === 'success' ? '✓' : '✕'}
                  </span>
                  <span>{submitMessage.message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4"> 
              <div className="bg-white rounded-lg shadow-2xl lg:p-20 p-6">
              <div className="grid md:grid-cols-2 gap-10 mb-10">
                <div>
                  <label className="block text-xl lg:text-2xl font-medium text-gray-700 mb-1 font-sans-normal">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xl lg:text-2xl font-medium text-gray-700 mb-1">
                    Đang học/Công tác tại
                  </label>
                  <input
                    name="currentPosition"
                    type="text"
                    className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 my-10">
                <div>
                  <label className="block text-xl lg:text-2xl  text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xl lg:text-2xl font-medium text-gray-700 mb-1 font-sans-normal">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center lg:mt-20 mt-10">
                  <input
                    name="termsAgreed"
                    type="checkbox"
                    className="lg:h-9 lg:w-9 h-10 w-10 border-black border-2 text-red-500 focus:ring-red-500"
                    required
                  />
                  <span className="ml-2 text-sm lg:text-2xl text-gray-700">
                    TÔI CAM KẾT - CÙNG NHAU AN TOÀN TRỰC TUYẾN <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
              </div>

             <div className="flex items-center justify-center mx-auto lg:mt-28 mt-20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="mx-auto bg-[#FF0000] text-white text-xl lg:text-5xl font-sans-bold lg:px-40 px-10 lg:py-5 py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đồng ý'}
              </button>
              </div>
            </form>
          </div>
          <div className="lg:w-[1148px] w-full h-28 text-center justify-start text-white lg:text-3xl text-sm font-light lg:leading-[52px] leading-[32px] mt-5">(*) Sau khi ký cam kết, bạn sẽ nhận được Cẩm nang An toàn Trực tuyến – ấn phẩm chính thức do Cục A05 – Bộ Công an và Liên minh Niềm Tin Số biên soạn, giúp mỗi cá nhân trở thành lá chắn bảo vệ cộng đồng mạng an toàn và nhân văn.</div>
        </div>

        {/* Counter Display */}
        <div className="lg:mt-[25%] mt-[50%]">
        <div className="self-stretch h-28 text-center justify-start text-white lg:text-[291px] text-[200px] font-sans-normal uppercase leading-[52px] mb-20">
          {totalUsers.toLocaleString('vi-VN')}
        </div>
        <div className="self-stretch h-28 text-center justify-start text-white lg:text-5xl text-xl font-sans-bold uppercase leading-[52px] lg:mt-5 mt-0">
          người thực hiện ký cam kết
        </div>
        </div>
      </div>
    </section>
  );
};

export default SignSection
