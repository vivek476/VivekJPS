import { useEffect, useState } from "react";
import axios from "axios";

function Jobmatches() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);

    // Fetch posted jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/PostJobs`);
                setCountries(res.data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleDownload = () => {
        const header = "Job Title, Degree, Skill, Experience, Salary, Vacancy, Detail\n";
        const csvData = countries.map(c =>
            `${c.jobtitle},${c.degree},${c.skill},${c.experience},${c.salary},${c.vacancy},${c.detail}`
        ).join("\n");
        const blob = new Blob([header + csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "jobs.csv";
        link.click();
    };

    const filteredCountries = countries.filter(c =>
        `${c.jobtitle}${c.degree}.toLowerCase().includes(searchTerm.toLowerCase())`
    );

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCountries = filteredCountries.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(filteredCountries.length / pageSize);

    return (
        <div className="container mt-4">
            <h2 className="text-muted">
                <i className="bi bi-briefcase me-2 text-success"></i>Job Matches
            </h2>

            <div className="row g-2 mb-3 align-items-center">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
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

            {loading ? (
                <div className="text-center text-muted">Loading job postings...</div>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Job Title</th>
                            <th>Degree</th>
                            <th>Skill</th>
                            <th>Experience</th>
                            <th>Salary</th>
                            <th>Vacancy</th>
                            <th>Detail</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCountries.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.jobtitle}</td>
                                <td>{c.degree}</td>
                                <td>{c.skill}</td>
                                <td>{c.experience}</td>
                                <td>{c.salary}</td>
                                <td>{c.vacancy}</td>
                                <td>{c.detail}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary px-3 py-1"
                                        onClick={() => alert("Applied Successfully")}
                                    >
                                        <i className="bi bi-send-fill me-1"></i>Apply
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paginatedCountries.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">No matched jobs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Jobmatches;