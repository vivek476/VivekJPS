import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Postnewjob() {
  const [list, setList] = useState([]);

  const [id, setId] = useState(0);
  const [jobtitle, setJobtitle] = useState("");
  const [degree, setDegree] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [detail, setDetail] = useState("");

  const [addUpdateModal, setAddUpdateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const apiUrl = "http://localhost:5269/api/Postjobs";

  const clearForm = () => {
    setId(0);
    setJobtitle("");
    setDegree("");
    setSkill("");
    setExperience("");
    setSalary("");
    setVacancy("");
    setDetail("");
  };

  const handleAddUpdate = async () => {
    const customer = { id, jobtitle, degree, skill, experience, salary, vacancy, detail };
    try {
      if (id === 0) {
        await axios.post(apiUrl, customer);
        Swal.fire("Success", "Job posted successfully!", "success");
      } else {
        await axios.put(apiUrl, customer);
        Swal.fire("Success", "Job updated successfully!", "success");
      }
      setAddUpdateModal(false);
      clearForm();
      fetchData(); // refresh data
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      Swal.fire("Deleted!", "Job deleted successfully!", "success");
      fetchData(); // refresh data
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete!", "error");
    }
  };

  const handleEdit = (obj) => {
    setId(obj.id);
    setJobtitle(obj.jobtitle);
    setDegree(obj.degree);
    setSkill(obj.skill);
    setExperience(obj.experience);
    setSalary(obj.salary);
    setVacancy(obj.vacancy);
    setDetail(obj.detail);
    setAddUpdateModal(true);
  };

  const handleView = (obj) => {
    setId(obj.id);
    setJobtitle(obj.jobtitle);
    setDegree(obj.degree);
    setSkill(obj.skill);
    setExperience(obj.experience);
    setSalary(obj.salary);
    setVacancy(obj.vacancy);
    setDetail(obj.detail);
    setViewModal(true);
  };

  const handleDownload = () => {
    const csvContent =
      "Id,Name,Address,Mobile,Email,Password\n" +
      list.map(c => `${c.id},${c.jobtitle},${c.degree},${c.skill},${c.experience},${c.salary},${c.vacancy},${c.detail}`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Postjobs.csv";
    link.click();
  };

  const fetchData = () => {
    axios.get(apiUrl).then(res => setList(res.data)).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredList = list.filter(c =>
    c.jobtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = filteredList.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredList.length / pageSize);

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-2 gap-2">
        <h4><i className="bi bi-people-fill me-2 text-primary fs-2"></i> Manage Jobs</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => { clearForm(); setAddUpdateModal(true); }}>
            <i className="bi bi-plus-lg"></i> Post New Job
          </button>
          <button className="btn btn-success" onClick={handleDownload}>📥 Export CSV</button>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-3 gap-2">
        <input type="text" className="form-control" placeholder="🔍 Search by name..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ maxWidth: "250px" }} />
        <div>
          <label className="me-2">Items per page:</label>
          <select className="form-select d-inline-block w-auto" value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value)); setCurrentPage(1); }}>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Id</th><th>Job Title</th><th>Degree</th><th>Skill</th><th>Experience</th><th>Salary</th><th>Vacancy</th><th>Detail</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedList.map(c => (
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
                <button className="border-0 bg-transparent me-2" title="Edit" onClick={() => handleEdit(c)}><i className="bi bi-pencil-fill text-primary fs-5"></i></button>
                <button className="border-0 bg-transparent me-2" title="Delete" onClick={() => handleDelete(c.id)}><i className="bi bi-trash-fill text-danger fs-5"></i></button>
                <button className="border-0 bg-transparent" title="View" onClick={() => handleView(c)}><i className="bi bi-eye-fill text-success fs-5"></i></button>
              </td>
            </tr>
          ))}
          {paginatedList.length === 0 && (
            <tr><td colSpan="6" className="text-center">No data found.</td></tr>
          )}
        </tbody>
      </table>

      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add/Edit Modal */}
      {addUpdateModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-4">
                {/* Header */}
                <div
                  className="modal-header text-white rounded-top-4"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(11,151,206,1) 0%, rgba(2,117,216,1) 100%)",
                  }}
                >
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square me-2"></i>
                    {id === 0 ? "Post New Job" : "Update Job Details"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setAddUpdateModal(false)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body px-5 py-4 bg-light">
                  <div className="row g-3">
                    {/* Job Title */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Job Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter job title"
                        value={jobtitle}
                        onChange={(e) => setJobtitle(e.target.value)}
                      />
                    </div>

                    {/* Degree */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Degree</label>
                      <select
                        className="form-select"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                      >
                        <option value="">Select Degree</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="BCA">BCA</option>
                        <option value="BSC">BSC</option>
                        <option value="MCA">MCA</option>
                        <option value="M.Tech">M.Tech</option>
                      </select>
                    </div>

                    {/* Skill */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Skill</label>
                      <select
                        className="form-select"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                      >
                        <option value="">Select Skill</option>
                        <option value="React.js">React.js</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Node.js">Node.js</option>
                        <option value=".NET Core">.NET Core</option>
                        <option value="AWS">AWS</option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Experience</label>
                      <select
                        className="form-select"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      >
                        <option value="">Select Experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="0-1 Year">0-1 Year</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3+ Years">3+ Years</option>
                      </select>
                    </div>

                    {/* Salary */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Salary</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                      />
                    </div>

                    {/* Vacancy */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Vacancy</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter no. of vacancies"
                        value={vacancy}
                        onChange={(e) => setVacancy(e.target.value)}
                      />
                    </div>

                    {/* Detail */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Job Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Enter job details"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer bg-light rounded-bottom-4">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setAddUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddUpdate}>
                    {id === 0 ? "Post Job" : "Update Job"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}


      {/* View Modal */}
      {viewModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content shadow rounded-4 border-0">
                {/* Modal Header */}
                <div
                  className="modal-header text-white rounded-top-4"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(11,151,206,1) 0%, rgba(2,117,216,1) 100%)",
                  }}
                >
                  <h5 className="modal-title fw-semibold">
                    <i className="bi bi-briefcase-fill me-2"></i>Posted Job Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setViewModal(false)}
                  ></button>
                </div>

                {/* Modal Body */}
                <div
                  className="modal-body px-5 py-4"
                  style={{ backgroundColor: "#f5fafd" }}
                >
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <p className="mb-1 text-secondary fw-semibold">Job ID</p>
                      <div className="fw-bold">{id}</div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-secondary fw-semibold">Job Title</p>
                      <div className="fw-bold">{jobtitle}</div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-secondary fw-semibold">Degree</p>
                      <div className="fw-bold">{degree}</div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-secondary fw-semibold">Skill</p>
                      <div className="fw-bold">{skill}</div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-secondary fw-semibold">Experience</p>
                      <div className="fw-bold">{experience}</div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-secondary fw-semibold">Salary</p>
                      <div className="fw-bold">{salary}</div>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-secondary fw-semibold">Vacancy</p>
                      <div className="fw-bold">{vacancy}</div>
                    </div>
                    <div className="col-12">
                      <p className="mb-1 text-secondary fw-semibold">Job Description</p>
                      <div className="fw-bold">{detail}</div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-light rounded-bottom-4">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </div>
  );
}

export default Postnewjob;