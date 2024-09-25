import Api from "@/api/auth/api";


class UserApi extends Api {
    constructor() {
        super();
    }

    doLogin(email: string, password: string) {
        const endpoint = "auth/login-user";

        return this.makeFetch({
            endpoint: endpoint,
            method: "POST",
            body: {email, password},
        })
    }

    doRegister(body: Object) {
        const endpoint = "auth/register-company";

        return this.makeFetch({
            endpoint,
            method: "POST",
            body: body,
        });
    }

    requestCodeToValidateEmail(email: string) {
        const endpoint = "auth/validate-email";

        return this.makeFetch({
            endpoint,
            method: "POST",
            body: {email},
        });
    }
}

export default UserApi;