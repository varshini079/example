// Set to store added options
const addedOptions = new Set();

// Function to close the dialog (replace with your implementation)
function closeDialog() {
    document.getElementById('newOptionDialog').style.display = 'none';
}

// Function to populate dropdown with options
async function populateDropdown() {
    try {
        // Make a GET request to retrieve existing options
        const response = await axios.get('/options');
        const options = response.data; // Fetch all options from the database
        console.log(options);
        // Clear existing options from the dropdown
        const dropdown = document.getElementById('dropdown');
        // Add retrieved options to the dropdown and the addedOptions set
        options.forEach(option => {
            const optionText = option.name.trim();
            if (optionText !== "" && !addedOptions.has(optionText)) {
                const optionElement = document.createElement('option');
                optionElement.value = optionText;
                optionElement.textContent = optionText;
                dropdown.appendChild(optionElement);
                addedOptions.add(optionText);
            }
        });
    } catch (error) {
        console.error('Error retrieving options:', error);
    }
}

// Function to add a new option
async function addNewOption() {
    const newOptionText = document.getElementById('newOptionText').value.trim();

    // Check if the new option text is not empty and is not already added
    if (newOptionText !== "" && !addedOptions.has(newOptionText)) {
        try {
            // Make a POST request to add the new option
            await axios.post('/options', { name: newOptionText });

            // Add the option to the dropdown dynamically
            const dropdown = document.getElementById('dropdown');
            const optionElement = document.createElement('option');
            optionElement.value = newOptionText;
            optionElement.textContent = newOptionText;
            dropdown.appendChild(optionElement);

            // Add the new option to the set of added options
            addedOptions.add(newOptionText);
            // Close the dialog
            console.log("Successfully added new option");
            closeDialog();
        } catch (error) {
            console.error('Error adding new option:', error);
            alert("Failed to add new option!");
        }
    }
}

// Function to add a new div for a category
function addNewDiv(categoryName) {
    console.log("Adding new category");
    var divId = categoryName.replace(/\s+/g, ''); // Removing spaces from category name for div id
    var sectionElement = document.querySelector('.section');
    if (sectionElement) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('app');
        newDiv.id = divId;
        const newHeading = document.createElement('h2');
        newHeading.textContent = categoryName;
        newDiv.appendChild(newHeading); // Append newHeading as a child of newDiv

        // Create and append image to newDiv
        const newImage = document.createElement('img');
        newImage.src = 'image.jpg';
        newDiv.appendChild(newImage);

        sectionElement.appendChild(newDiv);
    } else {
        console.error("Section element not found.");
    }
}
function addTask(taskText, category) {
    console.log(taskText, category,"ddTask");
    var categoryId = category.replace(/\s/g, ''); // Remove spaces from category name for div id
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
        addNewDiv(category)
        addTask(taskText, category);
        
    }
}


// Function to add a task
function add() {
    console.log('add');
    var taskInput = document.getElementById("todo-text");
    var categorySelect = document.getElementById("dropdown");
    var taskText = taskInput.value.trim();
    var category = categorySelect.value;
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
                  addTask(taskText, category); // Add the task to UI

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

// Function to handle dropdown change
function handleDropdownChange() {
    console.log("Dropdown")
    var selectElement = document.getElementById("dropdown");
    console.log("selectElement dropdown fun", selectElement);
    var selectedOption = selectElement.value;
    console.log("selectedOption dropdown func", selectedOption);
    if (selectedOption === "__new_option__") {
        document.getElementById("newOptionDialog").style.display = "block";
        addNewOption();
    }
}

// Function to fetch tasks
/*
async function fetchTasks() {
    console.log("Fetching tasks... function");
    try {
        const response = await axios.get('/tbc');
        console.log(response.data, "data end" ); // Log the fetched tasks
        response.data.forEach(taskCategory => {
            const { _id: categoryId, tasks } = taskCategory;
            tasks.forEach(task => {
                // Add each task to the respective category in the UI
                addTask(task.task,  categoryId.replace(/\s+/g, ''));
            });
        });
    } catch (error) {
        console.error(error);
        // Handle errors
    }
}
window.onload = function() {
    fetchTasks(); // Call fetchTasks function to populate tasks into respective divs after page reload
};
*/
// Event listener to populate dropdown when the page loads
window.addEventListener('DOMContentLoaded', populateDropdown);

