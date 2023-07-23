let todoArray = [];

function saveToLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoArray));
}

function addTask(task, category, dueDate, priority) {
    const newTask = {
        taskDetails: task,
        category: category,
        dueDate: dueDate,
        priority: priority,
        id: Date.now(),
        done: false
    };
    todoArray.unshift(newTask);
    saveToLocalStorage();
    renderTasks();
}



document.addEventListener('DOMContentLoaded', function() {
    const storedTodo = localStorage.getItem('todoList');
    if (storedTodo) {
        todoArray = JSON.parse(storedTodo);
        renderTasks();
    }
    setupFilterDropdown();
});

document.addEventListener('DOMContentLoaded', function() {
    // ... (existing code) ...
    setupFilterDropdown();
});

function setupFilterDropdown() {
    const filterOption = document.getElementById('filterOption');
    filterOption.addEventListener('change', handleFilterChange);
}

function handleFilterChange() {
    const filterOption = document.getElementById('filterOption');
    const filterValue = filterOption.value;
    const filterDropdown = document.getElementById('filterDropdown');
    const filterSelect = document.getElementById('filterValue');

    if (filterValue === 'Category') {
        filterDropdown.style.display = 'block';
        setupCategoryFilterDropdown();
    } else if (filterValue === 'Priority') {
        filterDropdown.style.display = 'block';
        setupPriorityFilterDropdown();
    } else {
        filterDropdown.style.display = 'none';
        renderTasks(); // Show all tasks when 'All' option is selected
    }
}

function setupCategoryFilterDropdown() {
    const filterSelect = document.getElementById('filterValue');
    filterSelect.innerHTML = ''; // Clear the previous options

    const categories = ['Personal', 'Work', 'Study/Education', 'Health/Fitness', 'Family', 'Shopping', 'Travel'];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', handleCategoryFilter);
}

function setupPriorityFilterDropdown() {
    const filterSelect = document.getElementById('filterValue');
    filterSelect.innerHTML = ''; // Clear the previous options

    const priorities = ['High', 'Medium', 'Low'];
    priorities.forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', handlePriorityFilter);
}

function handleCategoryFilter() {
    const selectedCategory = document.getElementById('filterValue').value;
    const filteredTasks = todoArray.filter(task => task.category === selectedCategory);
    renderFilteredTasks(filteredTasks);
}

function handlePriorityFilter() {
    const selectedPriority = document.getElementById('filterValue').value;
    const filteredTasks = todoArray.filter(task => task.priority === selectedPriority);
    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = task.done;
        checkbox.addEventListener('change', function() {
            task.done = this.checked;
            renderTasks();
        });

        const taskDetailsSpan = document.createElement('span');
        taskDetailsSpan.textContent = task.taskDetails;
        taskDetailsSpan.classList.add('task-details');
        if (task.done) {
            taskDetailsSpan.classList.add('done');
        }

        const categorySpan = document.createElement('span');
        categorySpan.textContent = '• ' + task.category + ' ';
        categorySpan.classList.add('category-details');
        if (task.done) {
            categorySpan.classList.add('done');
        }

        const prioritySpan = document.createElement('span');
        prioritySpan.textContent = '• ' + task.priority + ' ';
        prioritySpan.classList.add('priority-details');
        if (task.done) {
            prioritySpan.classList.add('done');
        }        

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('deleteButton');
        deleteButton.setAttribute('data-id', task.id);
        deleteButton.addEventListener('click', function() {
            const taskId = parseInt(deleteButton.getAttribute('data-id'));
            removeTask(taskId);
            renderTasks();
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('editButton');
        editButton.setAttribute('data-id', task.id);
        editButton.addEventListener('click', function() {
            const taskId = parseInt(editButton.getAttribute('data-id'));
            const li = editButton.parentNode;
            const taskDetailsSpan = li.querySelector('.task-details');
            const taskDetails = taskDetailsSpan.textContent;

            const editInput = document.createElement('input');
            editInput.setAttribute('type', 'text');
            editInput.classList.add('editTaskInput');
            editInput.value = taskDetails;

            const saveEditButton = document.createElement('button');
            saveEditButton.classList.add('saveEditButton');
            saveEditButton.textContent = 'Save';

            li.replaceChild(editInput, taskDetailsSpan);
            li.appendChild(saveEditButton);

            saveEditButton.addEventListener('click', function() {
                const newTaskDetails = editInput.value.trim();
                if (newTaskDetails !== '') {
                    editTask(taskId, newTaskDetails);
                    renderTasks();
                }
            });
        });

        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = '• ' + task.dueDate + ' ';
        dueDateSpan.classList.add('due-date-details'); // Add the "due-date-details" class
        if (task.done) {
            dueDateSpan.classList.add('done');
        }

        li.appendChild(checkbox);
        li.appendChild(taskDetailsSpan);
        li.appendChild(categorySpan);
        li.appendChild(dueDateSpan);
        li.appendChild(prioritySpan); // Add the prioritySpan to the list item.
        li.appendChild(deleteButton);
        li.appendChild(editButton);        

        

        taskList.appendChild(li);  
    });
}



function removeTask(id) {
    todoArray = todoArray.filter(task => task.id !== id);
    saveToLocalStorage();
}

function editTask(id, newTaskDetails) {
    todoArray = todoArray.map(task => {
        if (task.id === id) {
            return {
                ...task,
                taskDetails: newTaskDetails
            };
        }
        return task;
    });
}

function markAsDone(id) {
    const taskIndex = todoArray.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        todoArray[taskIndex].done = true;
    }
}

function markAsUndone(id) {
    const taskIndex = todoArray.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        todoArray[taskIndex].done = false;
    }
}

function handleSaveClick() {
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');

    const task = taskInput.value.trim();
    const category = categoryInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (task !== '') {
        addTask(task, category, dueDate, priority);
        taskInput.value = '';
        categoryInput.value = 'Personal';
        dueDateInput.value = 'Today';
        priorityInput.value = 'High';
    }
}




function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    todoArray.forEach(task => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = task.done;
        checkbox.addEventListener('change', function() {
            task.done = this.checked;
            renderTasks();
        });

        const taskDetailsSpan = document.createElement('span');
        taskDetailsSpan.textContent = task.taskDetails;
        taskDetailsSpan.classList.add('task-details');
        if (task.done) {
            taskDetailsSpan.classList.add('done');
        }

        const categorySpan = document.createElement('span');
        categorySpan.textContent = '• ' + task.category + ' ';
        categorySpan.classList.add('category-details');
        if (task.done) {
            categorySpan.classList.add('done');
        }

        const prioritySpan = document.createElement('span');
        prioritySpan.textContent = '• ' + task.priority + ' ';
        prioritySpan.classList.add('priority-details');
        if (task.done) {
            prioritySpan.classList.add('done');
        }        

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('deleteButton');
        deleteButton.setAttribute('data-id', task.id);
        deleteButton.addEventListener('click', function() {
            const taskId = parseInt(deleteButton.getAttribute('data-id'));
            removeTask(taskId);
            renderTasks();
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('editButton');
        editButton.setAttribute('data-id', task.id);
        editButton.addEventListener('click', function() {
            const taskId = parseInt(editButton.getAttribute('data-id'));
            const li = editButton.parentNode;
            const taskDetailsSpan = li.querySelector('.task-details');
            const taskDetails = taskDetailsSpan.textContent;

            const editInput = document.createElement('input');
            editInput.setAttribute('type', 'text');
            editInput.classList.add('editTaskInput');
            editInput.value = taskDetails;

            const saveEditButton = document.createElement('button');
            saveEditButton.classList.add('saveEditButton');
            saveEditButton.textContent = 'Save';

            li.replaceChild(editInput, taskDetailsSpan);
            li.appendChild(saveEditButton);

            saveEditButton.addEventListener('click', function() {
                const newTaskDetails = editInput.value.trim();
                if (newTaskDetails !== '') {
                    editTask(taskId, newTaskDetails);
                    renderTasks();
                }
            });
        });

        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = '• ' + task.dueDate + ' ';
        dueDateSpan.classList.add('due-date-details'); // Add the "due-date-details" class
        if (task.done) {
            dueDateSpan.classList.add('done');
        }

        li.appendChild(checkbox);
        li.appendChild(taskDetailsSpan);
        li.appendChild(categorySpan);
        li.appendChild(dueDateSpan);
        li.appendChild(prioritySpan); // Add the prioritySpan to the list item.
        li.appendChild(deleteButton);
        li.appendChild(editButton);        

        

        taskList.appendChild(li);       
    });

    const doneButtons = document.getElementsByClassName('doneButton');
    Array.from(doneButtons).forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(button.getAttribute('data-id'));
            markAsDone(taskId);
            renderTasks();
        });
    });

    const undoneButtons = document.getElementsByClassName('undoneButton');
    Array.from(undoneButtons).forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(button.getAttribute('data-id'));
            markAsUndone(taskId);
            renderTasks();
        });
    });

    const deleteButtons = document.getElementsByClassName('deleteButton');
    Array.from(deleteButtons).forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(button.getAttribute('data-id'));
            removeTask(taskId);
            renderTasks();
        });
    });

    const editButtons = document.getElementsByClassName('editButton');
    Array.from(editButtons).forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(button.getAttribute('data-id'));
            const li = button.parentNode;
            const taskDetailsSpan = li.querySelector('.task-details');
            const taskDetails = taskDetailsSpan.textContent;

            const editInput = document.createElement('input');
            editInput.setAttribute('type', 'text');
            editInput.classList.add('editTaskInput');
            editInput.value = taskDetails;

            const saveEditButton = document.createElement('button');
            saveEditButton.classList.add('saveEditButton');
            saveEditButton.textContent = 'Save';

            li.replaceChild(editInput, taskDetailsSpan);
            li.appendChild(saveEditButton);

            saveEditButton.addEventListener('click', function() {
                const newTaskDetails = editInput.value.trim();
                if (newTaskDetails !== '') {
                    editTask(taskId, newTaskDetails);
                    renderTasks();
                }
            });
        });
    });
}


const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', handleSaveClick);

// fetch('https://jsonplaceholder.typicode.com/todos')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not OK');
//         }
//         return response.json();
//     })
//     .then(data => {
//         data.forEach(item => {
//             todoArray.unshift({ taskDetails: item.title, id: item.id });
//         });
//         renderTasks();
//     })
//     .catch(error => {
//         console.log('Error:', error.message);
//     });