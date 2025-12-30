import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Table,
  Card,
} from "react-bootstrap";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../slices/budgetSlice";
import { toast } from "react-toastify";
import "./BudgetPage.css";

const categories = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transport",
  "Entertainment",
  "Savings",
  "Other",
];

const BudgetPage = () => {
  const dispatch = useDispatch();
  const budgets = useSelector((s) => s.budgets.items);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "",
    description: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.month) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editing) {
        await dispatch(
          updateBudget({
            id: editing._id,
            data: { ...form, amount: Number(form.amount) },
          })
        ).unwrap();
        toast.success("Budget updated successfully!");
        setEditing(null);
      } else {
        await dispatch(addBudget({ ...form, amount: Number(form.amount) })).unwrap();
        toast.success("Budget added successfully!");
      }
      setForm({ category: "", amount: "", month: "", description: "" });
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  const handleEdit = (b) => {
    setEditing(b);
    setForm({
      category: b.category,
      amount: b.amount,
      month: b.month,
      description: b.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await dispatch(deleteBudget(id)).unwrap();
      toast.success("Budget deleted");
    } catch (err) {
      toast.error(err || "Error deleting");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content p-3 p-md-4">
        <Container fluid>
          {/* ===== Header ===== */}
          <Row className="mb-4">
            <Col xs={12}>
              <div className="top-pill d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3 bg-white shadow-sm rounded">
                <h5 className="fw-bold mb-2 mb-md-0 text-dark">Budget Planner</h5>
                <div className="health-pill text-success fw-semibold">
                  Budget Health: <strong>Good</strong>
                </div>
              </div>
            </Col>
          </Row>

          {/* ===== Budget Form ===== */}
          <Row className="justify-content-center">
            <Col xs={12}>
              <Card className="p-3 p-md-4 border-0 shadow-sm">
                <h6 className="fw-bold mb-3 text-dark">
                  {editing ? "Edit Budget" : "Create New Budget"}
                </h6>

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col xs={12} md={6}>
                      <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group controlId="amount">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.amount}
                            onChange={(e) =>
                              setForm({ ...form, amount: e.target.value })
                            }
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group controlId="month">
                        <Form.Label>Month</Form.Label>
                        <Form.Control
                          type="month"
                          value={form.month}
                          onChange={(e) =>
                            setForm({ ...form, month: e.target.value })
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="description">
                        <Form.Label>Description (Optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Add any additional details..."
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex flex-wrap justify-content-end gap-2">
                    {editing && (
                      <Button
                        variant="outline-secondary"
                        className="cancel-btn"
                        onClick={() => {
                          setEditing(null);
                          setForm({
                            category: "",
                            amount: "",
                            month: "",
                            description: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" className="save-btn">
                      {editing ? "Update Budget" : "Save Budget"}
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>

          {/* ===== Saved Budgets ===== */}
          <Row className="mt-4">
            <Col xs={12}>
              <Card className="p-3 p-md-4 border-0 shadow-sm">
                <h6 className="fw-bold mb-3 text-dark">Saved Budgets</h6>
                <div className="table-responsive">
                  <Table striped bordered hover className="align-middle text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Month</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgets.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-muted text-center">
                            No budgets added yet
                          </td>
                        </tr>
                      ) : (
                        budgets.map((b) => (
                          <tr key={b._id}>
                            <td>{b.category}</td>
                            <td>${Number(b.amount).toFixed(2)}</td>
                            <td>{b.month}</td>
                            <td>{b.description || "-"}</td>
                            <td>
                              <div className="d-flex justify-content-center flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleEdit(b)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(b._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default BudgetPage;
