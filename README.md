# 🧹 AI Data Cleanup & Validation Tool

This is a web application built using **Next.js** that allows non-technical users to upload datasets (CSV or Excel), view them in an editable grid, validate the data, and apply AI-powered suggestions or transformations using natural language prompts.

---

> **Note:** The project is still under development.


## 🚀 Features

- 📁 Upload CSV or XLSX files
- 🧮 View and edit dataset in an interactive data grid
- 🛡️ Automatic data validation (e.g. missing fields, incorrect formats)
- 🔁 Re-validate data after edits
- ⚙️ Export cleaned data
- 🤖 AI-assisted data transformation using natural language
- 🔧 Rule engine to define and apply dataset rules (e.g. co-run, slot restriction)
- 🧠 Smart filters and AI-suggested rules based on uploaded data

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **AI Integration:** Gemini API / OpenAI (prompt-to-rule + data transformation)
- **Grid:** React Data Grid / AG Grid
- **File Parsing:** Papaparse, xlsx
- **Deployment:** Vercel / Custom (as preferred)

---

## 🔐 API Key Info

> **Note:** The API key required for the AI integration has been intentionally removed due to usage constraints. You must configure your own key locally if you'd like to run this project with full AI functionality.
