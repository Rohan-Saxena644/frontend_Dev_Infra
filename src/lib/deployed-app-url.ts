export function deployedAppUrl(port: number): string {
  const host = process.env.NEXT_PUBLIC_DEPLOYMENT_HOST ?? "localhost";
  return `http://${host}:${port}`;
}
