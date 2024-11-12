import axios, {AxiosResponse} from "axios";

const API_URL = 'https://api.clickcontent.ru/v2/'
const instance = axios.create({
    baseURL: API_URL,
});

const commonApi = {
    getNick(): Promise<AxiosResponse<{ nickname?: string }>> {
        return instance.get(`info/nickname/Nick0shumii`);
    },
};
export default commonApi;
