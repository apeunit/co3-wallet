import axios from 'axios'

const API_URL = process.env.REACT_APP_CO3UUM_URL

export const getUserProfile = async (accessToken: string): Promise<Object> => {
    return (await axios.get(`${API_URL}/profile?access_token=${accessToken}`)).data
}

export const saveUserPublicKey = async (publicKey: string, accessToken: string): Promise<Object> => {
    const update = {
        blockchain_public_key: publicKey
    }
    return (await axios.post(`${API_URL}/profile?access_token=${accessToken}&update=${update}`, { headers: {} })).data
}