import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useExpenses } from "../context/ExpenseContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MonthlyTrends = ({ expenses }) => {
  const { categories } = useExpenses();
  // console.log(expenses);

  const dataByCategory = categories.map((category) => {
    const categoryExpenses = expenses.expenses?.filter(
      (exp) => exp?.category === category
    );
    return categoryExpenses?.reduce((sum, exp) => sum + exp.amount, 0);
  });

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Amount Spent",
        data: dataByCategory,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Spending by Category",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  return (
    <div className="mb-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyTrends;
