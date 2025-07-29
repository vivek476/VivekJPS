import React from 'react'

function Searchjobcategory() {
  return (
    <div className="card bg-light mb-3">
      <div className="card-header text-center fw-bold" style={{ backgroundColor: "#b8daff" }}>
        Find Job by Category
      </div>
      <div className="card-body py-2">
        <ul className="list-unstyled mb-0">
          <li className="mb-2">
            <a href="#!" className="text-decoration-none">ASP.Net</a> <span>(3)</span>
          </li>
          <li>
            <a href="#!" className="text-decoration-none">PHP</a> <span>(1)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Searchjobcategory