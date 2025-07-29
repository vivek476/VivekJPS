import { useEffect, useState } from "react";
import axios from "axios";

function Feedbackreport() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5269";

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/Feedbacks`);
      setFeedbacks(response.data.data); 
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };


  const filteredFeedbacks = (feedbacks || []).filter(fb =>
    fb.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);

  const handleDownload = () => {
    const header = "ID,Name,Email,Comment,Rating\n";
    const rows = filteredFeedbacks.map(fb =>
      `${fb.id},${fb.name},${fb.email},${fb.comment},${fb.rating}`
    ).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feedback_report.csv";
    link.click();
  };

  const renderStars = (rating) => {
    const total = 5;
    return (
      <>
        {[...Array(total)].map((_, i) => (
          <span key={i} style={{ color: i < rating ? "#ffc107" : "#e4e5e9", fontSize: "1.2rem" }}>
            ★
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-muted">
        <i className="bi bi-chat-dots-fill me-2 text-warning"></i>
        Feedback Report
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
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Comment</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFeedbacks.length > 0 ? (
            paginatedFeedbacks.map(fb => (
              <tr key={fb.id}>
                <td>{fb.id}</td>
                <td>{fb.name}</td>
                <td>{fb.email}</td>
                <td>{fb.comment}</td>
                <td>{renderStars(fb.rating)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No feedback found.</td>
            </tr>
          )}
        </tbody>
      </table>

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

export default Feedbackreport;
