export function formatPhone(value: string): string {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '').trim()
  }
  return digits.slice(0, 11).replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '').trim()
}

export function formatDocument(value: string): string {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/-$/, '').trim()
  }
  return digits.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5').replace(/-$/, '').trim()
}

export function formatCurrencyBRL(value: string | number): string {
  if (value === undefined || value === null || value === '') return 'R$ 0,00'
  const numericValue = typeof value === 'number' 
    ? value 
    : parseFloat(value.toString().replace(/\D/g, '')) / 100
  
  if (isNaN(numericValue)) return 'R$ 0,00'
  return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function parseCurrencyToNumber(formattedValue: string): number {
  if (!formattedValue) return 0
  const digits = formattedValue.replace(/\D/g, '')
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}
