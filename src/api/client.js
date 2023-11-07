import { create } from 'apisauce'

const apiClient = create({
    baseURL: 'https://zmarkforce.com',
    // baseURL: 'http://23.101.22.149:8074',
})

export default apiClient;