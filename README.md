# Global Row Selection in PrimeReact DataTable

This project demonstrates how to implement **global row selection across paginated pages** using PrimeReact's `<DataTable>`. Users can input a number (e.g., `20`) and the first N rows will be selected, even if they are spread across multiple paginated pages.

---

## 📦 Features

- ✅ Data fetching from paginated API
- ✅ Tracks all loaded rows globally (`allData`)
- ✅ Allows user to input how many rows to select (`rowsSelected`)
- ✅ Automatically selects N rows from the global dataset
- ✅ Maintains selection across page changes

---

## 🧠 How It Works

1. **User inputs** the number of rows they want to select.
2. The app **fetches more pages** if needed until it has enough rows.
3. The first `N` rows from all fetched data are selected.
4. As user navigates between pages, selections are preserved.

---

## 🛠 Tech Stack

- React
- TypeScript
- PrimeReact
- Axios

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/thee-pika/react-assignment.git
cd react-assignment

