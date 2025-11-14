import { useState, useEffect } from 'react';

const Footer = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <footer className="w-full">
      <img
        src={isMobile ? '/footer-mobile.png' : '/footer.png'}
        alt="Footer"
        className="w-full h-auto object-cover"
      />
    </footer>
  );
};

export default Footer;
