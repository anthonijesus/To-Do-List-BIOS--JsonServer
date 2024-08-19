//===============MANEJO DEL DOM==============
//FORMULARIO DE AGREGAR NUEVA TAREA
const formInput = document.querySelector("#IngresaTarea");
formInput.addEventListener("submit", saveTask);

//FORMULARIO DE EDITAR TAREA
const formEdit = document.querySelector("#editarTarea");
formEdit.addEventListener("submit", updateTask);

//FORMULARIO DE EDITAR TAREA
const closeForm = document.querySelector("#close");
closeForm.addEventListener("clic", closeFormEdit);

//Nombra la clave del LocalStorage
const LOCAL_STORAGE = "ToDoList";

function saveTask(event) {
  // 1. Evitar que la pagina se recarhe
  event.preventDefault();

  // 2. Capturar el elemento formulario
  const form = event.target;

  // 3. Capturar la información del formulario en FormData
  const formData = new FormData(form);

  // 4. Crear el objeto de la tarea usando el formData
  let task = {
    fecha: new Date().toLocaleDateString(),
    id: new Date().getTime(),
    tarea: "",
    status: false,
  };

  formData.forEach((value, key) => (task[key] = value));
  //console.log(task)

  if (task.tarea === "") {
          const alert = document.getElementById("alerta");
          const insertAlert = document.createElement("p");
        setTimeout(function() {
          document.getElementById('IngresaTarea').style.display = 'none';
          document.getElementById('alerta').style.display = 'flex';
          insertAlert.textContent = "No se ingreso ninguna tarea para registrar a la lista¡"; 
          alert.appendChild(insertAlert);
        }, 100);

        setTimeout(function() {
          document.getElementById('alerta').style.display = 'none';
          document.getElementById('IngresaTarea').style.display = 'flex';
          insertAlert.textContent = "";
        }, 1900);
  } else {
    //5. Almacenar el formulario en el local storage
    const taskLocalStorage = itemLocalStorage();
    const newTask = [...taskLocalStorage, task];
    saveLocalStorage(newTask);

    // 6. Limpiar el formulario
    form.reset();

    // 7. Listar las tareas previamente almacenadas
    displayTask(newTask);
  }
}

function displayTask(task) {
  const listTaskElement = document.querySelector("#listTask");

  const listTasksHtml = task.map((task) => {
    return `
              <li class="ListTaskHtml">
                <p id="fecha-${task.id}">${task.fecha}</p>
                <p class="tarea" id="tarea-${task.id}">${task.tarea}</p>
                <p class="status" id="status-${task.id}">${task.status ? "Completado" : "Pendiente"}</p>
                <p><input id="checkTarea-${task.id}" type="checkbox" /></p>
                <div class="iconos">
                <a onclick="deleteTarea('${task.id}')" id="borrarTarea-${task.id}"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></a>
                <a onclick="viewTaskEdit('${task.tarea}', '${task.id}')" id="editarTarea-${task.id}"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg></a>
                </div>
                
              </li>          
          `;
      });

  listTaskElement.innerHTML = listTasksHtml.join("");

  task.forEach((task) => {
    // Evento para marcar como completada una tarea
    const checkboxes = document.querySelector(`#checkTarea-${task.id}`);
    checkboxes.checked = task.status; //Selecciona el check en el HTML y dependiendo de su estado lo marca como pendiente o completado y checked o no

    //Cuando cambia el estado del checkbox actualiza el estado de la tarea en el localStorage (true o false)
    checkboxes.addEventListener("click", () => {
      checkTarea(task.id);
    });

    const cambiarEstiloTask = document.querySelector(`#tarea-${task.id}`); //Si el checkbox esta marcado le cambia el estilo a colorTarea para resaltar la tarea en la lista y el texto de completado
    const cambiarEstiloStatus = document.querySelector(`#status-${task.id}`);

    if (checkboxes.checked) {
      cambiarEstiloTask.className = "colorTarea";
      cambiarEstiloStatus.className = "colorStatus";
    }
  });
}

function viewTaskEdit(taskEdit, taskId){

  document.getElementById('IngresaTarea').style.display = 'none'; //Oculta el formulario de ingresar una nueva tarea
  document.getElementById('editarTarea').style.display = 'flex'; //Muestra el formulario de editar una tarea

  let tareaEditar = document.getElementById('tareaEdit');
  let tareaID = document.getElementById('tareaID');
  tareaEditar.value = taskEdit;
  tareaID.value = taskId;

}

function closeFormEdit(){
  document.getElementById('IngresaTarea').style.display = 'flex';
  document.getElementById('editarTarea').style.display = 'none';
}

//Actualiza las tareas
function updateTask(event){
  // 1. Evitar que la pagina se recarhe
  event.preventDefault();

  // 2. Capturar el elemento formulario
  const form = event.target;

  // 3. Capturar la información del formulario en FormData
  const formData = new FormData(form);

  const task = {};

  formData.forEach((value, key) => (task[key] = value));

    if(task.tarea != null && task.tarea!= ''){

      let tareas = itemLocalStorage();
      
      tareas.forEach((taskStorage) => {
        
        if(taskStorage.id === Number(task.id)){
          taskStorage.tarea = task.tarea;
        }

      })

      saveLocalStorage(tareas);
      displayTask(tareas);
      form.reset();
      
      document.getElementById('IngresaTarea').style.display = 'flex';
      document.getElementById('editarTarea').style.display = 'none';

    } else {
      alert('No ingresaste ninguna tarea para editar')
    }
  
}


function checkTarea(param){
  
  let tareas = itemLocalStorage();

  tareas.forEach((task) => {
    
    if(task.id === param){
      task.status =!task.status;
    }
  })
    saveLocalStorage(tareas);

    displayTask(tareas);
}

function deleteTarea(taskId) {

  let confirmar = confirm(
    "¿Seguro que desea borrar esta tarea? " + taskId
  );

    if (!confirmar) return

      const taskStorage = itemLocalStorage();
      
      const newsTask = taskStorage.filter((task) => task.id !== Number(taskId));
      
    if (newsTask) {
      alert("Tarea borrada correctamente.");
      saveLocalStorage(newsTask);
      displayTask(newsTask);
    } else {
      alert("No se pudo borrar la tarea.");
    }
  
}

function itemLocalStorage() {
  let task = localStorage.getItem(LOCAL_STORAGE);
  if (!task) {
    saveLocalStorage([]);
    return [];
  }
  return JSON.parse(task);
}

function saveLocalStorage(task) {
  localStorage.setItem(LOCAL_STORAGE, JSON.stringify(task));
}



//MANEJO DE EVENTOS AL CARGAR LA PAGINA
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar las tareas almacenadas en el local storage
  const task = itemLocalStorage();
  
  displayTask(task);

  
});