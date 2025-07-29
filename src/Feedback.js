import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    rating: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/Feedbacks`, formData); // 👈 correct API URL
      alert("Feedback sent successfully!");
      setFormData({ name: "", email: "", comment: "", rating: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">
          <i className="bi bi-chat-dots-fill me-2 text-success"></i>Feedback Form
        </h2>
        <p className="text-muted">
          We value your feedback — help us improve your experience.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0">
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Comment</label>
                  <textarea
                    className="form-control"
                    name="comment"
                    rows="3"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Write your comment here..."
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Rating (1-5)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Enter rating"
                    min="1"
                    max="5"
                    required
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="bi bi-send-fill me-2"></i>Send Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-4">
            <i className="bi bi-stars text-warning fs-1"></i>
            <h5 className="mt-2">Thank you for helping us grow!</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
