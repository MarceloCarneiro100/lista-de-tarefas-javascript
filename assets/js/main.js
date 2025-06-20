function app() {
    const formulario = document.querySelector('.form');
    const inputTarefa = formulario.querySelector('.tarefa');
    const btn = formulario.querySelector('.btn');
    const tarefasUl = document.querySelector('.tarefas');


    function criaLi() {
        const li = document.createElement('li');
        return li;
    }

    function criaBotaoApagar(li) {
        const botao = document.createElement('button');
        botao.className = 'apagar';
        botao.title = 'Apagar esta tarefa';

        const icone = document.createElement('i');
        icone.classList.add('fas', 'fa-trash', 'fa-lg')

        botao.appendChild(icone);
        li.appendChild(botao);
    }

    function limparCampo() {
        inputTarefa.value = '';
        inputTarefa.focus();
    }

    function criaTarefas(input) {
        const li = criaLi();
        li.classList.add('item-tarefa');

        const span = document.createElement('span');
        span.classList.add('texto-tarefa');
        span.innerText = input;

        li.appendChild(span);
        criaBotaoApagar(li)
        tarefasUl.appendChild(li);
        limparCampo();
    }

    function eliminaTarefas(e) {
        const botao = e.target.closest('.apagar');
        if (!botao) return;

        const li = botao.closest('li');
        if (li) li.remove();
    }

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const valor = inputTarefa.value.trim();
        if (!valor) return;
        criaTarefas(valor);
    });

    tarefasUl.addEventListener('click', function (e) {
        eliminaTarefas(e);
    });
}


app();