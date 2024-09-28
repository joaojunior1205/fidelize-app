import Api from "@/api/auth/api";

const endpoint = "client";

class ClientApi extends Api {
    constructor() {
        super();
    }

    get() {
        return this.makeFetch({
           endpoint,
           method: "GET",
        });
    }
}

export default ClientApi;