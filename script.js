const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");


window.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = { text: taskText, completed: false };
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    taskInput.value = "";
});


filterButtons.forEach(button => {
    button.addEventListener("click", () => filterTasks(button.dataset.filter));
});


function addTaskToDOM(task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    if (task.completed) taskItem.classList.add("completed");

    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    taskItem.appendChild(taskSpan);
    taskItem.appendChild(deleteBtn);
    taskList.appendChild(taskItem);

    
    taskSpan.addEventListener("click", function () {
        task.completed = !task.completed;
        taskItem.classList.toggle("completed");
        updateLocalStorage();
    });

    
    taskSpan.addEventListener("dblclick", function () {
        const newTaskText = prompt("Edit your task:", taskSpan.textContent);
        if (newTaskText !== null && newTaskText.trim() !== "") {
            taskSpan.textContent = newTaskText.trim();
            task.text = newTaskText.trim();
            updateLocalStorage();
        }
    });

   
    deleteBtn.addEventListener("click", function () {
        taskList.removeChild(taskItem);
        removeTaskFromLocalStorage(task);
    });
}


function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function removeTaskFromLocalStorage(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskToRemove.text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function updateLocalStorage() {
    const tasks = Array.from(taskList.children).map(taskItem => {
        return {
            text: taskItem.querySelector("span").textContent,
            completed: taskItem.classList.contains("completed"),
        };
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task));
}


function filterTasks(filter) {
    const tasks = Array.from(taskList.children);
    tasks.forEach(task => {
        if (filter === "all") {
            task.style.display = "flex";
        } else if (filter === "completed") {
            task.style.display = task.classList.contains("completed") ? "flex" : "none";
        } else if (filter === "pending") {
            task.style.display = !task.classList.contains("completed") ? "flex" : "none";
        }
    });
}
