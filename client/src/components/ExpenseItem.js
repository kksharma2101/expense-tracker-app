import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { format } from "date-fns";

const ExpenseItem = ({ expense }) => {
  const { deleteExpense } = useExpenses();
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExpense(expense._id);
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getCategoryColor(expense.category) }}
          >
            <span className="text-white font-medium">
              {expense.category.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{expense.category}</h3>
            <p className="text-xs md:text-base text-gray-500">
              {format(new Date(expense.date), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="font-bold text-xs md:text-base text-red-600">
            -${expense.amount.toFixed(2)}
          </span>

          <div className="flex space-x-2">
            <button
              variant="text"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showDetails ? "Hide" : "Details"}
            </button>

            <button
              variant="text"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-400 hover:bg-red-500 border rounded-md p-1 sm:px-2 text-xs sm:text-base font-bold"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pl-14 text-sm text-gray-600">
          {expense.description ? (
            <p>{expense.description}</p>
          ) : (
            <p className="text-gray-400">No description provided</p>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get consistent colors for categories
const getCategoryColor = (category) => {
  const colors = {
    Food: "#F59E0B",
    Travel: "#3B82F6",
    Bills: "#10B981",
    Other: "#6B7280",
  };
  return colors[category] || "#6B7280";
};

export default ExpenseItem;
