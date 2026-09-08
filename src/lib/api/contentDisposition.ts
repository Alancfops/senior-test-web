/** Extrai filename de Content-Disposition (RFC 5987), como no app mobile STF. */
export function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) return null;

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      // fallback ASCII abaixo
    }
  }

  const asciiMatch = header.match(/filename="([^"]+)"/i);
  return asciiMatch?.[1] ?? null;
}
