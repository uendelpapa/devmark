import { api } from '../../lib/axios'
import type { Client, ClientWithPaymentStatus, ClientDetails } from '../types'

export async function fetchClients(): Promise<ClientWithPaymentStatus[]> {
  const response = await api.get('/clients')
  return response.data.data
}

export async function fetchClient(id: string): Promise<ClientDetails> {
  const response = await api.get(`/clients/${id}`)
  return response.data
}


export async function createClient(
  clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>
): Promise<Client> {
  const response = await api.post('/clients', clientData)
  return response.data
}

export async function updateClient(
  id: string,
  clientData: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>
): Promise<Client> {
  const response = await api.patch(`/clients/${id}`, clientData)
  return response.data
}
