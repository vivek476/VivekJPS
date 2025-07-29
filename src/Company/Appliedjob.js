import { useState } from "react";

function Appliedjob() {
  const [applications, ] = useState([
    {
      id: 1,
      employee: "Piyush Sharma",
      email: "piyush@123.com",
      jobTitle: "Software Engineer",
      position: "Frontend Developer",
      appliedDate: "2024-07-01"
    },
    {
      id: 2,
      employee: "Rizwan Ahmad",
      email: "rizzu@123.com",
      jobTitle: "Backend Developer",
      position: "Backend Developer",
      appliedDate: "2024-07-02"
    },
    {
      id: 3,
      employee: "Vivek Solanki",
      email: "vivek@123.com",
      jobTitle: "Full Stack Developer",
      position: "Full Stack Developer",
      appliedDate: "2024-07-03"
    },
    {
      id: 4,
      employee: "Avijit Gorai",
      email: "avijit@123.com",
      jobTitle: "Frontend UI Developer",
      position: "Frontend Developer",
      appliedDate: "2024-07-04"
    },
    {
      id: 5,
      employee: "Kiran Roy",
      email: "kiran@123.com",
      jobTitle: "Node.js Developer",
      position: "Backend Developer",
      appliedDate: "2024-07-05"
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchPosition, setModalSearchPosition] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const filteredApplications = applications.filter(app =>
    app.position.toLowerCase().includes(modalSearchPosition.toLowerCase()) &&
    (
      app.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredApplications.length / pageSize);

  const handlePositionSearch = () => {
    setShowAddModal(false);
    setCurrentPage(1);
  };

  const handleDownload = () => {
    const header = "Employee,Email,Job Title,Position,Applied Date\n";
    const csv = applications.map(app =>
      `${app.employee},${app.email},${app.jobTitle},${app.position},${app.appliedDate}`
    ).join("\n");
    const blob = new Blob([header + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "applied_jobs.csv";
    link.click();
  };

  return (
    <div className="container mt-4">
      <h2 className="text-muted"><i className="bi bi-check2-square me-2 text-success"></i>Applied Jobs</h2>
      {/* <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>
        Search By Position
      </button> */}

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, job title or position..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-success" onClick={handleDownload} title="Download CSV">
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
            <th>Employee Name</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Applied Position</th>
            <th>Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedApplications.length > 0 ? (
            paginatedApplications.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.employee}</td>
                <td>{app.email}</td>
                <td>{app.jobTitle}</td>
                <td>{app.position}</td>
                <td>{app.appliedDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No Applicant Found.</td>
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

      {/* Modal: Search by Position */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Search By Position</h5>
                 <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button> 
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Position"
                  value={modalSearchPosition}
                  onChange={e => setModalSearchPosition(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handlePositionSearch}>Search</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showAddModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Appliedjob;
