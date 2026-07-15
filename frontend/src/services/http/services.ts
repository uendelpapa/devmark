import { api } from '../../lib/axios'
import type { Service, CreateServiceData, UpdateServiceData } from '../types'

export async function fetchServices(params?: {
  client_id?: string
  status?: string
}): Promise<Service[]> {
  const response = await api.get('/services', { params })
  return response.data.data
}

export async function fetchServiceDetails(id: string): Promise<Service> {
  const response = await api.get(`/services/${id}`)
  return response.data
}

export async function createService(data: CreateServiceData): Promise<Service> {
  const response = await api.post('/services', data)
  return response.data
}

export async function updateService(
  id: string,
  data: UpdateServiceData
): Promise<Service> {
  const response = await api.patch(`/services/${id}`, data)
  return response.data
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`)
}
