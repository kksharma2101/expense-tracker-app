import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const location = useLocation();

  const [user] = useAuth();
  const userId = user?.user?._id;

  const categories = ["Food", "Bills", "Travel", "Other"];

  const getAllExpenses = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/expense/get-expense`
      );

      setExpenses(data);
    } catch (error) {
      console.log("Error in Geting all expense", error);
    }
  };

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/expense/get-monthly-expense?userId=${userId}&year=${filter.year}&month=${filter.month}`
        );
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId && location.pathname === "/expenses") {
      loadExpenses();
    } else if (location.pathname === "/") {
      getAllExpenses();
    }
  }, [userId, filter, location, expenses]);

  const addExpense = async (expenseData) => {
    setLoading(true);
    try {
      const newExpense = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/expense/create-expense`,
        expenseData
      );
      const addNewExp = newExpense.data;
      setExpenses((pre) =>
        Array.isArray(pre) ? [...pre, addNewExp] : [addNewExp]
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/expense/delete-expense/${id}`
      );
      setExpenses((prev) =>
        Array.isArray(prev) ? prev.filter((exp) => exp._id !== id) : []
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        loading,
        error,
        filter,
        addExpense,
        deleteExpense,
        updateFilter,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

const useExpenses = () => useContext(ExpenseContext);

export { useExpenses, ExpenseProvider };
