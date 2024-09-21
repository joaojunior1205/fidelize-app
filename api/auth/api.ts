import config from "@/config";

type makeParams = {
    endpoint: string;
    method: string;
    headers: object;
    body?: object | null;
}


class Api {
    async makeFetch({endpoint, method, headers, body}: makeParams): Promise<any> {
        let init: any = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        }

        if (body) {
            init.body = JSON.stringify(body);
        }

        const response = await fetch(`${config.apiUrl}${endpoint}`, init);

        if (response.ok) {
            return response.json();
        } else {
            throw await response.json();
        }

    }
}

export default Api;