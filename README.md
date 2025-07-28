# ✅ Task Manager with Filters, Duration Tracking, Charts & Reports

<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
</div>

A fully interactive and intuitive web app for **creating, managing, and tracking tasks** — supporting **advanced filters**, **completion tracking**, **automated duration calculation**, **task reports**, **live charts**, and more.

---

## 🌐 Access the live version

🔗 [Click here to open the app](https://marcelocarneiro100.github.io/lista-de-tarefas-javascript/)  

---

## ✨ Main Features

- 📝 **Create Tasks** with selectable priority levels
- 🧠 **Real-Time Smart Search** by text
- 🎯 **Advanced Filtering** by:
  - Status (pending, completed)
  - Priority (low, medium, high)
  - Period (today, last 7 or 30 days)
- ✅ **Toggle Completion Status**, auto-setting completion date and duration
- ⏱ **Auto-Calculated Duration** between creation and completion timestamps
- 💾 **Persistence via LocalStorage** — tasks stay saved in the browser
- 📊 **Dynamic Chart** reflecting task status distribution
- 🧾 **Filtered Task Report Generator**
- 📁  **Allows uploading and downloading of JSON files, enabling task backup.**
- 🔄 **Centralized Filtering Logic** via the `filtrarTarefas()` function
- 💡 **Reusable Duration Formatter** displayed in both modal and reports
- 📱 **Responsive Design**, styled by task priority

---

## 📦 Task Object Structure

```js
{
  texto: "Sample task",
  prioridade: "high", // or "medium", "low"
  concluida: false,
  criacao: "07/08/2025 14:23:00",
  conclusao: null,
  duracao: null // filled after completion
}
```

- The `duracao` value is stored in milliseconds and formatted for display

---

## 🔧 Key Functions

| Function                    | Description                                                                |
|-----------------------------|----------------------------------------------------------------------------|
| `formatarDuracao(ms)`       | Formats total time (e.g. “1m 5d” or “1 month and 5 days”)                  |
| `filtrarTarefas(li)`        | Centralizes all filtering logic                                           |
| `getTodasTarefasFiltradas()`| Returns an array of tasks matching current criteria                       |
| `aplicarBuscaEFiltro()`     | Shows or hides `<li>` elements based on `filtrarTarefas()` evaluation     |
| `renderizarInfoModal()`     | Fills the modal with task details, including formatted duration           |

---

## 📊 Progress Chart

- Displays a **live bar chart** with task totals by status
- Dynamically updates based on active filters
- Helps track productivity at a glance

---

## 🧪 Duration Formatting Examples

| Milliseconds        | Abbreviated      | Full Description                      |
|---------------------|------------------|----------------------------------------|
| `3_153_600_000`     | `1m 5d`          | Took about 1 month and 5 days          |
| `62_000`            | `1min 2s`        | Took about 1 minute and 2 seconds      |
| `0`                 | `--`             | Took less than 1 second                |

---

## 🛠 Key Refactorings

- 🔄 Created `filtrarTarefas()` to consolidate all filter conditions
- ♻️ Reused it across `getTodasTarefasFiltradas()` and `aplicarBuscaEFiltro()`
- ⏱ Duration now consistently calculated in raw milliseconds
- ✨ Eliminated duplicate code between filter-based functions
- 📋 Ensured consistent formatting between modal and report

---

## 💾 Technologies Used

- HTML5
- CSS3 (with visual priority indicators)
- JavaScript (ES6+)
- [Day.js](https://day.js.org/) for date handling
- LocalStorage
- Task charts via `<canvas>` or JS charting library

---

## 👨‍💻 Author

Developed with dedication by **Marcelo Carneiro**  
Passionate about clean code, UI clarity, and thoughtful functionality ⚡

---
## 🌐 Other Languages
A Portuguese version of this document is also available: [Português](README_pt-br.md)

