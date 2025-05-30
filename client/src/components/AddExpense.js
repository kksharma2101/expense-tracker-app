import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const { addExpense, categories, loading, error } = useExpenses();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: categories[0],
    date: new Date().toISOString().split("T")[0],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      setFormData({
        title: "",
        amount: "",
        category: categories[0],
        date: new Date().toISOString().split("T")[0],
      });

      navigate("/expenses");
    } catch (error) {
      console.log("Error in add expense");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="w-full p-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto border-t bg-white p-4 rounded-lg shadow-md"
      >
        <h2 className="text-xl text-center font-semibold mb-4">
          Add New Expense
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
