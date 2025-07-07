import axios from 'axios'
import config from './config.util';

const host = config('HOST')

export const post = async (endpoint, body) =>
{
    console.log(endpoint, body)
    try
    {
        const response = await axios.post(host + endpoint, body)
        return {response: {status: response.status, data: response.data}}
    } catch (e)
    {
        if (e.response?.status === 513)
        {
            const res = await post('/session/refresh', {
                token: localStorage.getItem('__lorest'),
                clientToken: localStorage.getItem('__lore_client'),
            })
            if (res.response.status === 200)
            {
                console.log('Refreshed')
                localStorage.setItem('__lorest', res.response.data.token)
                localStorage.setItem('__lore_client', res.response.data.clientToken)

                return await post(endpoint, {
                    ...body,
                    token: res.response.data.token,
                    clientToken: res.response.data.clientToken,
                })
            }
            else
            {
                localStorage.removeItem('__lorest')
                localStorage.removeItem('__lore_client')
                console.log('Nah bruh')
                return {response: {status: e.response.status, data: e.response.data}}
            }
        }
        else return {response: {status: e.response?.status || 500, data: e.response?.data || {}}}
    }
}

export const get = async (endpoint) =>
{
    try
    {
        const response = await axios.get(host + endpoint)
        return {response: {status: response.status, data: response.data}}
    } catch (e)
    {
        return {response: {status: e.response.status, data: e.response.data}}
    }
}