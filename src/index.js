const taskForm = document.querySelector('#task-form');

taskForm.addEventListener('submit', e => {
    const title = taskForm['task-title'].value;
    const description = taskForm['task-description'].value;

    console.log(title, description);

    e.preventDefault();
});