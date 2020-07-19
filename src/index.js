const db = firebase.firestore(); //VARIABLE OBTAINED FROM FIRESTONE

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('get-tasks');

//Variable que indica el estado del formulario inicial.
let editStatus = false;
let id = ''; //ID inicial de la tarea (1)

//FUNCTION FOR SAVE DATA IN THE DATABASE-FIREBASE
const saveTask = (title, description) =>
    db.collection('tasks').doc().set({
        title,
        description
    });

//Trae desde firebase toda la collección de datos
const getTask = () => db.collection('tasks').get();

//Función que se maneja siempre que exista cambios nuevos en la BD
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

//Elimina la tarea de la colección
const deleteTask = id => db.collection('tasks').doc(id).delete();

//Obteniedo una colección de la base de datos por medio del ID
const getTaskId = id => db.collection('tasks').doc(id).get();

//Obtiene la colección y la actualiza.
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async(e) => {
    //const querySnapshot = await getTask(); //Obtiene los datos de la BD siempre que se actualice la página.
    //querySnapshot -> Contiene toda la colección de datos de la BD

    //Actualiza los datos que se muestran en pantalla al instante
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = ''; //Limpia el contenedor con los datos
        querySnapshot.forEach(doc => {
            console.log(doc.data()); //Muestra la colección de datos de manera legible

            const task = doc.data();
            task.id = doc.id; //Obtiene el ID de la colección
            console.log(task.id);

            taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <div>
            <button class="btn btn-danger btn-delete" data-id="${task.id}">Delete</button>
            <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
        </div>
        </div>`;

            //Seleccionando todos los botones y escuchando cada uno por separado con la propiedad click
            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    //console.log(e.target.dataset.id); //Obtiene el ID de la colección siempre que se presione el botón Delete.
                    try {
                        await deleteTask(e.target.dataset.id); //Elimina las colecciones uno por uno
                    } catch (error) {
                        console.log(error);
                    }
                })
            })

            //Permite editar los valores
            const btnEdit = document.querySelectorAll('.btn-edit');
            btnEdit.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    try {
                        const doc = await getTaskId(e.target.dataset.id); //Trae todos los objetos d ela colección
                        const task = doc.data(); //console.log(doc.data()); //Imprime la info de la colección-objeto

                        taskForm['task-title'].value = task.title; //Imprime los valores en el formulario para poder editarlo
                        taskForm['task-description'].value = task.description;

                        editStatus = true; //Cambia el estado inicial
                        id = doc.id; //Guarda el ID de la tarea (1)
                        taskForm['btnSend'].innerText = "Update"; //Cambia el texto del botón de SEND a UPDATE 
                    } catch (error) {
                        console.log(error);
                    }
                })
            })
        }); //Recorre el objeto dado por firebase 
    });
});

function reset() {
    taskForm.reset();
    title.focus();
}

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const title = taskForm['task-title']; //Es el elemento-entero
    const description = taskForm['task-description'];

    try {
        if (!editStatus) {
            //RECEIVED DATA FOR SAVE IN THE DB
            await saveTask(title.value, description.value);

            reset();
        } else {
            //RECEIVED ID AND updateTask(TITLE, DESCRIPTION)
            await updateTask(id, {
                    title: title.value,
                    description: description.value
                }) //Elemento-valor

            /**Regresa el formulario a su estado inicial después de actualizar un tarea*/
            editStatus = false;
            id = '';
            taskForm['btnSend'].innerText = 'Save';

            reset();
        }
    } catch (error) {
        console.log(error);
    }
});