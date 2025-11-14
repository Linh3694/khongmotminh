import { useState, useEffect } from 'react'
import { getApiUrl, API_ENDPOINTS } from '@/config/api'

// import heroBg from '/herosection.webp'
import heroAsset4 from '/hero-asset-04.webp'


const HeroSection = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Lấy số lượng users khi component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <section
      className="relative bg-center bg-no-repeat w-full lg:h-[890px] h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${isMobile ? '/hero-section.webp' : '/herosection.webp'})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >

      {/* Hero Asset */}
      <div className="absolute z-10 lg:top-[2%] lg:left-[10%] top-[3%] left-0 mx-10 lg:mx-0 items-center justify-start">
        <img
          src={isMobile ? '/hero-asset-mobile.png' : '/hero-asset-desktop.png'}
          alt="Hero Asset"
          className="w-full h-auto max-w-full max-h-[200px] object-contain"
        />
      </div>

      {/* Hero Asset 4 - Bottom Right */}
      <div className="absolute bottom-0 right-0 z-10">
        <img
          src={heroAsset4}
          alt="Hero Asset 4"
          className="w-full h-auto md:w-[900px] md:h-auto object-cover"
        />
      </div>

      {/* Main Text Content - Above form */}
      <div className="absolute top-1/4 lg:top-1/3 left-0 right-0 z-15 flex flex-col items-center justify-center max-w-full">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl text-white mb-10 drop-shadow-lg font-sans-bold text-center">
          TOGETHER FOR ONLINE SAFETY
        </h1>
        <h2 className="text-xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg text-center font-sans-bold mx-5">
          CHUNG TAY VÌ MỘT KHÔNG GIAN MẠNG AN TOÀN VÀ NHÂN VĂN
        </h2>

        {/* Counter - Mobile: below main text, Desktop: hidden */}
        <div className="lg:hidden flex flex-col items-center justify-center mt-[4%]">
            <div className="text-9xl md:text-6xl text-white drop-shadow-lg font-sans-bold">
            {isLoading ? '...' : totalUsers}
            </div>
            <p className="text-lg md:text-2xl text-white mb-8 drop-shadow-lg uppercase font-sans-bold text-center">
            Người đã thực hiện ký cam kết
            </p>
        </div>
      </div>

        {/* Counter - Desktop: bottom left, Mobile: hidden */}
        <div className="hidden lg:flex absolute bottom-10 lg:left-[8%] left-[1%] z-15 flex-col items-start justify-center mt-10">
            <div className="text-6xl md:text-8xl text-white mb-4 drop-shadow-lg font-sans-normal">
            {isLoading ? '...' : totalUsers}
            </div>
            <p className="text-xl md:text-3xl text-white mb-16 drop-shadow-lg uppercase font-sans-bold">
            Người đã thực hiện ký cam kết
            </p>
        </div>
    
    </section>
  );
};

export default HeroSection
