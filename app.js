document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    async function fetchTodos() {
        const response = await fetch('/todos');
        const todos = await response.json();
        return todos;
    }

    async function addTask(text) {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, completed: false }),
        });
        return response.json();
    }

    async function deleteTask(index) {
        await fetch(`/todos/${index}`, {
            method: 'DELETE',
        });
    }

    async function toggleComplete(index, completed) {
        await fetch(`/todos/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
    }

    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');

            const taskText = document.createElement('span');
            taskText.textContent = todo.text;
            if (todo.completed) {
                taskText.classList.add('completed');
            }
            li.appendChild(taskText);

            const completeButton = document.createElement('button');
            completeButton.textContent = todo.completed ? 'Undo' : 'Complete';
            completeButton.addEventListener('click', async () => {
                await toggleComplete(index, !todo.completed);
                const updatedTodos = await fetchTodos();
                renderTodos(updatedTodos);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                await deleteTask(index);
                const updatedTodos = await fetchTodos();
                renderTodos(updatedTodos);
            });

            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }

    todoForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            await addTask(text);
            const updatedTodos = await fetchTodos();
            renderTodos(updatedTodos);
            todoInput.value = '';
        }
    });

    fetchTodos().then(renderTodos);
});
