// DOM Elements
const form = document.getElementById('task-form');
const filter = document.getElementById('filter');
const taskInput = document.getElementById('task');
const taskList = document.querySelector('.collection');
const clearTask = document.querySelector('.clear-tasks');
const themeButton = document.getElementById('theme-button');

// Load all event listner
loadEventListeners();

function loadEventListeners() {
  // DOM loaded event
  document.addEventListener('DOMContentLoaded', getTasks);
  // Add task event
  form.addEventListener('submit', addTask);
  // Remove task event
  taskList.addEventListener('click', removeTasks);
  // Clear task event
  clearTask.addEventListener('click', clearTasks);
  // Filter task event
  filter.addEventListener('keyup', filterTasks);
  // Change theme
  themeButton.addEventListener('click', changeTheme);
}

// --------- Add Tasks --------- //
function addTask(e) {
  // Stop loading by default
  e.preventDefault();

  // Get input value
  let taskValue = taskInput.value;

  // Input is empty or not
  if (taskValue === '') {
    showAlert('Please add task', 'danger');
  } else {
    // Create LI elements
    const li = document.createElement('li');
    // Add class
    li.className = 'list-group-item collection-item';
    // Add input value
    li.innerHTML = `${taskValue}`;

    // Other way to add input value
    // li.innerText = taskInput.value;
    // li.appendChild(document.createTextNode(taskInput.value));

    // Create new link
    const link = document.createElement('a');
    link.className = 'delete-task float-end';
    // Add icon
    link.innerHTML = "<i class='bx bxs-trash-alt'></i>";
    link.style.color = '#df4759';
    link.style.cursor = 'pointer';

    // Append LI to UL
    li.appendChild(link);
    taskList.appendChild(li);

    // Save in Storage
    saveTasksInStorage(taskValue);

    // Clear input
    taskInput.value = '';

    // Show alert
    showAlert('Task Add', 'success');
  }
}

// --------- Remove Tasks --------- //
function removeTasks(e) {
  if (e.target.parentElement.classList.contains('delete-task')) {
    if (confirm('Are u sure  to delete ?')) {
      e.target.parentElement.parentElement.remove();

      // Remove task from Storage
      removeTaskFromStorage(e.target.parentElement.parentElement);

      showAlert('You are delete this task', 'warning');
    }
  }
}

// --------- Clear Tasks --------- //
function clearTasks() {
  // taskList.innerHTML = '';

  // Loop
  if(confirm('Are you sure to clear all ?')) {
    while(taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  }

  // Clear all tasks from Storage
  clearAllTasksFromStorage();

  showAlert('You are delete all task', 'warning');
}

// --------- Filter Tasks --------- //
function filterTasks(e) {
  // Get user iput value
  const text = e.target.value.toLowerCase();

  const collectionItem = document.querySelectorAll('.collection-item');
  collectionItem.forEach(task => {
    // Get different task
    const item = task.firstChild.textContent;
    
    if(item.toLowerCase().indexOf(text) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}

// -------------- Local Storage Handle -------------- //

// Get tasks from LS
function getTasks() {
  // Init table tasks
  let tasks;

  if(localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  // Save task
  tasks.forEach(task => {
    // Create LI elements
    const li = document.createElement('li');
    // Add class
    li.className = 'list-group-item collection-item';
    // Add input value
    li.innerHTML = `${task}`;
    // li.appendChild(document.createTextNode(task));

    // Create new link
    const link = document.createElement('a');
    link.className = 'delete-task float-end';
    // Add icon
    link.innerHTML = "<i class='bx bxs-trash-alt'></i>";
    link.style.color = '#df4759';
    link.style.cursor = 'pointer';

    // Append LI to UL
    li.appendChild(link);
    taskList.appendChild(li);
  });
}

// Save Tasks in L. Storage
function saveTasksInStorage(task) {
  // Init tasks
  let tasks;

  if(localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    // Convert string to object
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  // Add tasks to task
  tasks.push(task);

  // Save task
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove Task from L. Storage
function removeTaskFromStorage(taskItem) {
  let tasks;
  if(localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach((task, index) => {
    if(taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });

  // Other way to remove from Store
  // const taskIndex = taskItem.children[0].innerHTML;
  // tasks.splice(tasks.indexOf(taskIndex), 1);

  // Save
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear all tasks from L. Storage
function clearAllTasksFromStorage() {
  localStorage.clear();
}

// --------- Dark Mode -------- //
const darkMode = 'dark-mode';
const iconTheme = 'bxs-toggle-right';

// If User select
const selectMode = localStorage.getItem('select-mode');
const selectIcon = localStorage.getItem('select-icon');

// Get current Mode
// function getCurrentMode() {
//   if(document.body.classList.contains(darkMode)) {
//     'dark';
//   } else {
//     'light';
//   }
// }

// function getCurrentIcon() {
//   if(themeButton.classList.contains(iconTheme)) {
//     'bx-toggle-right';
//   } else {
//     'bxs-toggle-right';
//   }
// }

// Simplify Version
const getCurrentMode = () => document.body.classList.contains(darkMode) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-toggle-left' : 'bxs-toggle-right';

// If user choose previously topic
if(selectMode) {
  // Validation fulfilled
  document.body.classList[selectMode === 'dark' ? 'add' : 'remove'](darkMode);
  themeButton.classList[selectIcon === 'bx-toggle-left' ? 'add' : 'remove'](iconTheme);
}

function changeTheme() {
  // Add or remove dark/icon theme
  document.body.classList.toggle(darkMode);
  // Change Icon
  themeButton.classList.toggle(iconTheme);
  // Save current theme in the Store
  localStorage.setItem('select-mode', getCurrentMode());
  localStorage.setItem('select-icon', getCurrentIcon());
}

// -------------- Show Alert -------------- //
function showAlert(message, className) {
  const div = document.createElement('div');
  div.className = `alert alert-${className} col-md-6 m-auto mt-3`;
  div.appendChild(document.createTextNode(message));
  const container = document.querySelector('.container');
  const row = document.querySelector('.row');
  container.insertBefore(div, row);

  // Set time
  setTimeout(() => document.querySelector('.alert').remove(), 1500);
}