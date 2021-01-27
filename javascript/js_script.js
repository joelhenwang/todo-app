// ------------  Variable/Constants  --------------------------------------------

const todoInput = document.querySelector(".todo-input");
const todoInputButton = document.querySelector(".submit");
const todoList = document.querySelector(".todo-list");
const clearAllCompletedButton = document.querySelector(".clear-completed");
const filterDiv = document.querySelector(".filters");
const themeToggle = document.querySelector("#checkbox");
var itemsLeft = document.querySelector(".num-items");
let intViewportWidth = window.innerWidth;
// ------------  EventListeners  ----------------------------------------------

document.addEventListener("DOMContentLoaded", getTodos);
todoInputButton.addEventListener("click", validateForm);
todoList.addEventListener("click", actionsTodo);
clearAllCompletedButton.addEventListener("click", clearAllCompleted);
filterDiv.addEventListener("click", filterTodo);
themeToggle.addEventListener("click", switchTheme);

// ------------  Functions  ------------------------------------------


if(intViewportWidth <= 600){
    var filtersContainer = $(".filters");
    document.querySelector(".filters").remove();

    filtersContainer.insertAfter($(".todo-list-container"));

}


//  Check if the input form is blank
function validateForm(event) {
    event.preventDefault;
    // Store the input value into a variable
    var a = document.forms["todo-form"]["input"].value;

    // If the value is blank or null
    if(a == null || a == ""){
        // Change placeholder message
        todoInput.placeholder = "Input cannot be blank..."
    }
    else{
        // Creates a new todo task 
        addTodo(event);
        todoInput.placeholder = "Create a new todo..."
    }
    // "Resets" the input value
    todoInput.value = null;
    itemsLeft.innerText = todoList.children.length + " ";
}

// Create a Todo task
function addTodo(){
     //default event for a submit button is to submit the form, this prevents that

    // Create a "todo" div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo"); //add class "todo" to the newly created div


    // Create "check completed" button
    const checkButton = document.createElement("button");
    checkButton.classList.add("circle-btn"); //add "add-todo" class
    checkButton.innerHTML = '<img class="check" src="/images/icon-check.svg" alt="check-icon">';
    todoDiv.appendChild(checkButton); // Append the button into the div

    // Create "todo item" list
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    // Create h4 element containing todoInput's value
    const todoInputValue_h4 = document.createElement("h4");
    todoInputValue_h4.innerText = todoInput.value;

    // 

    var newTodo = { task: todoInput.value, completed: false};
    saveLocalTodo(newTodo);

    
    // Appends the todoInput.value text (todoInputValue_h4) into the todo-item
    todoItem.appendChild(todoInputValue_h4);
    // Appends the whole todoItem into the div
    todoDiv.appendChild(todoItem);

    // Create a "delete" button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = '<img src="/images/icon-cross.svg" alt="delete">';

    // Appends the delete button into the div
    todoDiv.appendChild(deleteButton);

    // Finnally appends the whole div into the todo's List
    todoList.appendChild(todoDiv);
}

// Execute actions depending on the button pressed in the todo task (Complete/Delete)
function actionsTodo(event) { 
    // Store into a constant the event target
    const item = event.target;

    // Store into a constant the parent of the element (div with class="todo")
    const todo = item.parentElement;

    // Delete the todo task
    deleteTodoDiv(event, item, todo);

    // Check completion of the todo task
    completeTodo(item, todo);
}

// Delete the todoDiv
function deleteTodoDiv(event, item, todo) {  
    
    // Check if the button pressed had the class "delete"
    if(item.classList[0] === "delete"){

        // Add the hiding class that contains the transition for it
        todo.classList.add("hiding");
        //When the transitions ends delete the element (div with class = "todo")
        todo.addEventListener("transitionend", event => {
            todo.remove();
            removeFromJson(todo);
            itemsLeft.innerText = todoList.children.length + " ";
        });
    }
}

// Apply styling for the completed task
function completeTodo(item, todo){
        
    // Check if the button pressed had the class "add-todo"
    if(item.classList[0] === "circle-btn"){

        // If the parent element (div with class = "todo")
        // has more than one class and if it has the "completed" class
        if(todo.classList.length > 0 && todo.classList[1] === "completed"){
            // Remove the "completed" class in the div
            todo.classList.remove("completed");
            updateJson(todo,'uncomplete');
        }
        // Otherwise
        else{
            // Add the "completed" class to the div
            todo.classList.add("completed");
            updateJson(todo,'complete');
        }
    }
}

function removeFromJson(todo){
    let localTodos;
    localTodos = JSON.parse(localStorage.getItem("localTodos"));
    for(var i = 0 ; i < localTodos.length ; i++){
        if(localTodos[i]['task'] == todo.children[1].innerText){
            localTodos.splice(i,1);
            localStorage.setItem("localTodos", JSON.stringify(localTodos));
        }
    }
}

function removeAllCompletedJson() { 
    let localTodos;
    localTodos = JSON.parse(localStorage.getItem("localTodos"));
    for(var i = localTodos.length-1 ; i >= 0 ; i--){
        if(localTodos[i]['completed']){
            localTodos.splice(i,1);
        }
    }
    localStorage.setItem("localTodos", JSON.stringify(localTodos)); 

    itemsLeft.innerText = localTodos.length + " ";
}

function updateJson(todo, param){
    let localTodos;
    localTodos = JSON.parse(localStorage.getItem("localTodos"));
    console.log(localTodos);
    console.log(todo.children[1].innerText);
    localTodos.forEach( task => {
        console.log(task['task']);
        if(task['task'] === todo.children[1].innerText){
            switch(param){
                case 'complete':
                    task['completed'] = true;
                    localStorage.setItem("localTodos", JSON.stringify(localTodos));
                    break;
                
                case 'uncomplete':
                    task['completed'] = false;
                    localStorage.setItem("localTodos", JSON.stringify(localTodos));
                    break;
            }
        }
    })
}

// Remove all completed tasks
function clearAllCompleted(event) {
    
    removeAllCompletedJson();

    // Store the array of childrens of todoList
    var todoListChildren = todoList.children;
    // Store the length of the array todoListChildren
    var totalChildren = todoListChildren.length;

    // Goes through each iteration inside of the array
    for(var i = 0; i < totalChildren ;i++){
        // If the div has the "completed" class
        if(todoListChildren[i].classList[1] === "completed"){
            const todo = todoListChildren[i]
            // Add the "hiding" class (contains the transition for hiding tasks)
            todo.classList.add("hiding");
            // After the transitions ends remove the element
            todo.addEventListener("transitionend", event => {
                todo.remove();
            });
        }
        // Otherwise continue through the array
        else{
            continue;
        }
        
    }
    

}

// Filter the tasks depending the option chosen
function filterTodo(event){

    // Store the array of childrens of todoList
    var todoListChildren = todoList.children;
    // Store the length of the array todoListChildren
    var totalChildren = todoListChildren.length;
    // Store the array of childrens of filterDiv
    var filterDivChildren = filterDiv.children;


    // If the "All" radio option is selected
    if(filterDivChildren[0].checked){
        // Goes through every todo task
        for(var i = 0; i < totalChildren ;i++){
            // If any of the todo's task is hiding
            if(todoListChildren[i].classList.contains("hiding")){
                todo = todoListChildren[i]
                // Unhide
                todo.classList.remove("hiding");
            }
            // Otherwise continue
            else{
                continue;
            }
        }
    }


    // If the "Active" radio option is selected
    else if(filterDivChildren[2].checked){
        // Goes through every todo task
        for(var i = 0; i < totalChildren ;i++){
            // If the task is hiding and is not completed
            if(todoListChildren[i].classList.contains("completed") == false && todoListChildren[i].classList.contains("hiding")){
                todo = todoListChildren[i]
                // Unhide
                todo.classList.remove("hiding");
            }
            // If the task is completed
            else if(todoListChildren[i].classList.contains("completed")){
                todo = todoListChildren[i]
                // Hide it
                todo.classList.add("hiding");
            }
            // Otherwise continue
            else{
                continue;
            }
        }
    }


    // If the "Completed" radio options is selected
    else if(filterDivChildren[4].checked){
        // Goes through every todo task
        for(var i = 0; i < totalChildren ;i++){
            // If the task is not completed
            if(todoListChildren[i].classList.contains("completed") == false){
                todo = todoListChildren[i]  
                // Hide it
                todo.classList.add("hiding");
            }

            // If the task is completed and hiding
            else if(todoListChildren[i].classList.contains("completed") && todoListChildren[i].classList.contains("hiding")){
                todo = todoListChildren[i]
                // Unhide
                todo.classList.remove("hiding");
            }
            // Otherwise continue
            else{
                continue;
            }
        }
    }


}

function getTodos(){
    let localTodos;
    if (localStorage.getItem("localTodos") === null) {
        localTodos = [];
    } else {
        localTodos = JSON.parse(localStorage.getItem("localTodos"));
    }
    localTodos.forEach(task => {
        console.log(task['task']);
        console.log(task['completed']);
        // Create a "todo" div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo"); //add class "todo" to the newly created div


        // Create "check completed" button
        const checkButton = document.createElement("button");
        checkButton.classList.add("circle-btn"); //add "add-todo" class
        checkButton.innerHTML = '<img class="check" src="/images/icon-check.svg" alt="check-icon">';
        if(task['completed']){
            checkButton.checked = true;
            todoDiv.classList.add("completed")
        }
        todoDiv.appendChild(checkButton); // Append the button into the div

        // Create "todo item" list
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");

        // Create h4 element containing todoInput's value
        const todoInputValue_h4 = document.createElement("h4");
        todoInputValue_h4.innerText = task['task'];

        
        // Appends the todoInput.value text (todoInputValue_h4) into the todo-item
        todoItem.appendChild(todoInputValue_h4);
        // Appends the whole todoItem into the div
        todoDiv.appendChild(todoItem);

        // Create a "delete" button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = '<img src="/images/icon-cross.svg" alt="delete">';

        // Appends the delete button into the div
        todoDiv.appendChild(deleteButton);

        // Finnally appends the whole div into the todo's List
        todoList.appendChild(todoDiv);
    });
    itemsLeft.innerText = todoList.children.length + " ";
}

function saveLocalTodo(newTodo){
    let localTodos;
    if (localStorage.getItem("localTodos") === null) {
        localTodos = [];
    } else {
        localTodos = JSON.parse(localStorage.getItem("localTodos"));
    }
    localTodos.push(newTodo);
    localStorage.setItem("localTodos", JSON.stringify(localTodos));
}

function switchTheme(){
    const body = document.querySelector("body");
    console.log(body);

    if(themeToggle.checked){
        body.classList.add("light");
    }
    else{
        body.classList.remove("light");
    }
        
}

