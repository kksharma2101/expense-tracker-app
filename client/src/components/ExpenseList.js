import { useLocation } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseItem from "./ExpenseItem";
import MonthlyTrends from "./MonthlyTrends";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

const ExpenseList = () => {
  const { expenses, loading, error, filter, updateFilter, handleExportCSV } =
    useExpenses();
  const [showChart, setShowChart] = useState(true);
  const [auth] = useAuth();
  const location = useLocation();

  const totalAmount = expenses.expenses?.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleMonthChange = (e) => {
    updateFilter({ month: parseInt(e.target.value) });
  };

  const handleYearChange = (e) => {
    updateFilter({ year: parseInt(e.target.value) });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center my-auto h-screen">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center my-auto h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="space-y-6 w-full">
      {auth?.user && (
        <Button
          children="Export All Expenses to CSV"
          onClick={handleExportCSV}
        />
      )}
      <div className="bg-white p-6 w-full rounded-lg shadow-md">
        <div className="block sm:flex justify-between items-center w-full mb-4">
          <h2 className="text-center mb-5 sm:mb-0 sm:text-balance text-xl font-semibold">
            Your Expenses
          </h2>
          <div className="flex gap-2 items-center justify-between md:space-x-4">
            {auth?.user && location.pathname === "/expenses" && (
              <>
                <select
                  value={filter.month}
                  onChange={handleMonthChange}
                  className="p-2 border rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  value={filter.year}
                  onChange={handleYearChange}
                  className="p-2 border rounded"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 4 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </>
            )}

            <Button
              children={showChart ? "Hide Chart" : "Show Chart"}
              onClick={() => setShowChart(!showChart)}
              variant="secondary"
            />
          </div>
        </div>

        {showChart && <MonthlyTrends expenses={expenses} />}

        <div className="mt-6">
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
            <span className="font-medium">Total Spent:</span>
            <span className="font-bold">${totalAmount}</span>
          </div>

          {auth?.user && (
            <div className="divide-y">
              {expenses.expenses?.map((expense) => (
                <ExpenseItem key={expense._id} expense={expense} />
              ))}
              {expenses.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No expenses recorded for this period
                </div>
              ) : (
                expenses.expense?.map((expense) => (
                  <ExpenseItem key={expense._id} expense={expense} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
