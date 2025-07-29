import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Myprofile = () => {
    const [employee, setEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        firstname: "", middlename: "", lastname: "",
        address: "", city: "", pincode: "", mobile: "",
        detail: "", degree: "", skill: "", passyear: "", experience: "",
        imageUrl: ""
    });

    const employeeId = localStorage.getItem("employeeId");
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/Employeejpes/${employeeId}`);
            setEmployee(res.data);
            setFormData(res.data);
            setIsEdit(true);
            if (res.data?.imageUrl) {
                setPreviewImage(`${baseURL}/${res.data.imageUrl}`);
            }
        } catch (err) {
            console.log("No profile found.");
        }
    };

    const handleDownload = () => {
        if (!employee) return;

        const headers = [
            "Firstname", "Middlename", "Lastname", "Address", "City", "Pincode",
            "Mobile", "Detail", "Degree", "Skill", "Passyear", "Experience", "ImageUrl"
        ];

        const csvRows = [headers.join(",")];

        const values = headers.map((header) => {
            const key = header.toLowerCase();
            return `"${employee[key] || ""}"`; // wrap in quotes to handle commas
        });

        csvRows.push(values.join(","));

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "MyProfile.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Inside handleSave function:
    const handleSave = async (e) => {
        e.preventDefault();
        const form = new FormData();
        if (formData.id) form.append("id", formData.id);
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(key, value);
            }
        });
        form.append("employeeId", employeeId);
        if (selectedImage) form.append("imageFile", selectedImage);

        try {
            if (isEdit) {
                await axios.put(`${baseURL}/api/Employeejpes/${employeeId}`, form);
            } else {
                await axios.post(`${baseURL}/api/Employeejpes`, form);
            }
            setShowModal(false);
            fetchProfile(); // Refresh UI after add/update
            e.preventDefault();
        } catch (err) {
            console.error("Save failed", err);
        }
    };



    const degreeOptions = ["BCA", "BSC", "B.Tech", "M.Tech", "MCA", "MBA"];
    const skillOptions = ["JavaScript", "React.js", "Node.js", "C#", ".NET Core"];
    const passYearOptions = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    const experienceOptions = ["Fresher", "1 year", "2 years", "3+ years"];

    return (
        <>
        <div className="d-flex justify-content-end mb-3"><button className="btn btn-success" onClick={handleDownload} type="button"><i className="bi bi-download me-1"></i> Export</button></div>
        
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg" style={{ background: "linear-gradient(to right, #8fcdd5ff, rgba(124, 240, 239, 1))" }}>
            <h2 className="text-2xl font-bold text-center mb-6"><i className="bi bi-person-badge-fill me-2 text-primary"></i>My Profile</h2>
            <div className="card shadow p-4" style={{ background: "linear-gradient(to right, #f8fafc, rgba(224, 242, 254, 1))" }}>
                <div className="row">
                    <div className="col-md-4 text-center">
                        <div className="rounded-circle overflow-hidden mx-auto border" style={{ width: "160px", height: "160px" }}>
                            <img
                                src={previewImage || "https://ui-avatars.com/api/?name=Profile&background=0D8ABC&color=fff&rounded=true&size=150"}
                                alt="Profile"
                                className="img-fluid"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <input
                            type="file"
                            className="form-control mt-3"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>

                    <div className="col-md-8">
                        <div className="row">
                            {["Firstname", "Middlename", "Lastname", "Mobile", "Address", "City", "Pincode", "Degree", "Skill", "Passyear", "Experience", "Detail"].map((label, idx) => (
                                <div className="col-sm-6 mb-2" key={idx}>
                                    <strong>{label}:</strong> {formData[label.toLowerCase()] || <span className="text-muted">--</span>}
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>
                            {isEdit ? "Update" : "Add"} Details
                        </button>
                    </div>
                </div>
            </div>
            

            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <form onSubmit={handleSave} className="p-3">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{isEdit ? "Update" : "Add"} Profile</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row g-3">
                                            {["firstname", "middlename", "lastname", "mobile", "address", "city", "pincode"].map((key) => (
                                                <div className="col-md-6" key={key}>
                                                    <label className="form-label text-capitalize">{key}</label>
                                                    <input
                                                        type="text"
                                                        name={key}
                                                        className="form-control"
                                                        value={formData[key] || ""}
                                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                    />
                                                </div>
                                            ))}

                                            {[{ key: "degree", options: degreeOptions }, { key: "skill", options: skillOptions }, { key: "passyear", options: passYearOptions }, { key: "experience", options: experienceOptions }].map(({ key, options }) => (
                                                <div className="col-md-6" key={key}>
                                                    <label className="form-label text-capitalize">{key}</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData[key] || ""}
                                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                    >
                                                        <option value="">Select {key}</option>
                                                        {options.map((option, i) => (
                                                            <option key={i} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}

                                            <div className="col-12">
                                                <label className="form-label">Detail</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={formData.detail}
                                                    onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">
                                            {isEdit ? "Update" : "Add"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
        </>
    );
};

export default Myprofile;
