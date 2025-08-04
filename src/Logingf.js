import React from "react";

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <h1 className="display-4">Find Your Next Opportunity</h1>
        <p className="lead">Explore thousands of jobs from top companies in your industry.</p>
      </section>

      {/* Search Bar */}
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for jobs..." />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mb-5">
        <h2 className="mb-4 text-center">Featured Jobs</h2>
        <div className="row">
          {[1,2,3].map((idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Job Title {idx}</h5>
                  <h6 className="text-muted">Company Name</h6>
                  <p className="card-text">Brief description of the role, requirements or perks.</p>
                </div>
                <div className="card-footer text-end">
                  <small className="text-muted">Location</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About or Info */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2>Why Choose Us?</h2>
          <p className="mb-2">We connect top talent with leading companies.</p>
          <p>Easy UI, verified listings, and personalized job matches to fit your skills.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-1">&copy; 2025 YourJobPortal. All rights reserved.</p>
        <small>Terms • Privacy • Help Center</small>
      </footer>
    </div>
  );
};

export default LandingPage;
