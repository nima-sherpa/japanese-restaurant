export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function centsToFloat(cents: number): number {
  return cents / 100
}

export function floatToCents(amount: number): number {
  return Math.round(amount * 100)
}

export function generateConfirmationCode(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}${random}`.substring(0, 12)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const sequence = Math.floor(Math.random() * 10000)
  return `ORD-${year}-${sequence.toString().padStart(4, '0')}`
}

export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
