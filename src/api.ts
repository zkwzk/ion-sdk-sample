import {OperationRequest} from "./models/types";
import {AxiosResponse} from "axios";

const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000,
});

export function operationApi(request: OperationRequest) : Promise<AxiosResponse> {
   return axiosInstance.post('/operations', request)
}