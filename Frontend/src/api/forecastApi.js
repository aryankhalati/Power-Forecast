import axios from 'axios'

const api = axios.create({
  baseURL: 'https://power-forecast.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

export const predictConsumption = async (formData) => {
  const { data } = await api.post('/predict', formData)
  return data
}

export const fetchHistory = async () => {
  const { data } = await api.get('/history')
  return data
}

export const fetchModelStats = async () => {
  const { data } = await api.get('/model-stats')
  return data
}