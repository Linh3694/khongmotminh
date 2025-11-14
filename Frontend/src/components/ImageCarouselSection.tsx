import { useEffect, useRef } from 'react';

const ImageCarouselSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Danh sách ảnh cho carousel
  const images = [
    '/sign/1.jpg',
    '/sign/2.jpg',
    '/sign/3.jpg',
    '/sign/4.jpg',
    '/sign/5.jpg',
    '/sign/6.jpg',
    '/sign/7.jpg',
    '/sign/8.jpg',
    '/sign/9.jpg',
    '/sign/10.jpg',
    '/sign/11.jpg'
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
                className="shrink-0 w-80 h-60 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
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
      </div>
    </section>
  );
};

export default ImageCarouselSection;
