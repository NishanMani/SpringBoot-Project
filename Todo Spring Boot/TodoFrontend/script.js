// Shared script for login, register, and todos pages
const SERVER_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

// Login page logic
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        const text = await response.text();
        let data = {};
        try {
            data = JSON.parse(text);
        } catch {
            // If JSON parsing fails, keep data as empty object
        }

        if (!response.ok) {
            throw new Error(data.message || "Login Failed");
        }

        // Save token and redirect
        localStorage.setItem("token", data.token);
        window.location.href = "todos.html";
    })
    .catch(error => {
        alert(error.message);
    });
}


// Register page logic
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        if (response.ok) {
            alert("Registration Successful! Please Login.");
            window.location.href = "login.html";
        } else {
            const text = await response.text();
            let message;
            try {
                const data = JSON.parse(text);
                message = data.message || "Registration Failed";
            } catch {
                message = "Registration Failed: Server returned no JSON.";
            }
            throw new Error(message);
        }
    })
    .catch(error => {
        alert(error.message);
    });
}


// Todos page logic
function createTodoCard(todo) {
    const card = document.createElement("div");
    card.className = "todo-card"; 

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener("change", function(){
        const updatedTodo = {...todo, isCompleted: checkbox.checked}
        updateTodoStatus(updatedTodo);
    });

    const span = document.createElement("span");
    span.textContent = todo.title;

    if(todo.isCompleted){
        span.style.textDecoration ="line-through";
        span.style.color = "#aaa";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = function(){deleteTodo(todo.id)};

    card.appendChild(checkbox);
    card.appendChild(span);
    card.appendChild(deleteBtn);

    return card;
}

function loadTodos() {
    if(!token){
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }
    fetch(`${SERVER_URL}/todo`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`},

    })
    .then(async response => {
        if(!response.ok){
            const text = await response.text();
            let errorMessage = "Failed to get todos";
            try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = text || errorMessage;
            }
           throw new Error(errorMessage);
        }
        return response.json();
    })
    .then((todos) => {
        const todoList = document.getElementById("todo-list");
        const emptyMessage = document.getElementById("empty-message");
        todoList.innerHTML = "";

        if(!todos || todos.length === 0){
             todoList.innerHTML = `<p id="empty-message">No Todos yet. Add one below!</p>`
        }
        else{
            todos.forEach(element => {
                todoList.appendChild(createTodoCard(element))
            });
        }
    })
    .catch(error => {
        alert(error.message);
        document.getElementById("todo-list").innerHTML = `<p id="empty-message" style="color:red">Failed to load Todos!</p>`
    })
}

function addTodo() {
    const inputElement = document.getElementById("new-todo"); 
    const todotext = inputElement.value.trim();

    if (!todotext) {
        alert("Please enter a to-do.");
        return;
    }

    fetch(`${SERVER_URL}/todo/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: todotext, description: "", isCompleted: false })
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Failed to add todo" }));
            throw new Error(errorData.message);
        }
        return response.json();
    })
    .then((newTodo) => {
        inputElement.value = ""; 
        loadTodos();
    })
    .catch(error => {
        alert(error.message);
    });
}

function updateTodoStatus(todo) {
     fetch(`${SERVER_URL}/todo`, {
        method: "PUT",
        headers: {"Content-Type": "application/json",
            Authorization: `Bearer ${token}`},
            body: JSON.stringify(todo)
    })
    // Add 'async' and handle the error response correctly
    .then(async response =>{
        if(!response.ok){
            const errorData = await response.json().catch(() => ({ message: "Failed to update todo" }));
            throw new Error(errorData.message);
        }
        return response.json();
    })
    .then(() => loadTodos())
    .catch(error => {
        alert(error.message);
        // Reload todos even on failure to revert checkbox state
        loadTodos();
    });
}

function deleteTodo(id) {
    fetch(`${SERVER_URL}/todo/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
    })
    // Add 'async' and handle the error response correctly
    .then(async response =>{
        if(!response.ok){
            const errorData = await response.json().catch(() => ({ message: "Failed to delete todo" }));
            throw new Error(errorData.message);
        }
        return response.text();
    })
    .then(() => loadTodos())
    .catch(error => {
        alert(error.message);
    });
}

// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("todo-list")) {
        loadTodos();
    }
});