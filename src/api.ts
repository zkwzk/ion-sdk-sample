import {OperationRequest} from "./models/types";
import {AxiosResponse} from "axios";

const baseURL = 'http://localhost:3000';
const operationURI = '/operations';

const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 1000,
});

export function operationApi(request: OperationRequest) : Promise<AxiosResponse> {
   return axiosInstance.post(operationURI, request)
}