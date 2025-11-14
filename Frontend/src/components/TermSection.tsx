// import termBg from '/termsection.webp'

const TermSection = () => {
  return (
    <section
      className="relative w-full h-auto min-h-screen lg:h-[1970px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/termsection.webp)` }}
    >

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[400px] py-16 px-6">
        <div className="max-w-6xl mx-auto text-center text-white">
         
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-lg lg:text-3xl md:text-4xl font-bold uppercase">
              Ký cam kết này, tôi hoàn toàn đồng ý
            </h2>
          </div>

          {/* Image Gallery - 1 column on mobile, 2 columns on desktop */}
          <div className="my-10">
            <div className="flex flex-wrap justify-center gap-10 max-w-7xl mx-auto">
              <div className="w-full md:w-[calc(50%-20px)]">
                <img
                  src="/row1-1.webp"
                  alt="Row 1 Image 1"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full md:w-[calc(50%-20px)]"> 
                <img
                  src="/row1-2.webp"
                  alt="Row 1 Image 2"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full md:w-[calc(50%-20px)]">
                <img
                  src="/row2-1.webp"
                  alt="Row 2 Image 1"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full md:w-[calc(50%-20px)]">
                <img
                  src="/row2-2.webp"
                  alt="Row 2 Image 2"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full md:w-[calc(50%-20px)]">
                <img
                  src="/row3-1.webp"
                  alt="Row 3 Image 1"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full md:w-[calc(50%-20px)]">
                <img
                  src="/row3-2.webp"
                  alt="Row 3 Image 2"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="max-w-5xl mt-[20%] mx-auto">
            <p className="lg:text-3xl text-lg font-sans-bold mb-6 uppercase lg:leading-[52px] leading-[32px]">
             Mỗi cú click có trách nhiệm trong không gian số toàn cầu là một nền móng xây niềm tin số, để “không một mình”, và để chúng ta - trong kỷ nguyên số đang vươn mình – CÙNG NHAU AN TOÀN TRỰC TUYẾN.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermSection
