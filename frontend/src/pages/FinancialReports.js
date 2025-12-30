import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports, generateReport } from "../slices/reportsSlice";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";   // ⬅️ ADD SIDEBAR

export default function FinancialReports() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.reports);

  const [params, setParams] = useState({
    reportType: "Income Statement",
    period: "Current Month",
    format: "pdf",
  });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const generate = async () => {
    try {
      await dispatch(generateReport(params)).unwrap();
      toast.success("Report Generated");
      dispatch(fetchReports());
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="main-content">

        <h2 className="fw-bold mb-3">Financial Reports</h2>
        <p className="text-muted">Generate and download your financial reports</p>

        {/* REPORT GENERATOR CARD */}
        <div className="card p-4 shadow-sm mb-4">

          <div className="row g-3">

            <div className="col-md-4">
              <label className="fw-bold">Report Type</label>
              <select
                className="form-control"
                value={params.reportType}
                onChange={(e) => setParams({ ...params, reportType: e.target.value })}
              >
                <option>Income Statement</option>
                <option>Balance Sheet</option>
                <option>Cash Flow</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="fw-bold">Period</label>
              <select
                className="form-control"
                value={params.period}
                onChange={(e) => setParams({ ...params, period: e.target.value })}
              >
                <option>Current Month</option>
                <option>Quarter</option>
                <option>Year</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="fw-bold">Format</label>
              <select
                className="form-control"
                value={params.format}
                onChange={(e) => setParams({ ...params, format: e.target.value })}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div className="col-md-1 d-flex align-items-end justify-content-end ms-3">
              <button 
                className="btn"
                onClick={generate}
                style={{ backgroundColor: "#473E83", color: "#fff" }}  // CUSTOM COLOR
              >
                Generate
              </button>
            </div>

          </div>

        </div>

        {/* RECENT REPORTS LIST */}
        <div className="card p-3 shadow-sm">
          <h5 className="fw-bold mb-3">Recent Reports</h5>

          {status === "loading" && <p>Loading...</p>}
          {items?.length === 0 && <p className="text-muted">No reports yet.</p>}

          <ul className="list-group">
            {items?.map((r) => (
              <li 
                key={r._id} 
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{r.name}</strong>
                  <div className="small text-muted">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <a
                    className="btn btn-sm me-2"
                    href={r.downloadUrl}
                    target="_blank"
                    style={{ borderColor: "#473E83", color: "#473E83" }}
                  >
                    Download
                  </a>

                  <span className="badge bg-secondary">{r.format}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  );
}
