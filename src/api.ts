import {OperationRequest} from './models/types';
import {AxiosResponse} from 'axios';
import path from "path";

require('dotenv').config({path: path.join(__dirname, '.env')});

const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 1000,
});

export function operationApi(request: OperationRequest): Promise<AxiosResponse> {
    return axiosInstance.post(process.env.OPERATION_URI, request)
}