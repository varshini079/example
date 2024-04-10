function add() {
    console.log("h");
    var taskInput = document.getElementById("todo-text");
    var categorySelect = document.getElementById("dropdown");
    var taskText = taskInput.value.trim();
    var categoryOption = categorySelect.options[categorySelect.selectedIndex];
    var category = categoryOption.textContent; // Category name
    var categoryId = categoryOption.value; // Category ID
    console.log("categoryOption",categoryOption,category ," category ",categoryId,"categoryId");
    if (taskText !== "") {
        const existingTasks = document.querySelectorAll(`#${category} div`);
        console.log(existingTasks.id, "existing")
        const duplicateTask = Array.from(existingTasks).find(task => task.textContent.trim() === taskText);
        console.log(Array.from(existingTasks))
        if (duplicateTask) {
            alert("Duplicate task found in the selected category.");
            return;
        }

        axios.post('/tasks', {
                task: taskText,
                category: category
            })
            .then(response => {
                console.log(response.data); // Log the response
                // Add the task to the UI if needed
                if (response.data === "Duplicate task") {
                    alert("Task already exists");
                    return; // Return early if duplicate task found
                  }
                  addTask(taskText, category,categoryId); // Add the task to UI

            })
            .catch(error => {
                console.error(error);
                // Handle errors
            });
        taskInput.value = ""; // Clear the input field
    } else {
        alert("Please enter a valid task!");
    }
}

// Add event listener to the dropdown
function handleDropdownChange() {
    var selectElement = document.getElementById("dropdown");
    var selectedOption = selectElement.value;
    
    if (selectedOption === "__new_option__") {
        document.getElementById("newOptionDialog").style.display = "block";
    }
}
function addNewOption() {
    var selectElement = document.getElementById("dropdown");
    var newOptionText = document.getElementById("newOptionText").value.trim();
    
    // Check if the input field is not empty
    if (newOptionText !== "") {
        // Check if the new option already exists
        if (!selectElement.querySelector("option[value='" + newOptionText + "']")) {
            var newOption = document.createElement("option");
            newOption.text = newOptionText;
            newOption.value = newOptionText;
            selectElement.add(newOption);
            
            // Select the newly added option
            newOption.selected = true;
            // Add a new div corresponding to the new option
            addNewDiv(newOptionText, newOptionText);
            // Close the dialog
            closeDialog();
        } else {
            alert("Option already exists!");
        }
    } else {
        alert("Please enter a valid option!");
    }
}
function addNewDiv(categoryId, category) {
    var divId = categoryId;
    // Check if a div with the same ID already exists
    if (!document.getElementById(divId)) {
        // If not, create a new div for the category
        const newDiv = document.createElement('div');
        newDiv.classList.add('app');
        newDiv.id = divId;
        newDiv.textContent = category; // Set the category name as text content
        console.log(newDiv.textContent,"created");
        document.querySelector('.section').appendChild(newDiv);
      
    }
}

function closeDialog() {
    document.getElementById("newOptionDialog").style.display = "none";
    document.getElementById("newOptionText").value = "";
}
//addTask function form new folder
function addTask(taskText, category,categoryId) {
    var categoryContainer = document.getElementById(categoryId);
    // Debugging: Log the category ID and category container
    console.log("Category ID:", categoryId);
    console.log("Category Container:", categoryContainer);

    if (categoryContainer) {
        // Create a new task element and append it to the category container
        var taskItem = document.createElement('div');
        taskItem.textContent = taskText;
        console.log(taskText);
        categoryContainer.appendChild(taskItem);
        console.log("Adding task:", taskText, "to category:", category);
    } else {
        addNewDiv(category, function() 
        { console.log("Category container created for category:", category);
            addTask(taskText, category,categoryId);
        });
        console.error("Category container not found for category:", category);
    }
}


async function fetchTasks() {
    console.log("Fetching tasks... function");
    try {
        const response = await axios.get('/tbc');
        console.log(response.data, "data end" ); // Log the fetched tasks
       
    } catch (error) {
        console.error(error);
        // Handle errors
    }
}
window.onload = function() {
    fetchTasks(); // Call fetchTasks function to populate tasks into respective divs after page reload
};




