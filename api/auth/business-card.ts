import Api from "./api";

const endpoint = "business-card";

class BusinessCard extends Api {
    constructor() {
        super();
    }

    create(body: Object) {
        return this.makeFetch({
            endpoint,
            method: "POST",
            body
        })
    }
}

export default BusinessCard;