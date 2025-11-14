// import descriptionBg from '/descriptionsection.webp'

const DescriptionSection = () => {
  return (
    <section
      className="relative w-full lg:h-[834px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(/descriptionsection.webp)` }}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center lg:py-16 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center text-white">
          {/* First paragraph */}
          <p className="text-lg md:text-3xl mb-6 leading-relaxed text-balance text-center font-extralight">
            Không gian mạng mang lại rất nhiều giá trị cho học tập, làm việc và kết nối toàn cầu. Nhưng đi cùng với đó là các nguy cơ lừa đảo, dụ dỗ, bắt nạt, xâm hại dữ liệu và cô lập tinh thần – đặc biệt với trẻ em, thanh thiếu niên và phụ nữ. Trong rất nhiều trường hợp, nạn nhân phải đối diện một mình chỉ vì không kịp kết nối với gia đình, nhà trường hoặc kênh hỗ trợ.
          </p>

          {/* Second paragraph */}
          <p className="text-lg md:text-3xl leading-relaxed text-balance font-bold">
            Sự kết nối và hành động kịp thời chính là chìa khoá để phá vỡ vòng vây cô lập. Vì vậy tôi tự nguyện tham gia ký cam kết này.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection
