import { useExpenses } from '../../context/ExpenseContext';
import ExpenseItem from './ExpenseItem';
import MonthlyTrends from '../Charts/MonthlyTrends';
import { useState } from 'react';

const ExpenseList = () => {
  const { expenses, loading, error, filter, updateFilter } = useExpenses();
  const [showChart, setShowChart] = useState(true);

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleMonthChange = (e) => {
    updateFilter({ month: parseInt(e.target.value) });
  };

  const handleYearChange = (e) => {
    updateFilter({ year: parseInt(e.target.value) });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Expenses</h2>
          <div className="flex space-x-4">
            <select
              value={filter.month}
              onChange={handleMonthChange}
              className="p-2 border rounded"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={filter.year}
              onChange={handleYearChange}
              className="p-2 border rounded"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
            <button
              onClick={() => setShowChart(!showChart)}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>
        </div>

        {showChart && <MonthlyTrends expenses={expenses} />}

        <div className="mt-6">
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
            <span className="font-medium">Total Spent:</span>
            <span className="font-bold">${totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="divide-y">
            {expenses.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No expenses recorded for this period</div>
            ) : (
              expenses.map(expense => (
                <ExpenseItem key={expense._id} expense={expense} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;