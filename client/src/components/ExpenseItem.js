import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

// Centralized category colors (consider moving this to a constants file)
const CATEGORY_COLORS = {
  Food: "#F59E0B", // Amber
  Travel: "#3B82F6", // Blue
  Bills: "#10B981", // Emerald
  Other: "#6B7280", // Gray
};

// Helper function
const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
};

const ExpenseItem = React.memo(({ expense }) => {
  const { deleteExpense } = useExpenses();
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [auth] = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExpense(expense._id);
      window.location.reload();
      // toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      // toast.error("Failed to delete expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Category initial and color */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getCategoryColor(expense.category) }}
          >
            <span className="text-white font-medium uppercase">
              {expense.category.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium capitalize">{expense.category}</h3>{" "}
            <p className="text-xs md:text-base text-gray-500">
              {format(new Date(expense.date), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          <span className="font-bold text-xs md:text-base text-red-600">
            -${expense.amount.toFixed(2)}
          </span>
          <div className="flex space-x-2">
            {/* Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-500 hover:text-gray-700 text-xs sm:text-base"
            >
              {showDetails ? "Hide" : "Details"}
            </button>

            {/* Delete Button */}
            {auth?.user._id === expense?.user && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-400 hover:bg-red-500 border rounded-md p-1 sm:px-2 text-xs sm:text-base font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expense Description */}
      {showDetails && (
        <div className="mt-3 pl-14 text-sm text-gray-600">
          {expense?.description || expense?.title ? (
            <p>{expense.description || expense.title}</p>
          ) : (
            <p className="text-gray-400 italic">No description provided</p>
          )}
        </div>
      )}
    </div>
  );
});

export default ExpenseItem;
