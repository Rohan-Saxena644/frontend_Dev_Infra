export function deployedAppUrl(port: number): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  try {
    const host = new URL(apiUrl).hostname;
    return `http://${host}:${port}`;
  } catch {
    return `http://localhost:${port}`;
  }
}
