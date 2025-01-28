function openEdit(taskId) {
  let showContent = document.getElementById("showTask");
  showContent.classList.add("hidden");
  let editContent = document.getElementById("addTask-edit");
  editContent.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");

  // Suche die Aufgabe anhand der ID
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
    // Setze die Werte aus der gefundenen Aufgabe
    let title = document.getElementById("addTask-edit-title");
    let hiddenInput = document.getElementById("hiddenInput");
    let description = document.getElementById("addTask-edit-description");
    let assignedTo = document.getElementById("addTask-assigned");
    let dates = document.getElementById("task-edit-Date");

    title.value = task.title;
    hiddenInput.value = task.title;
    description.value = task.description;
    assignedTo.value = task.contacts.join(", "); // Optional: je nach Struktur der Kontakte
    dates.value = task.date;

    // Zeige die ausgewählten Kontakte und Subtasks
    showSelectedContactsEdit(task.contacts);
    subtasksEditRender(taskId);
    generateEditTask(taskId);
  } else {
    console.error("Task not found!");
  }
}


function showSelectedContactsEdit(selected) {

  // Iteriere durch die übergebenen IDs und finde die vollständigen Kontaktobjekte
  for (let i = 0; i < selected.length; i++) {
    const contactId = selected[i]; // ID des ausgewählten Kontakts

    // Suche den Kontakt mit der ID im Kontakte-Array
    const selectedContact = contacts.find(contact => contact.id === contactId);
    
    if (selectedContact) {
      let contactColor = selectedContact['color'];
      let contactName = selectedContact['name'];

      // Finde den Index des Kontakts in dem globalen contacts Array
      let index = contacts.findIndex(contact => contact.id === contactId);

      // Aktualisiere den Kontakt in contacts, indem du den 'selected' Wert hinzufügst
      contacts.splice(index, 1, { 'id': contactId, 'name': contactName, 'color': contactColor, 'selected': true });

      // Füge den Kontakt zu selectedEditContacts hinzu
      selectedEditContacts.push(selectedContact);
    }
  }
}


/**
 * to generate IEditTask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be rendered.
*/
function generateEditTask(taskIndex){
  activeEditButton();
  activeButton(taskIndex);
  subtasksEditRender(taskIndex);
  contactsEditRender(taskIndex)
  renderEditContacts('addTask-contacts-container-edit');
  generateInputEditSubtask(taskIndex);

}

function contactsEditRender(taskId){
  let content = document.getElementsByClassName('user-content-edit-letter')[0];
  content.innerHTML ='';

  const task = tasks.find(t => t.id === taskId);
    for(let j = 0; j < selectedEditContacts.length; j++){
      let letter = selectedEditContacts[j]['name'].split(" ");
      let result = "";
      for(let name = 0; name < letter.length; name++){
        result += letter[name].charAt(0).toUpperCase();
      }
      content.innerHTML += `<div class="user-task-content" style="background-color:${task['contacts'][j]['color']};">${result}</div>`;
    }
}


/**
 * to generate Inputfield by Edit Subtask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be rendered.
*/
function generateInputEditSubtask(taskIndex){
  let content = document.getElementsByClassName(`input-edit-subtask`)[0];
  content.innerHTML =`      
  <input id="addTask-edit-subtasks${taskIndex}" class="inputfield" type="text"
  placeholder="Add new subtask" maxlength="26" autocomplete="off" onclick="openEditSubtaskIcons()"/>
  <div id="addTask-subtasks-edit-icons" class="subtasks-icon d-none">
    <img  src="../img/closeVectorBlack.svg" alt="Delete" onclick="closeEditSubtaskIcons()">
    <div class="parting-line subtasks-icon-line"></div>
    <img id="add-subtask-button" src="../img/done.svg" alt="confirm" onclick="addEditSubtasks(${taskIndex})">
  </div>
  <img src="../img/subtasks.svg" class="plus-icon-edit-subtasks" id="plus-edit-icon" onclick="openEditSubtaskIcons()"/>`;
}





/**
 * to render the Subtask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be rendered.
*/
function subtasksEditRender(taskId){
  let content = document.getElementById('newSubtask');
  content.innerHTML = '';
  
  // Finde die Aufgabe mit der angegebenen taskId
  const task = tasks.find(t => t.id === taskId);

  if (task && task.subtasks) {
    for (let j = 0; j < task.subtasks.length; j++) {
      content.innerHTML += `
        <div class="checkbox-edit-content">
          <div id="checkbox-edit-content${j}" class="checkbox-show-content">
            <input type="checkbox" checked id="checkSub${j}">
            <label id="subtask-edit-text${j}" class="subtask-show-text">${task.subtasks[j]}</label>
          </div>

          <div id="edit-input-board-content${j}" class=" subtasks-icon input-subtask-edit-content hidden">
            <input type="text" class="editInputBoard" id = "editInputBoard${j}" value =${task.subtasks[j]}>
            <div class="edit-buttons-content">
              <img onclick="deleteEditBoardSubtask(${taskId}, ${j})" src="../img/delete.svg" alt="delete">
              <div class="parting-line subtasks-icon-line"></div>
              <img onclick="confirmEdit(${taskId}, ${j})" src="../img/done.svg" alt="confirm">
            </div>
          </div>

          <div id="subtasks-icon${j}" class="subtasks-icon subtasks-icon-hidden">
            <img onclick="editBoardSubtask(${j})" src="../img/edit.svg" alt="edit">
            <div class="parting-line subtasks-icon-line"></div>
            <img onclick="deleteEditBoardSubtask(${taskId}, ${j})" src="../img/delete.svg" alt="delete">
          </div>
        </div>
      `;
    }
  } else {
    console.error("Subtasks not found for task!");
  }
}



/**
 * to confirm the progess after adjustment of Subtasks
 * @param {number} taskIndex - The index of the task to be confirmed
 * @param {number} subtaskIndex - The index of the Subtask to be confirmed
 */
function confirmEdit(taskId, subtaskIndex) {
  let inputSubtask = document.getElementById(`editInputBoard${subtaskIndex}`).value;

  // Finde den Task anhand der taskId
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    console.error("Task not found with id:", taskId);
    return;
  }

  // Überprüfe, ob die Subtask wirklich geändert oder gelöscht wurde
  if (inputSubtask.trim() !== "" && task.subtasks[subtaskIndex] !== inputSubtask) {
    // Wenn die Subtask geändert wurde, dann speichere die neue Subtask
    task.subtasks[subtaskIndex] = inputSubtask;
  } else {
    // Wenn die Subtask leer ist oder nicht verändert wurde, lösche sie
    deleteEditBoardSubtask(taskId, subtaskIndex);  // Löscht nur die Subtask, wenn sie leer ist oder entfernt wurde
  }

  // Render die Subtasks neu
  subtasksEditRender(taskId);

  // Schicke die aktualisierten Aufgaben an den Server
  putData(task.id, task);  // Verwendet task.id, um die PUT-Anfrage korrekt zu senden

  // Leere das Eingabefeld
  inputSubtask = "";
}




/**
 * Edits the Subtask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be edited
 */
function editBoardSubtask(taskId){
  document.getElementById(`edit-input-board-content${taskId}`).classList.remove('hidden');
  document.getElementById(`checkbox-edit-content${taskId}`).classList.add('hidden');
  document.getElementById(`subtasks-icon${taskId}`).classList.add('hidden');
  let subtaskInput = document.getElementById(`editInputBoard${taskId}`).value;
  let labelOfSubtask = document.getElementById(`subtask-edit-text${taskId}`);
  labelOfSubtask.innerHTML = subtaskInput;
}


/**
 * Deletes the Subtask at the specified index in the task list.
 * @param {number} taskIndex -The index of the task to be deleted.
 * @param {number} subtaskIndex - The index of the Subtask to be deleted.
*/
function deleteEditBoardSubtask(taskId, subtaskIndex) {
  // Finde die Aufgabe anhand der ID
  const task = tasks.find(t => t.id === taskId);

  if (task && Array.isArray(task.subtasks)) {  // Sicherstellen, dass die Aufgabe existiert und subtasks ein Array ist
    if (task.subtasks.length === 1) {
      // Wenn nur ein Subtask vorhanden ist, leere das Array
      task.subtasks = [];
    } else {
      // Ansonsten entferne das Subtask an der angegebenen Indexposition
      task.subtasks.splice(subtaskIndex, 1);
    }

    // Render die subtasks neu und speichere die geänderten Daten
    subtasksEditRender(taskId);
    
    // Hier gibst du nur den Task und nicht die Subtask-ID an die DELETE-Funktion weiter
    putData(`${taskId}`, task);  // Task-Daten aktualisieren, nicht löschen
  } else {
    console.error("Task not found or subtasks is not an array for taskId:", taskId);
  }
}




/**
 *  to open the edit-section by click the Icon of edit-subtask 
*/
function openEditSubtaskIcons(){
  document.getElementById('addTask-subtasks-edit-icons').classList.remove('d-none');
  document.getElementById('plus-edit-icon').classList.add('d-none');
}


/**
 *  to close the edit-section by click the Icon of close-eedit-subtask 
*/
function closeEditSubtaskIcons(){
  document.getElementById('addTask-subtasks-edit-icons').classList.add('d-none');
  document.getElementById('plus-edit-icon').classList.remove('d-none');
}

/**
 * to add the Subtask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be edited
 */
function addEditSubtasks(taskId) {
  let inputSubtask = document.getElementById(`addTask-edit-subtasks${taskId}`).value;

  if(inputSubtask.trim() === "") {
    return;
  } else {
    // Finde die Aufgabe anhand der ID
    const task = tasks.find(t => t.id === taskId);

    if (task) { // Stelle sicher, dass die Aufgabe gefunden wurde
      // Überprüfe, ob die subtasks ein Array sind, andernfalls initialisiere es
      if (!Array.isArray(task.subtasks)) {
        task.subtasks = [];
      }

      // Begrenze die Anzahl der Subtasks auf 2
      if (task.subtasks.length === 2) {
        task.subtasks.pop();  // Entferne das letzte Subtask
        task.subtasks.push(inputSubtask);  // Füge das neue Subtask hinzu
      } else {
        task.subtasks.push(inputSubtask);  // Füge das Subtask einfach hinzu
      }

      // Aktualisiere die Darstellung der Subtasks
      generateEditSubtask(taskId);

      // Schicke die aktualisierten Aufgaben zurück an den Server
      putData(task.id, task);  // Vergewissere dich, dass task.id übergeben wird

    } else {
      console.error("Task not found with id:", taskId);
    }

    // Leere das Eingabefeld nach der Bearbeitung
    inputSubtask = "";
    subtasksEditRender(taskId);  // Render die Subtasks neu
  }
}




/**
 * to generate Subtasks at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be edited
 */
function generateEditSubtask(taskId){
  // Finde die Aufgabe anhand der ID
  const task = tasks.find(t => t.id === taskId);
  
  if (task && Array.isArray(task.subtasks)) {  // Stelle sicher, dass die Aufgabe und subtasks existieren
    let list = document.getElementById('newSubtask');
    list.innerHTML = '';

    for (let i = 0; i < task.subtasks.length; i++) {
      list.innerHTML += `
        <div class="checkbox-edit-content">
          <div class="checkbox-show-content">
            <input type="checkbox" checked>
            <label class="subtask-show-text">${task.subtasks[i]}</label>
          </div>
          <div class="subtasks-icon subtasks-icon-hidden">
            <img onclick="editBoardSubtask(${taskId})" src="../img/edit.svg" alt="Bearbeiten">
            <div class="parting-line subtasks-icon-line"></div>
            <img onclick="deleteEditBoardSubtask(${taskId})" src="../img/delete.svg" alt="Delete">
          </div>
        </div> 
      `;
    }
  } else {
    console.error("Task not found or subtasks is not an array for taskId:", taskId);
  }
}



/**
 *  to Save the Task after processing
*/
async function saveEditTask() {
  let title = document.getElementById("addTask-edit-title").value;
  let hiddenInput = document.getElementById("hiddenInput").value;
  let description = document.getElementById("addTask-edit-description").value;
  let date = document.getElementById("task-edit-Date").value;
  
  if (title.trim() === "" || date.trim() === "") {
    return;
  } else {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title === hiddenInput) {
        tasks[i].title = title;
        tasks[i].description = description;
        tasks[i].date = date;
        tasks[i].prioIcon = prioBtn;
        tasks[i].prio = prioText;

        // Kontakte als IDs statt Objekten an Backend senden
        if (selectedEditContacts.length > 0) {
          tasks[i]["contacts"] = selectedEditContacts.map(contact => contact.id); // Nur die IDs
        }

        keepPrioButton(i);
        
        // Hier wird jetzt die Task-ID korrekt übergeben
        await putData(tasks[i].id, tasks[i]);  // Task-ID und die geänderten Daten übergeben
        break;
      }
    }
  }

  await updateHTML();
  await closeMe();
}





/**
 * to keep prio Button after Save a Task at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be edited
 */
function keepPrioButton(taskIndex){
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  if(/(\s|^)active(\s|$)/.test(urgentEditbutton.className)) {
   tasks[taskIndex]["prio"] = 'Urgent';
   tasks[taskIndex]["prioIcon"] = "../img/PrioAltaRed.svg";
  }else if(/(\s|^)active(\s|$)/.test(mediumEditbutton.className)){
    tasks[taskIndex]["prio"] = 'Medium';
    tasks[taskIndex]["prioIcon"] = "../img/PrioMediaOrange.svg";
  }else if(/(\s|^)active(\s|$)/.test(lowEditbutton.className)){
    tasks[taskIndex]["prio"] = 'Low';
    tasks[taskIndex]["prioIcon"] = '../img/PrioBajaGreen.svg';
  }else{
    tasks[taskIndex]["prio"] = '';
    tasks[taskIndex]["prioIcon"] = '';
  }
}


/** 
 * active Edit Buttons for Task 
*/
function activeEditButton() {
  let lastClick = null;
  urgentButtenEdit(lastClick);
  mediumButtonEdit(lastClick);
  lowButtonEdit(lastClick);
}


/**
 * to change color & Icon of the UrgentButton
 * @param {number} lastClick - to ckeck the last click-button
 */
function urgentButtenEdit(lastClick){
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  urgentEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.add("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.remove("active");
    lastClick = urgentEditbutton;
    prioText ='Urgent'
    prioIcon ='../img/PrioAltaWhite.svg';
    prioBtn ="../img/PrioAltaRed.svg";
    changeIconOfUrgent();
  });
}


/**
 * to change color & Icon of the MediumButton
 * @param {number} lastClick - to ckeck the last click-button
 */
function mediumButtonEdit(lastClick){
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  mediumEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.add("active");
    lowEditbutton.classList.remove("active");
    lastClick = mediumEditbutton;
    prioText = 'Medium';
    prioIcon = '../img/PrioMediaWhite.svg';
    prioBtn = '../img/PrioMediaOrange.svg';
    changeIconOfMedium();
  });
}


/**
 * to change color & Icon of the LowButton
 * @param {number} lastClick - to ckeck the last click-button
 */
function lowButtonEdit(lastClick){
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  lowEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.add("active");
    lastClick = lowEditbutton;
    prioText = 'Low';
    prioIcon = '../img/PrioBajaWhite.svg';
    prioBtn = '../img/PrioBajaGreen.svg';
    changeIconOfLow();
  });
}

/**
 * to show the color of the button after edit click
 * @param {number} taskIndex - The index of the task to be changed
 */
function activeButton(taskId){
  // Finde die Aufgabe mit der angegebenen taskId
  const task = tasks.find(t => t.id === taskId);

  if (task) {
    if (task.prio === "Low") {
      document.getElementsByClassName("low-edit-button")[0].classList.add("active");
      prioIcon = '../img/PrioBajaWhite.svg';
      changeIconOfLow();
      document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
      document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
    } else if (task.prio === "Urgent") {
      document.getElementsByClassName("urgent-edit-button")[0].classList.add("active");
      prioIcon = '../img/PrioAltaWhite.svg';
      changeIconOfUrgent();
      document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
      document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
    } else if (task.prio === "Medium") {
      document.getElementsByClassName("medium-edit-button")[0].classList.add("active");
      prioIcon = '../img/PrioMediaWhite.svg';
      changeIconOfMedium();
      document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
      document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
    } else {
      prio = '';
      prioBtn = '';
    }
  } else {
    console.error("Task not found!");
  }
}


/**
 * to change the color of urgent-Button
*/
function changeIconOfUrgent(){
  let urgent = document.getElementById('urgentImg');
  urgent.src = prioIcon;
  let medium = document.getElementById('mediumImg');
  medium.src = '../img/PrioMediaOrange.svg';
  let low = document.getElementById('lowImg');
  low.src = '../img/PrioBajaGreen.svg';
}


/**
 * to change the color of medium-Button
*/
function changeIconOfMedium(){
  let medium = document.getElementById('mediumImg');
  medium.src = prioIcon;
  let urgent = document.getElementById('urgentImg');
  urgent.src = '../img/PrioAltaRed.svg';
  let low = document.getElementById('lowImg');
  low.src = '../img/PrioBajaGreen.svg';
}


/**
 * to change the color of low-Button
*/
function changeIconOfLow(){
  let low = document.getElementById('lowImg');
  low.src = prioIcon;
  let medium = document.getElementById('mediumImg');
  medium.src = '../img/PrioMediaOrange.svg';
  let urgent = document.getElementById('urgentImg');
  urgent.src = '../img/PrioAltaRed.svg';
}