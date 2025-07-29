import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";

function Profilematch() {
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Employeejpes`);
        setProfiles(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(
    (p) =>
      p.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredProfiles.length / pageSize);

  const handleExport = () => {
    if (filteredProfiles.length === 0) return;

    const header = "ID,Full Name,Degree,Skill\n";
    const rows = filteredProfiles.map(p => {
      const fullName = `${p.firstname} ${p.middlename || ""} ${p.lastname}`.trim();
      return `${p.employeeId},"${fullName}","${p.degree}","${p.skill}"`;
    });

    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "EmployeeProfiles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="container mt-4">
      {/* Heading, Search, Export */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-4"><i className="bi bi-people-fill me-2 text-primary"></i>Matched Profiles</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, degree, skill"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Degree</th>
            <th>Skill</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProfiles.length > 0 ? (
            paginatedProfiles.map((p) => (
              <tr key={p.id}>
                <td>{p.employeeId}</td>
                <td>{`${p.firstname} ${p.middlename || ""} ${p.lastname}`}</td>
                <td>{p.degree}</td>
                <td>{p.skill}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    title="View"
                    onClick={() => {
                      setSelectedEmployee(p);
                      setShowModal(true);
                    }}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No Profile Found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
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

      {/* Modal for View */}
      {showModal && selectedEmployee && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content shadow-lg rounded-4 border-0">

                {/* Header */}
                <div
                  className="modal-header text-white rounded-top-4"
                  style={{
                    backgroundImage: "linear-gradient(to right, #0b97ce, #c2fafa)",
                  }}
                >
                  <h5 className="modal-title fw-semibold">
                    <i className="bi bi-person-circle me-2"></i>Employee Profile Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* Body */}
                <div
                  className="modal-body py-4 px-5"
                  style={{
                    backgroundImage: "linear-gradient(to bottom right, #c3eaf9, #94bfc0)",
                  }}
                >
                  <div className="row g-4 align-items-center">
                    {/* Profile Image */}
                    <div className="col-md-4 text-center">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${selectedEmployee.imageUrl}`}
                        alt="Profile"
                        className="img-fluid rounded-circle shadow border border-3 border-primary"
                        style={{ width: "180px", height: "180px", objectFit: "cover" }}
                      />
                    </div>

                    {/* Profile Details */}
                    <div className="col-md-8">
                      <div className="row gy-2">
                        <div className="col-sm-6">
                          <strong>Full Name:</strong><br />
                          {`${selectedEmployee.firstname} ${selectedEmployee.middlename || ""} ${selectedEmployee.lastname}`}
                        </div>
                        <div className="col-sm-6">
                          <strong>Mobile:</strong><br />
                          {selectedEmployee.mobile}
                        </div>
                        <div className="col-sm-12">
                          <strong>Address:</strong><br />
                          {selectedEmployee.address}, {selectedEmployee.city} - {selectedEmployee.pincode}
                        </div>
                        <div className="col-sm-6">
                          <strong>Degree:</strong><br />
                          {selectedEmployee.degree}
                        </div>
                        <div className="col-sm-6">
                          <strong>Skill:</strong><br />
                          {selectedEmployee.skill}
                        </div>
                        <div className="col-sm-6">
                          <strong>Passout Year:</strong><br />
                          {selectedEmployee.passyear}
                        </div>
                        <div className="col-sm-6">
                          <strong>Experience:</strong><br />
                          {selectedEmployee.experience}
                        </div>
                        <div className="col-sm-12">
                          <strong>Detail:</strong><br />
                          {selectedEmployee.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer bg-light rounded-bottom-4">
                  <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    <i className="bi bi-x-circle me-1"></i> Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}

export default Profilematch;
