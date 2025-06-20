function app() {
    const formulario = document.querySelector('.form');
    const inputTarefa = formulario.querySelector('.tarefa');
    const btn = formulario.querySelector('.btn');
    const tarefasUl = document.querySelector('.tarefas');


    function criaLi() {
        const li = document.createElement('li');
        return li;
    }

    function criaTarefas(input) {
        const li = criaLi();
        li.innerText = input;
        tarefasUl.appendChild(li);
    }

    btn.addEventListener('click', function (e) {
         e.preventDefault();
         const valor = inputTarefa.value.trim();
         if(!valor) return;
         criaTarefas(valor);
    });
}


app();