import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";
import UserService from "../services/userService";
import DepartmentService from "../services/departmentService"

const UsersList = (props) => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([])
    const [warningMessage, setWarningMessage] = useState("");

    const [searchLogin, setSearchLogin] = useState("");
    const [searchFirstname, setSearchFirstname] = useState("");
    const [searchLastname, setSearchLastname] = useState("");
    const [searchDepartmentId, setSearchDepartmentId] = useState("");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const pageSizes = [5, 10, 20];

    const usersRef = useRef();

    const userService = new UserService(props.baseUrl);
    const departmentService = new DepartmentService(props.baseUrl);

    usersRef.current = users;

    const onChangeSearchLogin = (e) => {
        const searchLogin = e.target.value;
        setSearchLogin(searchLogin);
    };

    const onChangeSearchFirstname = (e) => {
        const searchFirstname = e.target.value;
        setSearchFirstname(searchFirstname);
    };

    const onChangeSearchLastname = (e) => {
        const searchLastName = e.target.value;
        setSearchLastname(searchLastName);
    }

    const onChangeSearchDepartment = (e) => {
        const searchDepartment = e.target.value;
        setSearchDepartmentId(searchDepartment);
    };

    const getRequestParams = (login, firstname, lastname, departmentId, page, pageSize) => {
        let params = {};

        if (login) {
            params["login"] = login;
        }

        if (firstname) {
            params["firstname"] = firstname;
        }

        if (lastname) {
            params["lastname"] = lastname;
        }

        if (departmentId) {
            params["departmentId"] = departmentId;
        }

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["size"] = pageSize;
        }

        return params;
    };

    const retrieveDepartments = () => {
        departmentService.getAllDepartments().then((response) => {
            const { departments } = response.data;
            setDepartments(departments);
        })
    };

    useEffect(retrieveDepartments, []);

    const retrieveUsers = () => {
        const params = getRequestParams(searchLogin, searchFirstname, searchLastname, searchDepartmentId, page, pageSize);

        userService.getUsersWithParams(params)
            .then((response) => {
                const { monkeys, totalPages } = response.data;
                setUsers(monkeys);
                setCount(totalPages);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(retrieveUsers, [page, pageSize]);

    const findBySearchParams = () => {
        setPage(1);
        retrieveUsers();
    };

    const deleteUser = (rowIndex) => {
        const userId = usersRef.current[rowIndex].id;

        userService.remove(userId)
            .then((response) => {

                let newUsers = [...usersRef.current];
                newUsers.splice(rowIndex, 1);

                setUsers(newUsers);
            })
            .catch((e) => {
                if(e?.response?.data?.errorMessage) {
                    setWarningMessage(e.response.data.errorMessage);
                }
            });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    const columns = useMemo(
        () => [
            {
                Header: "Login",
                accessor: "login",
            },
            {
                Header: "Name",
                accessor: "fullName",
            },
            {
                Header: "Department",
                accessor: "departmentName",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
            <a href={"/user/" + props.row.original.id}>Edit</a>
                            &nbsp;
            <a href={"#"} onClick={() => deleteUser(rowIdx)}>Delete</a>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: users,
    });

    return (
        <div className="list row">

            <div className="col-sm-3">
                <label className="form-label" htmlFor="login-search">Login</label>
                <input id="login-search"
                       className="form-control"
                       type="text"
                       value={searchLogin}
                       onChange={onChangeSearchLogin}/>
            </div>

            <div className="col-sm-3">
                <label className="form-label" htmlFor="firstname-search">Firstname</label>
                <input
                    id="firstname-search"
                    className="form-control"
                    value={searchFirstname}
                    onChange={onChangeSearchFirstname}
                    type="text"/>
            </div>

            <div className="col-sm-3">
                <label className="form-label" htmlFor="lastname-search">Lastname</label>
                <input id="lastname-search" className="form-control" type="text" onChange={onChangeSearchLastname}/>
            </div>

            <div className="col-sm-3">
                <label className="form-label" htmlFor="department-search">Department</label>

                <select name="department-search" id="department-search" className="form-select" onChange={onChangeSearchDepartment}>
                    <option key="0" value="0"/>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.departmentId}
                        </option>
                    ))}
                </select>
            </div>

            <div style={ {padding: '20px'} }>
                <button
                    className="btn btn-dark"
                    type="button"
                    onClick={findBySearchParams}
                >
                    Search
                </button>
            </div>


            <div className="col-md-12">
                {warningMessage ?
                    (<div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {warningMessage}
                        <button type="button"
                                className="btn-close"
                                onClick={() => setWarningMessage("")}
                                data-bs-dismiss="alert"
                                aria-label="Close"/>
                    </div>) :
                    ""
                }
            </div>

            <div className="col-md-12 list">
                <table
                    className="table table-striped table-bordered"
                    {...getTableProps()}
                >
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                <div className="mt-3">
                    {"Items per Page: "}
                    <select onChange={handlePageSizeChange} value={pageSize}>
                        {pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>

                    <Pagination
                        className="my-3"
                        count={count}
                        page={page}
                        siblingCount={1}
                        boundaryCount={1}
                        variant="outlined"
                        shape="rounded"
                        onChange={handlePageChange}
                    />
                </div>
            </div>

            <div style={{ paddingTop: '30px', textAlign: 'left' }}>
                <a className="btn btn-dark" href="/user">Hire new monkey</a>
            </div>
        </div>
    );
};

export default UsersList;
