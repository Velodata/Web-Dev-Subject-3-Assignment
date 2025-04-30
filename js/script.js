console.log('Script loaded');
// Select elements
const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const clearCompletedButton = document.getElementById("clear-completed");
const todoTableBody = document.getElementById("todo-table-body");
const statusMessage = document.getElementById("status-message");
const loadingIndicator = document.getElementById("loading");

// Load saved TODOs from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTodos);

// Function to display messages
function showMessage(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "red" : "green";
    setTimeout(() => { statusMessage.textContent = ""; }, 3000);
}

// Function to show/hide loading indicator
function setLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? "block" : "none";
}

// Function to load TODOs from localStorage
function loadTodos() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(renderTodo);
}

// Function to save TODOs to localStorage
function saveTodosToLocalStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to add a TODO
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") {
        showMessage("Please enter a valid TODO!", true);
        return;
    }

    const newTodo = {
        text: todoText,
        completed: false,
        createdAt: new Date().toLocaleString(),
    };

    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(newTodo);
    saveTodosToLocalStorage(todos);

    renderTodo(newTodo);
    todoInput.value = "";
    showMessage("TODO added successfully!");
}

// Function to render a TODO item in the table
function renderTodo(todo) {
    const row = document.createElement("tr");

    const taskCell = document.createElement("td");
    taskCell.textContent = todo.text;
    if (todo.completed) {
        taskCell.classList.add("completed");
    }

    const dateCell = document.createElement("td");
    dateCell.textContent = todo.createdAt;

    // Create a checkbox for completion
    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.checked = todo.completed; // ✅ Reflects actual state
    completeCheckbox.addEventListener("change", () => toggleComplete(todo.text, taskCell, completeCheckbox));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑";
    deleteButton.addEventListener("click", () => deleteTodo(todo.text, row));

    const completeCell = document.createElement("td");
    completeCell.appendChild(completeCheckbox);

    const deleteCell = document.createElement("td");
    deleteCell.appendChild(deleteButton);

    row.appendChild(taskCell);
    row.appendChild(dateCell);
    row.appendChild(completeCell);
    row.appendChild(deleteCell);

    todoTableBody.appendChild(row);
}

// Function to toggle TODO completion
function toggleComplete(todoText, taskCell, checkbox) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.map(todo => {
        if (todo.text === todoText) {
            todo.completed = checkbox.checked; // ✅ Update based on checkbox state
        }
        return todo;
    });

    saveTodosToLocalStorage(todos);
    taskCell.classList.toggle("completed", checkbox.checked);
}

// Function to delete a TODO
function deleteTodo(todoText, row) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.filter(todo => todo.text !== todoText);
    saveTodosToLocalStorage(todos);
    row.remove();
    showMessage("TODO deleted!");
}

// Function to clear completed TODOs
function clearCompleted() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.filter(todo => !todo.completed);
    saveTodosToLocalStorage(todos);

    // Remove completed items from UI
    document.querySelectorAll(".completed").forEach(todo => todo.parentElement.remove());
    showMessage("Completed TODOs cleared!");
}

// Event listeners
addTodoButton.addEventListener("click", addTodo);
clearCompletedButton.addEventListener("click", clearCompleted);
todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
