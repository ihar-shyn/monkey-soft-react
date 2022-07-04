import axios from "axios";

class UserService {

    constructor(baseUrl) {
        this.rest_api_url = baseUrl + '/api/users';
    }

    getUsersWithParams(params) {
        return axios.get(this.rest_api_url, { params });
    }

    remove(id) {
        return axios.delete(this.rest_api_url + `/${id}`);
    }
}

export default UserService;
