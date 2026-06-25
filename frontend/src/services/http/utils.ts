export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} ${monthCapitalized} ${year}`;
  } catch (e) {
    return dateString;
  }
}
