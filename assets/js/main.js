function app() {
    const formulario  = document.querySelector('.form');
    const inputTarefa = formulario.querySelector('.tarefa');
    const btn         = formulario.querySelector('.btn');
    const tarefasUl   = document.querySelector('.tarefas');
    const inputEdicao = document.getElementById('input-edicao');
    const modal       = document.getElementById('modal-editar');
    const btnSalvar   = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');

    let liAtual = null;  // Referência à tarefa sendo editada

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

    function criaBotaoEditar(li) {
        const botao = document.createElement('button');
        botao.className = 'editar';
        botao.title = 'Editar esta tarefa';

        const icone = document.createElement('i');
        icone.classList.add('fas', 'fa-pen', 'fa-lg');

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

        const dataAtual = new Date().toLocaleString('pt-BR');
        li.setAttribute('data-criacao', dataAtual);

        // Cria uma badge com status concluída (inicialmente invisível)
        const badge = criaBadgeConcluida();
        li.appendChild(badge);

        criaBotaoEditar(li);
        criaBotaoApagar(li)
        tarefasUl.appendChild(li);
        limparCampo();
    }

    function editaTarefas(e) {
        const botaoEditar = e.target.closest('.editar');
        if (!botaoEditar) return;

        liAtual = botaoEditar.closest('li');
        const texto = liAtual.querySelector('.texto-tarefa');
        inputEdicao.value = texto.innerText;

        const dataCriacaoEl = document.querySelector('.data-criacao');
        dataCriacaoEl.innerHTML = `<p>📆 Data criação: ${liAtual.getAttribute('data-criacao')}</p>`;

        const dataConclusaoEl = document.querySelector('.data-conclusao');
        if (liAtual.hasAttribute('data-conclusao')) {
            const dataConclusao = liAtual.getAttribute('data-conclusao');
            dataConclusaoEl.innerHTML = `<p>✅ Data de conclusão: <b>${dataConclusao}</b></p>`;
            dataConclusaoEl.style.color = 'red';
        } else {
            dataConclusaoEl.innerHTML = '';
        }

        modal.style.display = 'flex';
    }

    function eliminaTarefas(e) {
        const botao = e.target.closest('.apagar');
        if (!botao) return;

        const li = botao.closest('li');
        if (li) li.remove();
    }

    function salvaEdicaoModal() {
        if (liAtual) {
            const texto = liAtual.querySelector('.texto-tarefa');
            const valor = inputEdicao.value.trim();
            if (!valor) {
                alert('Ops! Parece que você esqueceu de digitar a tarefa.');
                return;
            }

            texto.innerText = valor;
            modal.style.display = 'none';
            liAtual = null;
        }
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

                if (item.classList.contains('concluida')) {
                    const dataConclusao = new Date().toLocaleString('pt-BR');
                    item.setAttribute('data-conclusao', dataConclusao);
                } else {
                    item.removeAttribute('data-conclusao');
                }
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
        editaTarefas(e);
    });

    btnSalvar.addEventListener('click', function () {
        salvaEdicaoModal();
    });

    inputEdicao.addEventListener('keypress', function (e) {
        if (e.code === 'Enter') {
            salvaEdicaoModal();
        }
    });

    btnCancelar.addEventListener('click', function () {
        modal.style.display = 'none';
        liAtual = null;
    });
}

app();