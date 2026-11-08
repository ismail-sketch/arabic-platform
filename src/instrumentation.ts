/**
 * На Windows Node иногда падает с "fetch failed" из-за IPv6-резолва.
 * Форсируем IPv4 один раз при старте сервера.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('node:dns');
    dns.setDefaultResultOrder('ipv4first');
  }
}
