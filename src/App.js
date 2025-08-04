import { BrowserRouter, Route, Routes, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Dashboard from './Dashboard';
import Footer from './Footer';
import EmployeeMyprofile from './Employee/Myprofile';
import EmployeeJobmatches from './Employee/Jobmatches';
import EmployeeMyappliedjob from './Employee/Myappliedjob';
import EmployeeMyinbox from './Employee/Myinbox';
import EmployeeChangepassword from './Employee/Changepassword';
import CompanyPostnewjob from './Company/Postnewjob';
import Companyaccount from './Company/Companyaccount';
import CompanyProfilematch from './Company/Profilematch';
import CompanyAppliedjob from './Company/Appliedjob';
import AdminEmployeereport from './Admin/Employeereport';
import AdminCompanyreport from './Admin/Companyreport';
import AdminFeedbackreport from './Admin/Feedbackreport';
import Searchjobcategory from './Job Category/Searchjobcategory';
import Home from './Home';
import Feedback from './Feedback';
import Contactus from './Contactus';
import Roles from './Superadmin/Roles';
import Users from './Superadmin/Users';
import Userroles from './Superadmin/Userroles';
import Customer from './Superadmin/Customer';
import { useEffect, useState } from 'react';
import FacebookCallback from './FacebookCallback';
import GoogleCallback from './GoogleCallback';
import Logingf from './Logingf';

function Sidebar() {
  const location = useLocation();
  const [role, setRole] = useState("");

  useEffect(() => {
    // Re-read role from localStorage on location change
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, [location]); // triggers whenever URL changes


  return (
    <div className="navbar navbar-expand-lg bg-dark custom-navbar d-flex flex-column align-items-start" style={{ width: "250px", height: "100vh" }}>

      <div className="p-3">
        {!localStorage.getItem("token") && (
          <>
            <h4 className="mb-4 text-light"><i className="bi bi-grid-fill me-2 text-light"></i>Navigation</h4>
            <hr className="border-secondary my-3" />
            <br />
            <Searchjobcategory />
          </>
        )}


        {role === "Employee" && (
          <>
            <hr className="border-secondary my-3" />
            <ul className="nav nav-pills flex-column gap-2">
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === "/dashboard" ? "active" : "text-light"}`}>
                  <div className="d-flex align-items-center"><i className="bi bi-speedometer2 me-2 text-primary fs-3"></i><span className="me-2">Dashboard</span></div>
                  <span className="badge bg-primary ms-auto"> New</span></Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/myprofile" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/myprofile" ? "active" : "text-light"}`}>
                  <i className="bi bi-emoji-smile me-2 text-warning"></i> My Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/jobmatches" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/jobmatches" ? "active" : "text-light"}`}>
                  <i className="bi bi-briefcase me-2  text-success"></i> Job Matches
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/myappliedjob" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/myappliedjob" ? "active" : "text-light"}`}>
                  <i className="bi bi-file-earmark-check me-2 text-info"></i> My Applied Job
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/myinbox" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/myinbox" ? "active" : "text-light"}`}>
                  <i className="bi bi-envelope-fill me-2  text-info"></i> My Inbox
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/changepassword" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/changepassword" ? "active" : "text-light"}`}>
                  <i className="bi bi-lock-fill me-2 text-warning"></i> Change Password
                </Link>
              </li>

            </ul>
          </>
        )}

        {role === "Company" && (
          <>
            <hr className="border-secondary my-3" />
            <ul className="nav nav-pills flex-column gap-2">
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === "/dashboard" ? "active" : "text-light"}`}>
                  <div className="d-flex align-items-center"><i className="bi bi-speedometer2 me-2 text-primary fs-3"></i><span className="me-2">Dashboard</span></div>
                  <span className="badge bg-primary ms-auto"> New</span></Link>
              </li>
              <li className="nav-item">
                <Link to="/company/companyaccount" className={`nav-link d-flex align-items-center ${location.pathname === "/company/companyaccount" ? "active" : "text-light"}`}>
                  <i className="bi bi-building me-2"></i> Company Account
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/company/postnewjob" className={`nav-link d-flex align-items-center ${location.pathname === "/company/postnewjob" ? "active" : "text-light"}`}>
                  <i className="bi bi-plus-circle me-2 text-warning"></i> Post New Job
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/company/profilematch" className={`nav-link d-flex align-items-center ${location.pathname === "/company/profilematch" ? "active" : "text-light"}`}>
                  <i className="bi bi-person-check-fill me-2 text-info"></i> Profile Match
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/company/appliedjob" className={`nav-link d-flex align-items-center ${location.pathname === "/company/appliedjob" ? "active" : "text-light"}`}>
                  <i className="bi bi-check2-square me-2 text-success"></i> Applied Job
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/changepassword" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/changepassword" ? "active" : "text-light"}`}>
                  <i className="bi bi-lock-fill me-2 text-warning"></i> Change Password
                </Link>
              </li>
            </ul>
          </>
        )}

        {role === "Admin" && (
          <>
            <hr className="border-secondary my-3" />
            <ul className="nav nav-pills flex-column gap-2">
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === "/dashboard" ? "active" : "text-light"}`}>
                  <div className="d-flex align-items-center"><i className="bi bi-speedometer2 me-2 text-primary fs-3"></i><span className="me-2">Dashboard</span></div>
                  <span className="badge bg-primary ms-auto"> New</span></Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/employeereport" className={`nav-link d-flex align-items-center ${location.pathname === "/admin/employeereport" ? "active" : "text-light"}`}>
                  <i className="bi bi-clipboard-check me-2 text-warning"></i> Employee Report
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/companyreport" className={`nav-link d-flex align-items-center ${location.pathname === "/admin/companyreport" ? "active" : "text-light"}`}>
                  <i className="bi bi-bar-chart-line me-2 text-info"></i> Company Report
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/feedbackreport" className={`nav-link d-flex align-items-center ${location.pathname === "/admin/feedbackreport" ? "active" : "text-light"}`}>
                  <i className="bi bi-chat-dots-fill me-2 text-danger"></i> Feedback Report
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/changepassword" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/changepassword" ? "active" : "text-light"}`}>
                  <i className="bi bi-lock-fill me-2 text-warning"></i> Change Password
                </Link>
              </li>
            </ul>
          </>
        )}

        {role === "Super Admin" && (
          <>
            <hr className="border-secondary my-3" />
            <ul className="nav nav-pills flex-column gap-2">
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === "/dashboard" ? "active" : "text-light"}`}>
                  <div className="d-flex align-items-center"><i className="bi bi-speedometer2 me-2 text-primary fs-3"></i><span className="me-2">Dashboard</span></div>
                  <span className="badge bg-primary ms-auto"> New</span></Link>
              </li>
              <li className="nav-item">
                <Link to="/superadmin/roles" className={`nav-link d-flex align-items-center ${location.pathname === "/superadmin/roles" ? "active" : "text-light"}`}>
                  <i className="bi bi-person-workspace me-2 text-primary"></i> Roles
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/superadmin/users" className={`nav-link d-flex align-items-center ${location.pathname === "/superadmin/users" ? "active" : "text-light"}`}>
                  <i className="bi bi-person-fill-check me-2 text-success"></i> Users
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/superadmin/userroles" className={`nav-link d-flex align-items-center ${location.pathname === "/superadmin/userroles" ? "active" : "text-light"}`}>
                  <i className="bi bi-person-vcard me-2 text-warning"></i> User Roles
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/superadmin/customer" className={`nav-link d-flex align-items-center ${location.pathname === "/superadmin/customer" ? "active" : "text-light"}`}>
                  <i className="bi bi-person-lines-fill me-2 text-info"></i> Customer
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee/changepassword" className={`nav-link d-flex align-items-center ${location.pathname === "/employee/changepassword" ? "active" : "text-light"}`}>
                  <i className="bi bi-lock-fill me-2 text-warning"></i> Change Password
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100"> {/* Full height layout */}
        <Header />

        <div className="d-flex flex-grow-1"> {/* Main content row */}
          <Sidebar />
          <div className="flex-grow-1 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/header" element={<Header />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employee/myprofile" element={<EmployeeMyprofile />} />
              <Route path="/employee/jobmatches" element={<EmployeeJobmatches />} />
              <Route path="/employee/myappliedjob" element={<EmployeeMyappliedjob />} />
              <Route path="/employee/myinbox" element={<EmployeeMyinbox />} />
              <Route path="/employee/changepassword" element={<EmployeeChangepassword />} />
              <Route path="/company/postnewjob" element={<CompanyPostnewjob />} />
              <Route path="/company/companyaccount" element={<Companyaccount />} />
              <Route path="/company/profilematch" element={<CompanyProfilematch />} />
              <Route path="/company/appliedjob" element={<CompanyAppliedjob />} />
              <Route path="/admin/employeereport" element={<AdminEmployeereport />} />
              <Route path="/admin/companyreport" element={<AdminCompanyreport />} />
              <Route path="/admin/feedbackreport" element={<AdminFeedbackreport />} />
              <Route path="/searchjobcategory" element={<Searchjobcategory />} />
              <Route path="/home" element={<Home />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/contactus" element={<Contactus />} />
              <Route path="/superadmin/roles" element={<Roles />} />
              <Route path="/superadmin/users" element={<Users />} />
              <Route path="/superadmin/userroles" element={<Userroles />} />
              <Route path="/superadmin/customer" element={<Customer />} />
              <Route path="/facebookcallback" element={<FacebookCallback />} />
              <Route path="/google-callback" element={<GoogleCallback setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
              <Route path="/logingf" element={<Logingf />} />

            </Routes>
          </div>
        </div>

        <Footer /> {/* This will always stay at the bottom */}
      </div>
    </BrowserRouter>
  );
}


export default App;