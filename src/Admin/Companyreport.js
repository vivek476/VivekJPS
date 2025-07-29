import { useEffect, useState } from "react";
import axios from "axios";

function Companyreport() {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Companyjpcs`);
                const result = response.data;

                if (result && Array.isArray(result.data)) {
                    setCompanies(result.data);
                } else {
                    setCompanies([]);
                    console.warn("API returned invalid or empty data format.");
                }
            } catch (error) {
                console.error("❌ Error fetching company data:", error);
            }
        };

        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(cmp =>
        cmp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(filteredCompanies.length / pageSize);

    const handleDownload = () => {
        const header = "Company ID,CompanyName,Address,City,Pincode,Mobile,Email,ContactPerson,Detail\n";
        const rows = filteredCompanies.map(cmp =>
            `${cmp.id},${cmp.companyName},${cmp.address},${cmp.city},${cmp.pincode},${cmp.mobile},${cmp.email},${cmp.contactPerson},${cmp.detail}`
        ).join("\n");

        const blob = new Blob([header + rows], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "company_report.csv";
        link.click();
    };

    return (
        <div className="container mt-4">
            <h2 className="text-muted">
                <i className="bi bi-buildings me-2 text-info"></i>
                Company Report
            </h2>

            <div className="row g-2 mb-3 align-items-center">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by email..."
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
                        <option value={1}>1</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Company Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Pincode</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Contact Person</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCompanies.length > 0 ? (
                        paginatedCompanies.map((cmp) => (
                            <tr key={cmp.id}>
                                <td>{cmp.id}</td>
                                <td>{cmp.companyName}</td>
                                <td>{cmp.address}</td>
                                <td>{cmp.city}</td>
                                <td>{cmp.pincode}</td>
                                <td>{cmp.mobile}</td>
                                <td>{cmp.email}</td>
                                <td>{cmp.contactPerson}</td>
                                <td>{cmp.detail}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">No Company Found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

export default Companyreport;
