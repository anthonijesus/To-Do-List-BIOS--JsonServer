//Nombra la clave del LocalStorage
const LOCAL_STORAGE = "ToDoList";

//========Guarda las tareas en el localStorage=============//
function saveLocalStorage(task) {
  localStorage.setItem(LOCAL_STORAGE, JSON.stringify(task));
}
//*********************************************************//

//========Trae las tareas almacenadas en el localStorage=============//
function itemLocalStorage() {

  let tasks = fetch('http://localhost:3000/tasks', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    return data;
  })
  .catch(error => console.error('Error:', error));
  return tasks;
}
//********************************************************************//

//===============MANEJO DE EVENTOS AL CARGAR LA PAGINA==============//
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar las tareas almacenadas en el local storage
  itemLocalStorage().then(tasks => {
    displayTask(tasks);
  });
  
});
//********************************************************************/


//========Renderiza en pantalla las tareas almacenadas en el localStorage=============//
function displayTask(task) {

  const listTaskElement = document.querySelector("#listTask"); //Selecciona el <ul> que contendrá la lista de tareas

  const listTasksHtml = task.map((task) => {
    return `
            <li>
              <p id="fecha-${task.id}">${task.fecha}</p>
              <p class="tarea" id="tarea-${task.id}">${task.tarea}</p>
              <p class="status" id="status-${task.id}">${task.status ? "Completado" : "Pendiente"}</p> <!--Operador ternario para visualizar completado si está true en el localStorage-->
              <p><input id="checkTarea-${task.id}" type="checkbox" /></p>
              <div class="iconos">
                <a onclick="deleteTarea('${task.id}')" id="borrarTarea-${task.id}"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></a>
                <a onclick="viewTaskEdit('${task.tarea}', '${task.id}')" id="editarTarea-${task.id}"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg></a>
              </div>
            </li>          
          `;
        });

  listTaskElement.innerHTML = listTasksHtml.join("");

  
//======Recorre la lista de tareas renderizadas en la pantalla para interactar con ellas, marcarlas como completadas, cambiar el color, tachar las completas.
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

//********************Función para marcar las tareas como completadas**********************//
function checkTarea(param) {
  itemLocalStorage().then(tasks => {
    tasks.forEach(task => {
      if (task.id === param) {
        //console.log(param);
        //console.log(task.id);
        task.status = !task.status;
      }
    });
  
    const taskToUpdate = tasks.find(task => task.id === param);
    
    fetch(`http://localhost:3000/tasks/${param}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskToUpdate)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      //console.log('Updated task:', data);
      itemLocalStorage().then(updatedTasks => {
        displayTask(updatedTasks);
      });
    })
    .catch(error => console.error('Error:', error));
  });
}

//*****************************************************************************************//


//Selecciona el formulario de agregar nuevas tareas
const formInput = document.querySelector("#IngresaTarea").addEventListener("submit", saveTask);
//***************************************************************************************** */

//**********************Guarda las nuevas tareas en el localStorage***************************
function saveTask(event) {

  event.preventDefault();
  const form = event.target;

  const formData = new FormData(form);
  
  let task = {
    fecha: new Date().toLocaleDateString(),
    id: new Date().getTime().toString(),
    tarea: "",
    status: false,
  };

  //Recorre el objeto Formdata y por cada elemento del HTML asigna en pares clave y valor
  formData.forEach((value, key) => (task[key] = value));

  // 5. Hacer la petición POST para guardar la nueva tarea
  fetch(`http://localhost:3000/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task) // Enviando todo el objeto 'task'
  })
  .then(response => response.json())
  .then(data => {
    itemLocalStorage().then(data => {
      displayTask(data);
    }); 
    
  })
  .catch(error => console.error('Error:', error));

  form.reset();
  // 7. Volver a listar las tareas después de guardar
  
}
//**************************************************************************************************** */

//Cierra el formulario de edición de tareas
const closeForm = document.querySelector("#close").addEventListener("clic", closeFormEdit);
  
//Función muestra el formulario de edición
function viewTaskEdit(taskEdit, taskId) {
  document.getElementById("IngresaTarea").style.display = "none"; //Oculta el formulario de ingresar una nueva tarea
  document.getElementById("editarTarea").style.display = "flex"; //Muestra el formulario de editar una tarea
  let tareaEditar = document.getElementById("tareaEdit");
  let tareaID = document.getElementById("tareaID");
  tareaEditar.value = taskEdit;
  tareaID.value = taskId;
}


//Función para cerrar el formulario de editar las tareas
function closeFormEdit() {
  document.getElementById("IngresaTarea").style.display = "flex";
  document.getElementById("editarTarea").style.display = "none";
}

//Selecciona el formulario de editar las tareas y a su vez cuando se hace el submit llama la funcion de updateTask.
//Actualiza las tareas
document.querySelector("#botonEdit").addEventListener("click", updateTask);
function updateTask() {
  let tareaEditar = document.getElementById("tareaEdit").value;
  let tareaID = document.getElementById("tareaID").value;

  if (tareaEditar != null && tareaEditar != "") {

      itemLocalStorage().then(tasks => {
        
        tasks.forEach(taskk => {

          if (taskk.id === tareaID) {
            taskk.tarea = tareaEditar;
            }
          });
      
        const taskUpdated = tasks.find(taskk => taskk.id === tareaID);
        
        fetch(`http://localhost:3000/tasks/${tareaID}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskUpdated) // Enviar solo la tarea 
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          //console.log('Updated task:', data);
          itemLocalStorage().then(updatedTasks => {
            displayTask(updatedTasks);
          });
        })
        .catch(error => console.error('Error:', error));
      });
  
    

    document.getElementById("IngresaTarea").style.display = "flex";
    document.getElementById("editarTarea").style.display = "none";
  } else {
    alert("No ingresaste ninguna tarea para editar");
  }
}


//*************************Función para borrar las tareas*******************************************//
function deleteTarea(taskId) {
  let confirmar = confirm("¿Seguro que desea borrar esta tarea? " + taskId);

  if (!confirmar) return;

  fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'DELETE'
  })
   .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
   .then(data => {
    //console.log('Deleted task:', data);
      itemLocalStorage().then(updatedTasks => {
        displayTask(updatedTasks);
      });
    })
   .catch(error => console.error('Error:', error));


  /*const taskStorage = itemLocalStorage();

  const newsTask = taskStorage.filter((task) => task.id !== Number(taskId)); //Devuelve un nuevo array con todas las  tareas menos la que coincide con el id que pasamos por parametro

  if (newsTask) {
    alert("Tarea borrada correctamente.");
    saveLocalStorage(newsTask);
    displayTask(newsTask);
  } else {
    alert("No se pudo borrar la tarea.");
  }*/
}




