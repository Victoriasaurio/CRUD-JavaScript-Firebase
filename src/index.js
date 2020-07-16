const db = firebase.firestore(); //VARIABLE OBTAINED FROM FIRESTONE

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('get-tasks');

//SAVE DATA IN THE DATABASE-FIREBASE
const saveTask = (title, description) =>
    db.collection('tasks').doc().set({
        title,
        description
    });

//Trae desde firebase toda la collección de datos
const getTask = () => db.collection('tasks').get();

//Función que se maneja siempre que exista cambios nuevos en la BD
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

window.addEventListener('DOMContentLoaded', async(e) => {
    //const querySnapshot = await getTask(); //Obtiene los datos de la BD siempre que se actualice la página.
    //querySnapshot -> Contiene toda la colección de datos de la BD

    //Actualiza los datos que se muestran en pantalla al instante
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = ''; //Limpia el contenedor con los datos
        querySnapshot.forEach(doc => {
            console.log(doc.data()); //Muestra la colección de datos de manera legible

            const task = doc.data();

            taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <div>
            <button class="btn btn-danger">Delete</button>
            <button class="btn btn-secondary">Edit</button>
        </div>
        </div>`
        }); //Recorre el objeto dado por firebase 
    });
});

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    //RECEIVED DATA FOR SAVE IN THE DB
    await saveTask(title.value, description.value);

    //Actualizar las lista de tareas siempre que exista cambios

    taskForm.reset();
    title.focus();

    console.log(title, description);
});