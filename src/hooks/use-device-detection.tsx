import { useEffect, useState } from "react";

interface DeviceInfo {
  isMobile: boolean;
  isPWA: boolean;
  isMobileOrPWA: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isPWA: false,
    isMobileOrPWA: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      // Detectar mobile através de user agent e viewport
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;

      // Detectar PWA através de diferentes métodos
      const isPWA =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");

      const isMobileOrPWA = isMobile || isPWA;

      setDeviceInfo({
        isMobile,
        isPWA,
        isMobileOrPWA,
      });
    };

    // Verificar na inicialização
    checkDevice();

    // Verificar quando a janela for redimensionada
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return deviceInfo;
}
