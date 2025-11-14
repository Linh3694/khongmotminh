import { useState, useEffect } from 'react'
import { getApiUrl, API_ENDPOINTS } from '@/config/api'

// import heroBg from '/herosection.webp'
import heroAsset1 from '/hero-asset-01.webp'
import heroAsset2 from '/hero-asset-02.webp'
import heroAsset3 from '/hero-asset-03.webp'
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
      className="relative bg-center bg-no-repeat w-full h-[890px] flex items-center justify-center"
      style={{
        backgroundImage: `url(${isMobile ? '/hero-section.webp' : '/herosection.webp'})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
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
            className="w-24 h-24 md:w-[1100px] md:h-auto object-cover"
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
        <h1 className="text-4xl md:text-6xl text-white mb-10 drop-shadow-lg font-sans-bold">
          TOGETHER FOR ONLINE SAFETY
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg text-center font-sans-medium">
          CHUNG TAY VÌ MỘT KHÔNG GIAN MẠNG AN TOÀN VÀ NHÂN VĂN
        </h2>

        {/* Counter */}
       
      </div>
        <div className="absolute bottom-10 lg:left-[8%] left-[1%] z-15 flex flex-col items-start justify-center mt-10">
            <div className="text-6xl md:text-8xl text-white mb-4 drop-shadow-lg font-sans-normal">
            {isLoading ? '...' : totalUsers}
            </div>
            <p className="text-xl md:text-3xl text-white mb-16 drop-shadow-lg uppercase font-sans-normal">
            Người đã thực hiện ký cam kết
            </p>
        </div>
    
    </section>
  );
};

export default HeroSection
