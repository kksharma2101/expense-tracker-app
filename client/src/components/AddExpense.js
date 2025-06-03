import { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

const AddExpense = () => {
  const {
    addExpense,
    categories,
    loading,
    error: contextError,
  } = useExpenses();
  const navigate = useNavigate();

  // Get today's date in 'YYYY-MM-DD' format for the max attribute and initial state
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default category once categories are loaded
  useEffect(() => {
    if (categories && categories.length > 0 && !formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0],
      }));
    }
  }, [categories, formData.category]); // Depend on categories and if category is already set

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    // Client-side validation
    if (!formData.title.trim()) {
      setFormError("Title is required.");
      setIsSubmitting(false);
      return;
    }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setFormError("Amount must be a positive number.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.category) {
      setFormError("Category is required.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.date) {
      setFormError("Date is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addExpense({
        ...formData,
        amount: amount,
      });

      // Reset form after successful submission
      setFormData({
        title: "",
        amount: "",
        category: categories[0] || "",
        date: getTodayDate(),
      });

      // toast.success("Expense added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding expense:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add expense. Please try again.";
      setFormError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early returns for initial loading or context errors
  if (loading)
    return <div className="text-center py-8">Loading categories...</div>;
  if (contextError)
    return (
      <div className="text-center py-8 text-red-500">
        Error loading categories: {contextError}
      </div>
    );

  return (
    <div className="w-full p-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto border-t bg-white p-4 rounded-lg shadow-md"
      >
        <h2 className="text-xl text-center font-semibold mb-4">
          Add New Expense
        </h2>

        {formError && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {formError}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Category
          </label>
          {categories && categories.length > 0 ? (
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500">
              No categories available. Please check your data source.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            max={getTodayDate()}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Expense..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
