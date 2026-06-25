import { api } from '../../lib/axios'
import type { Payment, CreatePaymentData } from '../types'

export async function createPayment(data: CreatePaymentData): Promise<Payment> {
  const response = await api.post('/payments', data)
  return response.data
}

export async function deletePayment(paymentId: string): Promise<void> {
  await api.delete(`/payments/${paymentId}`)
}
