import config from "@/config";
import {router} from "expo-router";
import * as SecureStore from "expo-secure-store";

type makeParams = {
    endpoint: string;
    method: string;
    headers?: object | null;
    body?: object | null;
}

class Api {
    async makeFetch({endpoint, method, headers = null, body = null}: makeParams): Promise<any> {
        const token = await SecureStore.getItemAsync("userToken");

        let init: any = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
        }

        if (body) {
            init.body = JSON.stringify(body);
        }

        const response = await fetch(`${config.apiUrl}${endpoint}`, init);
        const contentType = response.headers.get("content-type");

        if (response.ok) {
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                throw response;
            }
        } else {
            const oldRequest = {
                endpoint,
                method,
                headers,
                body
            }

            if (contentType && contentType.includes("application/json")) {
                const body = await response.json();

                if (body?.expiredToken) {
                    const initConfig: any = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }

                    const tokenToRefresh = await SecureStore.getItemAsync("tokenToRefresh");

                    initConfig.body = JSON.stringify({refreshToken: tokenToRefresh});

                    const requestNewToken: any = await fetch(`${config.apiUrl}auth/refresh-token`, initConfig);
                    const accessToken = await requestNewToken.json();

                    if (requestNewToken.ok) {
                        const newAccessToken = accessToken.data.accessToken;
                        await SecureStore.setItemAsync("userToken", newAccessToken);
                    } else {
                        await SecureStore.deleteItemAsync('userToken');
                        await SecureStore.deleteItemAsync('tokenToRefresh');
                        await SecureStore.deleteItemAsync('userInfo');
                        router.replace('/login');
                        throw response;
                    }

                    return await this.makeFetch(oldRequest);
                }
            } else {
                if (response.status === 401) {
                    await SecureStore.deleteItemAsync('userToken');
                    await SecureStore.deleteItemAsync('tokenToRefresh');
                    await SecureStore.deleteItemAsync('userInfo');
                    router.replace('/login');
                }

                throw response;
            }
        }
    }
}

export default Api;