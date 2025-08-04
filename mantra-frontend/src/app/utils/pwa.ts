// Utility to detect if app is running in PWA standalone mode
export function isStandalonePWA(): boolean {
  // iOS
  if ((window.navigator as any).standalone) return true;
  // Android/other
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return false;
}
