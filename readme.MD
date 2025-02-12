# ToDo App

This is a full-stack **ToDo Application** built using:
- **Frontend:** React (Material UI)
- **Backend:** C# (.NET 8, MongoDB)

## 📁 Project Structure
```
/your-github-repo
│── /client     # React frontend
│── /ToDoWebApiServer     # C# backend (ASP.NET Core)
│── README.md   # Project documentation
```

## 🚀 Features
- Create, update, delete, and fetch tasks
- Set a custom due date (default: 12 hours)
- Mark tasks as completed
- Store tasks in MongoDB

---

## 🛠 Backend (C# .NET 8) - `/ToDoWebApiServer `
### **Tech Stack:**
- **ASP.NET Core Web API**
- **MongoDB** (using MongoDB.Driver)
- **Minimal API + Entity Framework**

### **API Routes:**
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/CreateTask` | Create a new task |
| `GET` | `/api/GetTasks` | Get all tasks |
| `PUT` | `/api/UpdateTaskStatus/{id}` | Update task status |
| `DELETE` | `/api/DeleteTask/{id}` | Delete a completed task |

### **Setup Backend:**
1. **Navigate to the API folder:**  
   ```sh
   cd webApi
   ```
2. **Install dependencies:**  
   ```sh
   dotnet restore
   ```
3. **Run the API:**  
   ```sh
   dotnet run
   ```
4. **Backend runs at:** `http://localhost:5000`

---

## 🎨 Frontend (React) - `/client`
### **Tech Stack:**
- **React (Vite)**
- **Material UI**
- **Axios** (for API requests)

### **Setup Frontend:**
1. **Navigate to client folder:**  
   ```sh
   cd client
   ```
2. **Install dependencies:**  
   ```sh
   npm install
   ```
3. **Run the frontend:**  
   ```sh
   npm run dev
   ```
4. **Frontend runs at:** `http://localhost:5173`

---

## 🌟 How to Use
1. Start the backend (`webApi`) and frontend (`client`).
2. Open the app in your browser.
3. Add new tasks, mark them as completed, or delete completed tasks.

---

## 🛑 Issues & Contributions
If you find a bug or want to contribute, feel free to create a **pull request** or open an **issue** on GitHub.

Happy coding! 🚀

