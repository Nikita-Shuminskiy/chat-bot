import axios, {AxiosResponse} from "axios";

const API_URL = 'https://api.clickcontent.ru/v2/'
const instance = axios.create({
    baseURL: API_URL,
});

const commonApi = {
    getNick(): Promise<AxiosResponse<{ nickname?: string }>> {
        return instance.get(`info/nickname/Nick0shumii`);
    },

    sendAuthPhone(payload: { phone: number }): Promise<AxiosResponse<{ data?: any }>> {
        return instance.post(`auth/sms`, payload);
    },

    sendAuthCode(payload: { code: number }): Promise<AxiosResponse<{ data?: any }>> {
        return instance.post(`auth/sms-verification`, payload);
    },
};
export default commonApi;
