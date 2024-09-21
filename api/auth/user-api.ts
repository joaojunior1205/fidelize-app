import Api from "@/api/auth/api";

class UserApi {
    api = null;
    endpoint = "/auth/login-user";

    constructor() {
        this.api = new Api();
    }

    async doLogin(email, password) {
        return this.api.makeFetch({
            endpoint: this.endpoint,
            method: "POST",
            body: {email, password},
        })
    }
}

export default UserApi;