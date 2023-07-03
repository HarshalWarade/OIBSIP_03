const taskHeadingInput = document.getElementById('taskHeadingInput');
const taskBodyInput = document.getElementById('taskBodyInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

function addTask() {
  const taskHeading = taskHeadingInput.value.trim();
  const taskBody = taskBodyInput.value.trim();
  if (taskHeading === '' || taskBody === '') {
    return;
  }

  const taskId = Date.now();
  const timestamp = Date.now();
  const taskItem = createTaskElement(taskId, taskHeading, taskBody, timestamp);
  taskList.appendChild(taskItem);

  // Save task to local storage
  saveTaskToLocalStorage(taskId, taskHeading, taskBody, timestamp);

  taskHeadingInput.value = '';
  taskBodyInput.value = '';
}

// Function to create a task element
function createTaskElement(taskId, taskHeading, taskBody, timestamp) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('taskItem');
  taskItem.setAttribute('data-task-id', taskId);

  const taskHeadingElement = document.createElement('h2');
  taskHeadingElement.textContent = taskHeading;

  const taskBodyElement = document.createElement('p');
  taskBodyElement.textContent = taskBody;

  const timestampElement = document.createElement('span');
  timestampElement.textContent = `Created on: ${new Date(timestamp).toLocaleString()}`;

  const taskTextElement = document.createElement('div');
  taskTextElement.appendChild(taskHeadingElement);
  taskTextElement.appendChild(taskBodyElement);
  taskTextElement.appendChild(timestampElement);

  const actionButtons = document.createElement('div');
actionButtons.classList.add('open');
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editTask(taskId));

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteTask(taskId));

  const completeButton = document.createElement('button');
  completeButton.textContent = 'Complete';
  completeButton.addEventListener('click', () => completeTask(taskId));

  actionButtons.appendChild(editButton);
  actionButtons.appendChild(deleteButton);
  actionButtons.appendChild(completeButton);

  taskItem.appendChild(taskTextElement);
  taskItem.appendChild(actionButtons);

  return taskItem;
}

// Function to edit a task
function editTask(taskId) {
  const taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
  const taskHeadingElement = taskItem.querySelector('h2');
  const taskBodyElement = taskItem.querySelector('p');
  const taskHeading = taskHeadingElement.textContent;
  const taskBody = taskBodyElement.textContent;

  const newTaskHeading = prompt('Edit the task heading:', taskHeading);
  const newTaskBody = prompt('Edit the task body:', taskBody);
  if (newTaskHeading !== null && newTaskBody !== null && newTaskHeading.trim() !== '' && newTaskBody.trim() !== '') {
    taskHeadingElement.textContent = newTaskHeading.trim();
    taskBodyElement.textContent = newTaskBody.trim();

    // Update task in local storage
    updateTaskInLocalStorage(taskId, newTaskHeading.trim(), newTaskBody.trim());
  }
}

// Function to delete a task
function deleteTask(taskId) {
  const taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
  taskList.removeChild(taskItem);

  // Remove task from local storage
  removeTaskFromLocalStorage(taskId);
}

// Function to mark a task as completed
function completeTask(taskId) {
  const taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
  taskItem.classList.toggle('completed');

  // Update task status in local storage
  updateTaskStatusInLocalStorage(taskId);
}

// Function to save task to local storage
function saveTaskToLocalStorage(taskId, taskHeading, taskBody, timestamp) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ id: taskId, heading: taskHeading, body: taskBody, timestamp: timestamp, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update task in local storage
function updateTaskInLocalStorage(taskId, taskHeading, taskBody) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const index = tasks.findIndex(task => task.id === taskId);
  if (index !== -1) {
    tasks[index].heading = taskHeading;
    tasks[index].body = taskBody;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Function to remove task from local storage
function removeTaskFromLocalStorage(taskId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const index = tasks.findIndex(task => task.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Function to update task status in local storage
function updateTaskStatusInLocalStorage(taskId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const index = tasks.findIndex(task => task.id === taskId);
  if (index !== -1) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const taskItem = createTaskElement(task.id, task.heading, task.body, task.timestamp);
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    taskList.appendChild(taskItem);
  });
}

addButton.addEventListener('click', addTask);

loadTasksFromLocalStorage();