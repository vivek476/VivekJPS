import { useState } from "react";

function Sample1() {
  const [countries, setCountries] = useState([
    { id: 1, name: "India" },
    { id: 2, name: "USA" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const handleAddCountry = () => {
    if (newCountry.trim() !== "") {
      const newId = countries.length + 1;
      setCountries([...countries, { id: newId, name: newCountry }]);
      setNewCountry("");
      setShowAddModal(false);
    }
  };

  const handleDownload = () => {
    const csv = countries.map(c => c.name).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "countries.csv";
    link.click();
  };

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCountries = filteredCountries.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(filteredCountries.length / pageSize);

  return (
    <div className="container mt-4">
      <h2 className="text-muted"><i className="bi bi-map me-2 text-success"></i>Country Management</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>Add Country</button>
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value);
              setCurrentPage(1); }}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-success" onClick={handleDownload} title="Download CSV"><i className="bi bi-download"></i> Export</button>
        </div>
        <div className="col-md-4 text-md-end">
          <label className="form-label me-2 mb-0">Items per page:</label>
          <select className="form-select d-inline-block w-auto" value={pageSize} onChange={e => {
              setPageSize(parseInt(e.target.value)); setCurrentPage(1); }}>
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
            <th>Country Name</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCountries.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
            </tr>
          ))}
          {paginatedCountries.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center">No countries found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <li key={page} className={`page-item ${ currentPage === page ? "active" : "" }`}>
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
                <h5 className="modal-title">Add Country</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control" placeholder="Country Name" value={newCountry} onChange={e => setNewCountry(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddCountry}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showAddModal && (
        <div className="modal-backdrop fade show" onClick={() => setShowAddModal(false)}></div>
      )}
    </div>
  );
}

export default Sample1;
