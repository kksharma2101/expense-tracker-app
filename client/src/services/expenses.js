import axios from "axios";

const API_URL = "/api/expenses";

const getExpenses = async (month, year) => {
  const response = await axios.get(API_URL, {
    params: { month, year },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

const addExpense = async (expense) => {
  const response = await axios.post(API_URL, expense, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

const deleteExpense = async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export { getExpenses, addExpense, deleteExpense };
