import { useState, useEffect } from "react";

const useWindowResize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobileView: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobileView: window.innerWidth < 768,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

export default useWindowResize;
