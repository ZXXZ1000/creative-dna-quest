export function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isSafariUA = /safari/i.test(ua) && !/chrome|crios|android|edge|edg/i.test(ua);
  const isAppleVendor = typeof (navigator as any).vendor === 'string' && /apple/i.test((navigator as any).vendor);
  return isSafariUA || isAppleVendor;
}

