import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaWallet,
  FaCalculator,
  FaChartPie,
  FaCog,
  FaBars,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <div className="sidebar d-none d-md-flex flex-column">
        <h2 className="logo">Tax Pal</h2>
        <ul className="menu list-unstyled flex-grow-1">
          <li><NavLink to="/dashboard"><FaTachometerAlt /> Dashboard</NavLink></li>
          <li><NavLink to="/transactions"><FaFileAlt /> Transactions</NavLink></li>
          <li><NavLink to="/budgets"><FaWallet /> Budgets</NavLink></li>
          <li><NavLink to="/tax-estimator"><FaCalculator /> Tax Estimator</NavLink></li>
          <li><NavLink to="/reports"><FaChartPie /> Reports</NavLink></li>
          <li><NavLink to="/settings"><FaCog /> Settings</NavLink></li>
        </ul>
      </div>

      {/* ===== Mobile Navbar ===== */}
      <nav className="navbar navbar-dark d-md-none px-3">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 text-white fw-bold">Tax Pal</span>
          <button
            className="navbar-toggler border-0 text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar"
          >
            <FaBars size={20} />
          </button>
        </div>
      </nav>

      {/* ===== Mobile Offcanvas Sidebar ===== */}
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileSidebarLabel">
            Tax Pal
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="menu list-unstyled">
            <li>
              <NavLink to="/dashboard" data-bs-dismiss="offcanvas">
                <FaTachometerAlt /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/transactions" data-bs-dismiss="offcanvas">
                <FaFileAlt /> Transactions
              </NavLink>
            </li>
            <li>
              <NavLink to="/budgets" data-bs-dismiss="offcanvas">
                <FaWallet /> Budgets
              </NavLink>
            </li>
            <li>
              <NavLink to="/tax-estimator" data-bs-dismiss="offcanvas">
                <FaCalculator /> Tax Estimator
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" data-bs-dismiss="offcanvas">
                <FaChartPie /> Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" data-bs-dismiss="offcanvas">
                <FaCog /> Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
