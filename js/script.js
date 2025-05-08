console.log('Script loaded');
const alertMessage = document.querySelector('.alert');
const noneInputsContainer = document.querySelector('.none-inputs');

const addTask = document.getElementById("addTask");
const clearAllButton = document.querySelector(".clear-btn");

const dateInput = document.getElementById("taskDueDate");
const addTaskName = document.getElementById("taskName");

const allTasksButton = document.getElementById("allTasks");
const activeTasksButton = document.getElementById("activeTasks");
const completedTasksButton = document.getElementById("completedTasks");

const taskList = document.getElementById("tasksListing");
const tableRows = taskList.getElementsByTagName("tr");


addTask.addEventListener("click", () => {
    if (validateTaskInput()) {
        addTaskToTable();
        noneInputsContainer.style.display = "block";
    } else {
        alertMessage.classList.remove("d-none");
        setTimeout(() => {
            alertMessage.classList.add("d-none");
        }, 2500);
    }
});

clearAllButton.addEventListener("click", () => {
    clearAllTasks();
});

let taskName;
let dueDate;
let priority;
let taskRow;

function validateTaskInput() {
    taskName = addTaskName.value;
    dueDate = dateInput.value;
    priority = document.getElementById("priority").value;
    return taskName.trim() !== "" && dueDate !== "" && priority !== "";
}

function addTaskToTable() {
    taskName = addTaskName.value;
    dueDate = dateInput.value;
    priority = document.getElementById("priority").value;

    if (taskName) {
        taskRow = createTaskRow(taskName, dueDate, priority);
        taskList.appendChild(taskRow);
        addTaskName.value = "";
        dateInput.value = "";
        document.getElementById("priority").selectedIndex = 0;


        const isEmpty = taskList.getElementsByTagName("tr").length <= 1;
        clearAllButton.classList.toggle("d-none", isEmpty);
        allTasksButton.click();
    }
}


function createTaskRow(taskName, dueDate, priority) {
    const taskRow = document.createElement("tr");

    const statusCell = document.createElement("td");
    statusCell.textContent = "Active";
    statusCell.style.fontWeight = "bold";
    
    const taskDescription = document.createElement("td");
    taskDescription.textContent = taskName;
    
    const priorityCell = document.createElement("td");
    priorityCell.textContent = priority;

    if (priority === "High Priority") {
        priorityCell.style.textDecoration = "underline";
        priorityCell.style.color = "#ff0000";
    } else if (priority === "Low Priority") {
        priorityCell.style.textDecoration = "underline";
        priorityCell.style.color = "#FFD700";
    }
    
    
    const dueDateCell = document.createElement("td");
    const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
    });
    dueDateCell.textContent = formattedDate;
    
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square icon-class"></i>';
    editButton.addEventListener("click", () => {
        taskDescription.setAttribute("contenteditable", "true");
        taskDescription.focus();
    });

    taskDescription.addEventListener("blur", () => {
        taskDescription.removeAttribute("contenteditable");
    });

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fa-solid fa-check icon-class"></i>';
    completeButton.addEventListener("click", () => {
        statusCell.textContent = "Completed";
        taskDescription.style.textDecoration = "line-through";
        taskDescription.style.fontWeight = "bold";
        taskDescription.style.color = "green";
    });
    
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash icon-class"></i>';
    deleteButton.addEventListener("click", () => {
        taskRow.remove();
        const remainingTasks = taskList.getElementsByTagName("tr").length - 1;

            if (remainingTasks === 0) {
                noneInputsContainer.style.display = "none";
                clearAllButton.classList.add("d-none");
            }
    });
    
    const actionsCell = document.createElement("td");
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(completeButton);
    actionsCell.appendChild(deleteButton);
    
    taskRow.appendChild(statusCell);
    taskRow.appendChild(taskDescription);
    taskRow.appendChild(priorityCell);
    taskRow.appendChild(dueDateCell);
    taskRow.appendChild(actionsCell);
    
    return taskRow;
}

function clearAllTasks() {
    const taskList = document.getElementById("tasksListing");
    const tableRows = taskList.getElementsByTagName("tr");

    for (let i = tableRows.length - 1; i > 0; i--) {
        tableRows[i].remove();
    }
    noneInputsContainer.style.display = "none";
    clearAllButton.classList.add("d-none");
}



// Filtering tasks status 
allTasksButton.addEventListener("click", () => {
    showAllTasks();
    setActiveSectionButton(allTasksButton);
    clearAllButton.classList.remove("d-none");
});
function showAllTasks() {
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].removeAttribute("hidden");
    }
}

activeTasksButton.addEventListener("click", () => {
    showActiveTasks();
    setActiveSectionButton(activeTasksButton);
    clearAllButton.classList.add("d-none");
});
function showActiveTasks() {
    for (let i = 1; i < tableRows.length; i++) {
        if (tableRows[i].querySelector("td").textContent === "Active") {
            tableRows[i].removeAttribute("hidden");
        } else {
            tableRows[i].setAttribute("hidden", "true");
        }
    }
}

completedTasksButton.addEventListener("click", () => {
    showCompletedTasks();
    setActiveSectionButton(completedTasksButton);
    clearAllButton.classList.add("d-none");
});
function showCompletedTasks() {
    for (let i = 1; i < tableRows.length; i++) {
        if (tableRows[i].querySelector("td").textContent === "Completed") {
            tableRows[i].removeAttribute("hidden");
        } else {
            tableRows[i].setAttribute("hidden", "true");
        }
    }
}

function setActiveSectionButton(activeButton) {
    allTasksButton.classList.remove("active-section");
    activeTasksButton.classList.remove("active-section");
    completedTasksButton.classList.remove("active-section");

    activeButton.classList.add("active-section");
}


//Sorting the task's priorities
const sortButton = document.getElementById("sortTasks");
sortButton.addEventListener("click", () => {
    sortTasksByPriority();
});

function sortTasksByPriority() {
    const sortedRows = Array.from(tableRows).slice(1).sort((rowA, rowB) => {
        const priorityA = rowA.querySelector("td:nth-child(3)").textContent;
        const priorityB = rowB.querySelector("td:nth-child(3)").textContent;

        if (priorityA === "High Priority" && priorityB === "Low Priority") {
            return -1;
        } else if (priorityA === "Low Priority" && priorityB === "High Priority") {
            return 1;
        } else {
            return 0;
        }
    });

    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
    }

    sortedRows.forEach(row => {
        taskList.appendChild(row);
    });
}

//Sorting the task's due dates
const sortButtonByDate = document.getElementById("sortTasksByDate");
sortButtonByDate.addEventListener("click", () => {
    sortTasksByDate();
});

function sortTasksByDate() {
    const sortedRows = Array.from(tableRows).slice(1).sort((rowA, rowB) => {
        const dueDateA = new Date(rowA.querySelector("td:nth-child(4)").textContent);
        const dueDateB = new Date(rowB.querySelector("td:nth-child(4)").textContent);

        return dueDateA - dueDateB;
    });

    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
    }
    
    sortedRows.forEach(row => {
        taskList.appendChild(row);
    });
}

const BASE_API_URL = 'https://mx.velodata.org/api/v2';

const roles = {
    1: "Admin",
    2: "Creator",
    3: "Member",
    4: "Spy"
};

const formArea = document.getElementById('form-area');
const responseMessage = document.getElementById('response-message');

// Inject a form into the page
formArea.innerHTML = `
  <form id="create-user-form" class="row g-3">
    <div class="col-12">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="name" required>
    </div>

    <div class="col-12">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" required>
    </div>

    <div class="col-12">
      <label for="password" class="form-label">Password <small class="text-muted">(min 8 characters, at least one number)</small></label>
      <input type="password" class="form-control" id="password" required>
    </div>

    <div class="col-12">
      <label for="role_id" class="form-label">Role</label>
      <select class="form-select" id="role_id" required>
        <option value="">Choose a role</option>
        <option value="1">Admin</option>
        <option value="2">Creator</option>
        <option value="3">Member</option>
        <option value="4">Spy</option>
      </select>
    </div>

    <div class="col-12">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
`;

const form = document.getElementById('create-user-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleInput = document.getElementById('role_id');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side password validation
    const password = passwordInput.value;
    const passwordValid = password.length >= 8 && /\d/.test(password);
    if (!passwordValid) {
        responseMessage.innerHTML = `<div class="alert alert-warning">Password must be at least 8 characters long and include at least one number.</div>`;
        return;
    }

    // Map role data
    const roleId = roleInput.value;
    const roleName = roles[roleId] || "Unknown";

    // Construct user data payload
    const userData = {
        data: {
            attributes: {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: password,
                role_name: roleName,
                vmd_user_email: "trainer@example.com",
                vmd_user_name: "Trainer",
            },
            relationships: {
                roles: {
                    data: [
                        { id: roleId, type: "roles" }
                    ]
                }
            }
        }
    };

    // Disable submit button while processing
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        // Send data to API and handle response
        const response = await fetch(`${BASE_API_URL}/teach/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // Check for errors in the response
        if (!response.ok) {
            throw new Error(`Status ${response.status}: ${response.statusText}`);
        }

        // Parse JSON data
        const result = await response.json();

        // Display success message
        responseMessage.innerHTML = `<div class="alert alert-success">User created successfully with ID: ${result.data.id}</div>`;
        form.reset();

    } catch (error) {
        // Display error message
        responseMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
    }
});

