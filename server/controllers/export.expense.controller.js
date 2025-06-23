import { stringify } from "csv-stringify/browser/esm";
import Expense from "../models/expense.model.js";

const exportCSV = async (req, res, next) => {
  try {
    // 1. Fetch data from MongoDB
    const expenses = await Expense.find({}).lean(); // .lean() makes it a plain JS object, slightly faster

    if (!expenses || expenses.length === 0) {
      return res.status(404).send("No expenses found to export.");
    }

    // 2. Define CSV Headers and Columns
    const columns = {
      title: "Title",
      category: "Category",
      amount: "Amount",
      date: "Date",
    };

    // 3. Generate CSV String
    stringify(
      expenses,
      {
        header: true, // Include header row
        columns: columns, // Map model fields to CSV headers
        cast: {
          date: (value) =>
            value ? new Date(value).toLocaleDateString("en-GB") : "", // Format date
          amount: (value) => parseFloat(value).toFixed(2), // Ensure amount is 2 decimal places
        },
      },
      (err, output) => {
        if (err) {
          console.error("CSV Stringify Error:", err);
          return res.status(500).send("Error generating CSV.");
        }

        // 4. Set Headers for File Download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="expenses.csv"'
        );
        res.status(200).send(output);
      }
    );
  } catch (error) {
    console.error("Error exporting expenses:", error);
    res.status(500).send("Server error during export.");
  }
};

export default exportCSV;
