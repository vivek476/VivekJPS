import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Customer() {
  const [list, setList] = useState([]);

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [addUpdateModal, setAddUpdateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const apiUrl = "http://localhost:5269/api/Customers";

  const clearForm = () => {
    setId(0);
    setName("");
    setAddress("");
    setMobile("");
    setEmail("");
    setPassword("");
  };

  const handleAddUpdate = async () => {
    const customer = { id, name, address, mobile, email, password };
    try {
      if (id === 0) {
        await axios.post(apiUrl, customer);
        Swal.fire("Success", "Customer added successfully!", "success");
      } else {
        await axios.put(apiUrl, customer);
        Swal.fire("Success", "Customer updated successfully!", "success");
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
      Swal.fire("Deleted!", "Customer deleted successfully!", "success");
      fetchData(); // refresh data
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete!", "error");
    }
  };

  const handleEdit = (obj) => {
    setId(obj.id);
    setName(obj.name);
    setAddress(obj.address);
    setMobile(obj.mobile);
    setEmail(obj.email);
    setPassword(obj.password);
    setAddUpdateModal(true);
  };

  const handleView = (obj) => {
    setId(obj.id);
    setName(obj.name);
    setAddress(obj.address);
    setMobile(obj.mobile);
    setEmail(obj.email);
    setPassword(obj.password);
    setViewModal(true);
  };

  const handleDownload = () => {
    const csvContent =
      "Id,Name,Address,Mobile,Email,Password\n" +
      list.map(c => `${c.id},${c.name},${c.address},${c.mobile},${c.email},${c.password}`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customers.csv";
    link.click();
  };

  const fetchData = () => {
    axios.get(apiUrl).then(res => setList(res.data.data)).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredList = list.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = filteredList.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredList.length / pageSize);

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-2 gap-2">
        <h4><i className="bi bi-people-fill me-2 text-primary fs-2"></i> Customer Management</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => { clearForm(); setAddUpdateModal(true); }}>
            <i className="bi bi-plus-lg"></i> Add Customer
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
            <th>Id</th><th>Name</th><th>Address</th><th>Mobile</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedList.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.address}</td>
              <td>{c.mobile}</td>
              <td>{c.email}</td>
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
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">{id === 0 ? "Add" : "Update"} Customer</h5>
                  <button type="button" className="btn-close" onClick={() => setAddUpdateModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input type="text" className="form-control mb-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="text" className="form-control mb-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <input type="text" className="form-control mb-2" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                  <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setAddUpdateModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddUpdate}>Save</button>
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
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">Customer Details</h5>
                  <button type="button" className="btn-close" onClick={() => setViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Id:</strong> {id}</p>
                  <p><strong>Name:</strong> {name}</p>
                  <p><strong>Address:</strong> {address}</p>
                  <p><strong>Mobile:</strong> {mobile}</p>
                  <p><strong>Email:</strong> {email}</p>
                  <p><strong>Password:</strong> {password}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewModal(false)}>Close</button>
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

export default Customer;