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

    function criaBadgeConcluida() {
        const badge = document.createElement('span');
        badge.classList.add('badge');
        badge.innerText = "Concluída";
        return badge;
    }

    function criaTarefas(input) {
        const li = criaLi();
        li.classList.add('item-tarefa');

        const span = document.createElement('span');
        span.classList.add('texto-tarefa');
        span.innerText = input;
        span.title = 'Clique para marcar como concluída';
        li.appendChild(span);

        // Cria uma badge com status concluída (inicialmente invisível)
        const badge = criaBadgeConcluida();
        li.appendChild(badge);

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

    function tornaTarefasConcluidas(e) {
        const item = e.target.closest('.item-tarefa');

        if (item && e.target.classList.contains('texto-tarefa')) {
            item.classList.toggle('concluida');
            const texto = item.querySelector('.texto-tarefa');

            if (texto) {
                texto.title = item.classList.contains('concluida')
                    ? 'Clique para reabrir a tarefa'
                    : 'Clique para marcar como concluída';
            }
        }
    }

    // Cria uma tarefa ao pressionar a tecla ENTER na caixa de texto
    inputTarefa.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            const valor = inputTarefa.value.trim();
            if (!valor) return;
            criaTarefas(valor);
        }
    });

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const valor = inputTarefa.value.trim();
        if (!valor) return;
        criaTarefas(valor);
    });

    tarefasUl.addEventListener('click', function (e) {
        eliminaTarefas(e);
        tornaTarefasConcluidas(e);
    });
}


app();