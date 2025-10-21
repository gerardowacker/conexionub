import axios, {AxiosError, AxiosResponse} from 'axios'

const host = process.env.NEXT_PUBLIC_LORE_HOST

type Token = { token: string, clientToken: string }

interface ApiResponse {
    response: {
        status: number;
        data: AxiosResponse['data'] ;
    };
}

export const post = async (
    endpoint: string,
    body: Record<string, string | number | boolean | undefined | null>,
): Promise<ApiResponse> => {
    console.log(endpoint, body)
    try {
        const response = await axios.post(host + endpoint, body)
        return {response: {status: response.status, data: response.data}}
    } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 513) {
            const res = await post('/session/refresh', {
                token: localStorage.getItem('__lorest'),
                clientToken: localStorage.getItem('__lore_client'),
            })
            if (res.response.status === 200) {
                const successfulRes = res.response.data as Token
                console.log('Refreshed')
                localStorage.setItem('__lorest', successfulRes.token)
                localStorage.setItem('__lore_client', successfulRes.clientToken)

                return await post(endpoint, {
                    ...body,
                    token: successfulRes.token,
                    clientToken: successfulRes.clientToken,
                })
            } else {
                localStorage.removeItem('__lorest')
                localStorage.removeItem('__lore_client')
                console.log('Nah bruh')
                return {response: {status: e.response.status, data: e.response.data}}
            }
        } else if (e instanceof AxiosError)
            return {response: {status: e.response?.status || 500, data: e.response?.data || {}}}
        else return {response: {status: 500, data: 'Unknown error'}}
    }
}

export const get = async (endpoint: string): Promise<ApiResponse> => {
    try {
        const response = await axios.get(host + endpoint)
        return {response: {status: response.status, data: response.data}}
    } catch (e: unknown) {
        if (e instanceof AxiosError)
            return {response: {status: e.response?.status || 500, data: e.response?.data}}
        else return {response: {status: 500, data: 'Unknown error'}}
    }
}