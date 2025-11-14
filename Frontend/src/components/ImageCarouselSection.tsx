import { useEffect, useRef } from 'react';

const ImageCarouselSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Danh sách ảnh cho carousel
  const images = [
    '/row1-1.webp',
    '/row1-2.webp',
    '/row2-1.webp',
    '/row2-2.webp',
    '/row3-1.webp',
    '/row3-2.webp',
    '/hero-asset-01.webp',
    '/hero-asset-02.webp',
    '/hero-asset-03.webp',
    '/hero-asset-04.webp'
  ];

  // Duplicate images for infinite scroll effect
  const duplicatedImages = [...images, ...images];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId: number;
    let position = 0;
    const speed = 1; // Tốc độ cuộn (pixels per frame)

    const animate = () => {
      position -= speed;

      // Reset position khi cuộn hết một vòng
      if (Math.abs(position) >= carousel.scrollWidth / 2) {
        position = 0;
      }

      carousel.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className="py-20 bg-[#3500E0] overflow-hidden relative">
      <div className="max-w-full relative">
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex space-x-6"
            style={{
              width: `${duplicatedImages.length * 320}px`, // 320px = 300px width + 20px gap
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="flex-shrink-0 w-80 h-60 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlays for smooth infinite effect */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default ImageCarouselSection;
