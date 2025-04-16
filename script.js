// Select important elements from the HTML
const taskInput = document.querySelector(".task-input input"), // The input box to add tasks
  filters = document.querySelectorAll(".filters span"),         // All filter buttons (All, Pending, Completed)
  clearAll = document.querySelector(".clear-btn"),              // Clear All button
  taskBox = document.querySelector(".task-box");                // The list (ul) where tasks are shown

// Initialize some variables
let editId,                   // Stores the ID of the task being edited
  isEditTask = false,         // Checks if user is editing a task
  todos = JSON.parse(localStorage.getItem("todo-list")); // Get tasks from local storage (if any)

// Add event listeners to filter buttons (All, Pending, Completed)
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from the previously selected filter
    document.querySelector("span.active").classList.remove("active");

    // Add active class to the currently clicked filter
    btn.classList.add("active");

    // Show tasks based on selected filter
    showTodo(btn.id);
  });
});

// Function to show tasks (based on selected filter)
function showTodo(filter) {
  let liTag = ""; // HTML content for tasks will be stored here

  if (todos) {
    todos.forEach((todo, id) => {
      // Check if the task is completed
      let completed = todo.status == "completed" ? "checked" : "";

      // Show task if it matches the selected filter or if filter is 'all'
      if (filter == todo.status || filter == "all") {
        // Create a list item for the task
        liTag += `<li class="task">
                    <label for="${id}">
                      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                      <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="task-menu">
                        <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                        <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                      </ul>
                    </div>
                  </li>`;
      }
    });
  }

  // Show the tasks in the task box or display a message if no tasks
  taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;

  // Check how many tasks are displayed
  let checkTask = taskBox.querySelectorAll(".task");

  // Show or hide the Clear All button depending on whether there are tasks
  !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");

  // If task list is long, make the box scrollable
  taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

// Show all tasks when the page first loads
showTodo("all");

// Function to show the small menu (Edit/Delete) when the 3-dot icon is clicked
function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild; // Get the menu inside the task
  menuDiv.classList.add("show");

  // Hide the menu if user clicks somewhere else
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

// Function to update the status (completed or pending) of a task
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild; // The text of the task

  if (selectedTask.checked) {
    // If checkbox is checked, mark task as completed
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    // If checkbox is unchecked, mark task as pending
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }

  // Save the updated tasks in local storage
  localStorage.setItem("todo-list", JSON.stringify(todos))
}

// Function to start editing a task
function editTask(taskId, textName) {
  editId = taskId;             // Store task ID to edit later
  isEditTask = true;           // Enable edit mode
  taskInput.value = textName;  // Put task text back into input box
  taskInput.focus();           // Focus on input box
  taskInput.classList.add("active"); // Add a class for styling if needed
}

// Function to delete a task
function deleteTask(deleteId, filter) {
  isEditTask = false;               // Disable edit mode
  todos.splice(deleteId, 1);        // Remove task from list
  localStorage.setItem("todo-list", JSON.stringify(todos)); // Save changes
  showTodo(filter);                 // Refresh the task list
}

// Event listener for Clear All button
clearAll.addEventListener("click", () => {
  isEditTask = false;               // Disable edit mode
  todos.splice(0, todos.length);    // Remove all tasks
  localStorage.setItem("todo-list", JSON.stringify(todos)); // Save empty list
  showTodo();                       // Refresh the task list
});

// Event listener for pressing Enter in the input box
taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim(); // Get input value and remove spaces

  if (e.key == "Enter" && userTask) {
    if (!isEditTask) {
      // If not editing, create a new task
      todos = !todos ? [] : todos; // If no todos exist, create an empty array
      let taskInfo = { name: userTask, status: "pending" }; // New task
      todos.push(taskInfo);        // Add to list
    } else {
      // If editing, update the task name
      isEditTask = false;
      todos[editId].name = userTask;
    }

    taskInput.value = ""; // Clear input box
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Save updated list
    showTodo(document.querySelector("span.active").id); // Show filtered list
  }
});