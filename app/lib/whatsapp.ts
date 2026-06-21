export function waLink(number: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}
