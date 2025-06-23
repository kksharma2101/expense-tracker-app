import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"; // Added useCallback
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify"; // Assume you're using react-toastify

const ExpenseContext = createContext();

// Centralized fixed categories (consider moving to constants file)
const EXPENSE_CATEGORIES = ["Food", "Bills", "Travel", "Other"]; // Added more examples

const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Keep error for global context status
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const location = useLocation();

  const [auth] = useAuth();
  const userId = auth?.user?._id; // Directly access _id

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (location.pathname === "/expenses" && userId) {
        url = `${process.env.REACT_APP_BACKEND_URL}/expense/get-monthly-expense?userId=${userId}&year=${filter.year}&month=${filter.month}`;
      } else if (location.pathname === "/") {
        // Assuming a route to get all expenses for the dashboard/overview
        url = `${process.env.REACT_APP_BACKEND_URL}/expense/get-expense`;
      } else {
        // If on a path where expenses are not needed, just return
        setLoading(false);
        return;
      }

      const { data } = await axios.get(url);

      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch expenses."
      );
      toast.error(err.response?.data?.message || "Failed to load expenses."); // User feedback
    } finally {
      setLoading(false);
    }
  }, [userId, filter.month, filter.year, location.pathname]); // Dependencies for useCallback

  // Effect to load expenses when userId, filter, or path changes
  useEffect(() => {
    if (userId || location.pathname === "/") {
      fetchExpenses();
    }
  }, [fetchExpenses, userId, location.pathname]); // fetchExpenses is now a stable dependency due to useCallback

  const addExpense = async (expenseData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/expense/create-expense`,
        expenseData
        // Optional: add auth token if needed
        // { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // setExpenses((prev) => [...prev, response.data]);
      setExpenses((pre) =>
        Array.isArray(pre) ? [...pre, response] : [response]
      );

      // toast.success("Expense added successfully!");
    } catch (err) {
      console.error("Error adding expense:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add expense.";
      setError(errorMessage);
      // toast.error(errorMessage); // User feedback
      throw new Error(errorMessage);
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
        Array.isArray(prev) ? prev.filter((exp) => exp.id !== id) : []
      );
      // setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      toast.success("Expense deleted successfully!");
    } catch (err) {
      console.error("Error deleting expense:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete expense.";
      setError(errorMessage);
      toast.error(errorMessage); // User feedback
      throw new Error(errorMessage);
    }
  };

  const updateFilter = useCallback((newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []); // No dependencies for this simple updater

  const handleExportCSV = async () => {
    try {
      // Adjust this URL to match your backend export endpoint
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/expense/export-expense`,
        {
          responseType: "blob", // Important: tells Axios to expect a binary blob
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.csv"); // Set the desired filename

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      toast.success("CSV export initiated successfully!");
    } catch (error) {
      console.error("Error during CSV export:", error);
      // Handle error in UI, e.g., show a toast message
      toast.error("Failed to export expenses. Please try again.");
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories: EXPENSE_CATEGORIES,
        loading,
        error,
        filter,
        addExpense,
        deleteExpense,
        updateFilter,
        handleExportCSV,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

const useExpenses = () => useContext(ExpenseContext);

export { useExpenses, ExpenseProvider };
