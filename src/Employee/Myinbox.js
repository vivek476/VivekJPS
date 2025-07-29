import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Myinbox() {
  const [companyOptions, setCompanyOptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");


  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  // Fetch company list from backend
  useEffect(() => {
    axios.get(`${API_BASE}/api/Companyjpcs`)
      .then(res => setCompanyOptions(res.data.data))
      .catch(err => console.error("Error fetching companies", err));
  }, []);

  // Optionally fetch existing messages from DB here (currently using local messages)
  // useEffect(() => {
  //   setMessages([
  //     { id: 1, company: "TCS", message: "This Is First Company Message." },
  //     { id: 2, company: "Infosys", message: "This Is Second Company Message" },
  //     { id: 3, company: "HCL", message: "This Is Third Company Message" },
  //     { id: 4, company: "Wipro", message: "This Is Fourth Company Message" },
  //     { id: 5, company: "Google", message: "This Is Fifth Company Message" },
  //     { id: 6, company: "Meta", message: "This Is Sixth Company Message" }
  //   ]);
  // }, []);

  const handleSendMessage = () => {
    if (selectedCompany && messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        company: selectedCompany,
        message: messageText
      };
      setMessages([newMessage, ...messages]);
      setSelectedCompany("");
      setMessageText("");
      setShowSendModal(false);

      // ✅ SweetAlert success popup
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Your message was sent successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      // Optional: Show warning if fields are empty
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete',
        text: 'Please select a company and enter a message.',
      });
    }
  };


  const handleDownload = () => {
    const header = "Company,Message\n";
    const csv = messages.map(c => `${c.company},${c.message}`).join("\n");
    const blob = new Blob([header + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inbox_messages.csv";
    link.click();
  };

  const filteredMessages = messages.filter(c =>
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredMessages.length / pageSize);

  return (
    <div className="container mt-4">
      <h2 className="text-muted">
        <i className="bi bi-envelope-fill me-2 text-success"></i>My Inbox
      </h2>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setShowSendModal(true)}>
          <i className="bi bi-send"></i> Send Message
        </button>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-3">
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
        <div className="col-md-3">
          <button className="btn btn-success" onClick={handleDownload}>
            <i className="bi bi-download"></i> Export
          </button>
        </div>
        <div className="col-md-3 text-md-end">
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

      {/* Message Cards View */}
      <div className="row">
        {paginatedMessages.length > 0 ? (
          paginatedMessages.map(c => (
            <div key={c.id} className="col-md-6 mb-3">
              <div className="card shadow-sm border-start border-4 border-primary">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">
                      <span className="badge bg-primary">{c.company}</span>
                    </h5>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setEditingMessage(c);
                          setEditText(c.message);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          Swal.fire({
                            title: 'Are you sure?',
                            text: 'This message will be permanently deleted!',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#6c757d',
                            confirmButtonText: 'Yes, delete it!',
                            cancelButtonText: 'Cancel'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setMessages(prev => prev.filter(m => m.id !== c.id));
                              Swal.fire('Deleted!', 'Message has been deleted.', 'success');
                            }
                          });
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p className="card-text mt-2">{c.message}</p>
                  <small className="text-muted">Message ID: #{c.id}</small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted text-center">No Message Found</div>
        )}
      </div>



      {/* Pagination */}
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

      {/* Send Message Modal */}
      {showSendModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Send New Message</h5>
                  <button className="btn-close" onClick={() => setShowSendModal(false)}></button>
                </div>
                <div className="modal-body">
                  <label>Select Company:</label>
                  <select
                    className="form-select mb-3"
                    value={selectedCompany}
                    onChange={e => setSelectedCompany(e.target.value)}
                  >
                    <option value="">-- Select Company --</option>
                    {companyOptions.map((c, i) => (
                      <option key={i} value={c.companyName}>{c.companyName}</option>
                    ))}
                  </select>

                  <label>Type Message:</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Enter your message..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowSendModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {editingMessage && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Message</h5>
                  <button className="btn-close" onClick={() => setEditingMessage(null)}></button>
                </div>
                <div className="modal-body">
                  <label>Update Message:</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditingMessage(null)}>Cancel</button>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setMessages(prev =>
                        prev.map(msg =>
                          msg.id === editingMessage.id
                            ? { ...msg, message: editText }
                            : msg
                        )
                      );
                      setEditingMessage(null);
                    }}
                  >
                    Save Changes
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

export default Myinbox;
