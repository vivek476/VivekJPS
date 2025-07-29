import { useState } from "react";

function Myappliedjob() {
    const [countries, ] = useState([
        { id: 1, jobtitle: "Frontend Developer", company: "Intellect", location: "Pune", applieddate: "2024-07-01", status: "Pending" },
        { id: 2, jobtitle: "Backend Developer", company: "Tech Solutions", location: "Mumbai", applieddate: "2024-07-02", status: "Accepted" },
        { id: 3, jobtitle: "Full Stack Developer", company: "Innovatech", location: "Bangalore", applieddate: "2024-07-03", status: "Rejected" },
    ]);

    const [newCompany, setNewCompany] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);

    // 🔁 Update searchTerm when "Search" button is clicked in modal
    const handleCompanySearch = () => {
        setSearchTerm(newCompany);  // 👈 Use this for filtering
        setShowAddModal(false);
    };

    const handleDownload = () => {
        const header = "Job Title, Company, Location, Applied Date, Status \n";
        const csvData = countries.map(c =>
            `${c.jobtitle}, ${c.company}, ${c.location}, ${c.applieddate}, ${c.status}`
        ).join("\n");
        const blob = new Blob([header + csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "applied_jobs.csv";
        link.click();
    };

    // 🔍 Filter by company name only
    const filteredCountries = countries.filter(c =>
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCountries = filteredCountries.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(filteredCountries.length / pageSize);

    return (
        <div className="container mt-4">
            <h2 className="text-muted"><i className="bi bi-file-earmark-check me-2 text-success"></i>My Applied Job</h2>
            {/* <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>Search By Company</button> */}

            <div className="row g-2 mb-3 align-items-center">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search company..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <button className="btn btn-success" onClick={handleDownload}>
                        <i className="bi bi-download"></i> Export
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
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCountries.length > 0 ? (
                        paginatedCountries.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.jobtitle}</td>
                                <td>{c.company}</td>
                                <td>{c.location}</td>
                                <td>{c.applieddate}</td>
                                <td>{c.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No Job Found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal */}
            {showAddModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Search by Company</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Company Name"
                                    value={newCompany}
                                    onChange={e => setNewCompany(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCompanySearch}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {showAddModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}

export default Myappliedjob;
