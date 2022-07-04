import React, {useState, useMemo, useEffect, useRef} from "react";
import DepartmentService from "../services/departmentService";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";

const DepartmentList = (props) => {

    const [departments, setDepartments] = useState([])
    const [searchDepartmentCode, setSearchDepartmentCode] = useState("");
    const [searchDepartmentDesc, setSearchDepartmentDesc] = useState("");

    const [warningMessage, setWarningMessage] = useState("");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const pageSizes = [5, 10, 20];

    const departmentsRef = useRef();
    departmentsRef.current = departments;

    const departmentService = new DepartmentService(props.baseUrl);

    const getRequestParams = (departmentCode, departmentDesc, page, pageSize) => {
        let params = {};

        if (departmentCode) {
            params["departmentCode"] = departmentCode;
        }

        if (departmentDesc) {
            params["departmentDesc"] = departmentDesc;
        }

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["pageSize"] = pageSize;
        }

        return params;
    }

    const retrieveDepartments = () => {

        const params = getRequestParams(searchDepartmentCode, searchDepartmentDesc, page, pageSize);

        departmentService.getDepartmentsByParams(params).then((response) => {
            const { departments, totalPages } = response.data;
            setDepartments(departments);
            setCount(totalPages);
        })
            .catch((e) => {
                console.log(e);
            });
    }

    useEffect(retrieveDepartments, [page, pageSize]);

    const findBySearchParams = () => {
        setPage(1);
        retrieveDepartments();
    };

    const onChangeSearchDepartmentCode = (e) => {
        const deptCode = e.target.value;
        setSearchDepartmentCode(deptCode);
    };

    const onChangeSearchDepartmentDesc = (e) => {
        const deptDesc = e.target.value;
        setSearchDepartmentDesc(deptDesc);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const deleteDepartment = (rowIndex) => {
        const userId = departmentsRef.current[rowIndex].id;

        departmentService.remove(userId)
            .then((response) => {

                let newDepartments = [...departmentsRef.current];
                newDepartments.splice(rowIndex, 1);

                setDepartments(newDepartments);
            })
            .catch((e) => {
                if(e?.response?.data?.errorMessage) {
                    setWarningMessage(e.response.data.errorMessage);
                }
            });
    };

    const columns = useMemo(
        () => [
            {
                Header: "Department Code",
                accessor: "departmentId",
            },
            {
                Header: "Description",
                accessor: "description",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <a href={"/department-edit/" + props.row.original.id}>Edit</a>
                            &nbsp;
                            <a href={"#"} onClick={() => deleteDepartment(rowIdx)}>Delete</a>
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
        data: departments,
    });


    return (
        <div className="list row">
            <div className="col-sm-4">
                <label className="form-label" htmlFor="department-code-search">Department Code</label>
                <input id="department-code-search"
                       className="form-control"
                       type="text"
                       value={searchDepartmentCode}
                       onChange={onChangeSearchDepartmentCode}/>
            </div>

            <div className="col-sm-4">
                <label className="form-label" htmlFor="department-desc-search">Description</label>
                <input
                    id="department-desc-search"
                    className="form-control"
                    value={searchDepartmentDesc}
                    onChange={onChangeSearchDepartmentDesc}
                    type="text"/>
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
                <a className="btn btn-dark" href="/department-create">Establish new department</a>
            </div>
        </div>
    )
}

export default DepartmentList;
