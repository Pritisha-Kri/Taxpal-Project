
import { useDispatch, useSelector } from "react-redux";
import { calculateTaxEstimate } from "../slices/taxSlice";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";   // FIX PATH
import { fetchTaxCalendar } from "../slices/taxCalendarSlice";
import React, { useState, useEffect } from "react";



export default function TaxEstimator() {

  const dispatch = useDispatch();
  const { status, result, error } = useSelector((s) => s.tax);
const taxCalendar = useSelector((s) => s.taxCalendar);   // FIXED


  const [form, setForm] = useState({
    income: "",
    expenses: "",
    taxYear: new Date().getFullYear(),
    country: "",
  });

  useEffect(() => {
  dispatch(fetchTaxCalendar());
}, [dispatch]);


  const onChange = (e) => {
    let v = e.target.value;
    if (v === "") v = 0;
    setForm({ ...form, [e.target.name]: v });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        calculateTaxEstimate({
          income: parseFloat(form.income || 0),
          expenses: parseFloat(form.expenses || 0),
          taxYear: parseInt(form.taxYear),
          country: form.country || undefined,
        })
      ).unwrap();

      toast.success("Tax Estimated Successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Sidebar />   {/* FIXED POSITION */}

      <div className="main-content">  {/* Correct wrapper */}
        <h2 className="mb-3 fw-bold">Tax Estimator</h2>
        <p className="text-muted">Calculate your estimated tax obligations.</p>

        <div className="row mt-4">

          <div className="col-md-8">
            <form onSubmit={onSubmit} className="card p-4 shadow-sm">
              <h5 className="fw-bold mb-3">Quarterly Tax Calculator</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Income</label>
                  <input className="form-control" name="income" value={form.income} onChange={onChange} />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Expenses</label>
                  <input className="form-control" name="expenses" value={form.expenses} onChange={onChange} />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Tax Year</label>
                  <input type="number" min="2020" max="2030" className="form-control" name="taxYear" value={form.taxYear} onChange={onChange} />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Country</label>
                  <input className="form-control" name="country" value={form.country} onChange={onChange} />
                </div>
              </div>

              <div className="text-end">
                <button className="btn buttonbg">
                  {status === "loading" ? "Calculating..." : "Calculate Estimated Tax"}
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold">Tax Summary</h5>
              <p className="small text-muted">
                Enter your details to calculate quarterly estimated tax.
              </p>

              {result && (
                <ul className="list-unstyled mt-3">
                  <li><strong>Income:</strong> ${result.income}</li>
                  <li><strong>Expenses:</strong> ${result.expenses}</li>
                  <li><strong>Net Income:</strong> ${result.netIncome}</li>
                  <li><strong>Total Tax:</strong> ${result.totalTax}</li>
                  <li><strong>Quarterly Payment:</strong> ${result.quarterlyPayment}</li>
                </ul>
              )}
            </div>
          </div>

        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* TAX CALENDAR SECTION */}
<div className="card mt-5 p-4 shadow-sm">
  <h4 className="fw-bold">Tax Calendar</h4>

  {taxCalendar.status === "loading" && <p>Loading Calendar...</p>}

  {taxCalendar.items.map((item) => (
    <div
      key={item._id}
      className="p-3 my-3 border rounded d-flex justify-content-between align-items-center"
      style={{ background: "#FCFCFC" }}
    >
      <div>
        <h6 className="mb-1 fw-semibold">{item.title}</h6>
        <small className="text-muted">{item.date}</small>
        <br />
        <small>{item.description}</small>
      </div>

      <span
        className={`badge px-3 py-2 ${
          item.type === "reminder" ? "bg-primary" : "bg-warning"
        }`}
      >
        {item.type}
      </span>
    </div>
  ))}
</div>

      </div>
    </>
  );
}
