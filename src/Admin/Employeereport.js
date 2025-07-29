import { useState, useEffect } from "react";
import axios from "axios";

function Employeereport() {
    const [ereports, setEReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const baseURL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/Employeejpes`);
            if (response.data?.data) {
                setEReports(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching employee report", err);
        }
    };

    const filteredReports = ereports.filter(emp =>
        `${emp.firstname} ${emp.middlename || ""} ${emp.lastname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(filteredReports.length / pageSize);

    const handleDownload = () => {
        const header = [
            "EmployeeId", "Firstname", "Middlename", "Lastname", "Mobile", "Address", "City",
            "Pincode", "Degree", "Skill", "Passyear", "Experience", "Detail", "ImageUrl"
        ].join(",") + "\n";

        const rows = filteredReports.map(emp =>
            [
                emp.employeeId, emp.firstname, emp.middlename || "", emp.lastname,
                emp.mobile, emp.address, emp.city, emp.pincode,
                emp.degree, emp.skill, emp.passyear, emp.experience,
                emp.detail, emp.imageUrl
            ].join(",")
        ).join("\n");

        const blob = new Blob([header + rows], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "employee_report_full.csv";
        link.click();
    };

    return (
        <div className="container mt-4">
            <h2 className="text-muted">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Employee Report
            </h2>

            <div className="row g-2 mb-3 align-items-center">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="col-md-4">
                    <button className="btn btn-success" onClick={handleDownload}>
                        <i className="bi bi-download me-1"></i>Export
                    </button>
                </div>

                <div className="col-md-4 text-md-end">
                    <label className="form-label me-2 mb-0">Items per page:</label>
                    <select
                        className="form-select d-inline-block w-auto"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Pincode</th>
                            <th>Degree</th>
                            <th>Skill</th>
                            <th>Pass Year</th>
                            <th>Experience</th>
                            <th>Detail</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedReports.length > 0 ? (
                            paginatedReports.map(emp => (
                                <tr key={emp.employeeId}>
                                    <td>{emp.employeeId}</td>
                                    <td>{`${emp.firstname} ${emp.middlename || ""} ${emp.lastname}`.trim()}</td>
                                    <td>{emp.mobile}</td>
                                    <td>{emp.address}</td>
                                    <td>{emp.city}</td>
                                    <td>{emp.pincode}</td>
                                    <td>{emp.degree}</td>
                                    <td>{emp.skill}</td>
                                    <td>{emp.passyear}</td>
                                    <td>{emp.experience}</td>
                                    <td>{emp.detail}</td>
                                    <td>
                                        {emp.imageUrl ? (
                                            <img
                                                src={`${baseURL}/${emp.imageUrl}`}
                                                alt="Profile"
                                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center">No Employee Found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Employeereport;
