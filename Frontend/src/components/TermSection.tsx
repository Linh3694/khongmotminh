// import termBg from '/termsection.webp'

const TermSection = () => {
  return (
    <section
      className="relative w-full h-[1970px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/termsection.webp)` }}
    >

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[400px] py-16 px-6">
        <div className="max-w-6xl mx-auto text-center text-white">
         
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
              Ký cam kết này, tôi hoàn toàn đồng ý
            </h2>
          </div>

          {/* Image Gallery - 2 columns */}
          <div className="my-10">
            <div className="grid grid-cols-2 gap-5 max-w-6xl mx-auto">
              <div>
                <img
                  src="/row1-1.webp"
                  alt="Row 1 Image 1"
                  className="w-full h-fit object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div> 
                <img
                  src="/row1-2.webp"
                  alt="Row 1 Image 2"
                  className="w-full h-fit object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <img
                  src="/row2-1.webp"
                  alt="Row 2 Image 1"
                  className="w-full h-fit object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <img
                  src="/row2-2.webp"
                  alt="Row 2 Image 2"
                  className="w-full h-fit object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <img
                  src="/row3-1.webp"
                  alt="Row 3 Image 1"
                  className="w-full h-fit object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <img
                  src="/row3-2.webp"
                  alt="Row 3 Image 2"
                  className="w-full h-fit object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-[25%] mx-auto">
            <p className="text-4xl font-medium mb-6 uppercase leading-[52px]">
             Mỗi cú click có trách nhiệm trong không gian số toàn cầu là một nền móng xây niềm tin số, để “không một mình”, và để chúng ta - trong kỷ nguyên số đang vươn mình – CÙNG NHAU AN TOÀN TRỰC TUYẾN.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermSection
