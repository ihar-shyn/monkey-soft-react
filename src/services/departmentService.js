import axios from "axios";

class DepartmentService {

    constructor(baseUrl) {
        this.rest_api_url = baseUrl + '/api/departments';
    }

    getAllDepartments() {
        return axios.get(this.rest_api_url + '/all');
    }

    getDepartmentsByParams(params) {
        return axios.get(this.rest_api_url, { params });
    }

    remove(id) {
        return axios.delete(this.rest_api_url + `/${id}`);
    }
}

export default DepartmentService;
