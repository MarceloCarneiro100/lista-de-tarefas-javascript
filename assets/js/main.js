
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

    function criaContainerBotoes() {
        const container = document.createElement('div');
        container.classList.add('botoes-acoes');

        criaBotaoEditar(container);
        criaBotaoApagar(container);
        criaBotaoDetalhar(container);

        return container;
    }

    function criaBotaoApagar(container) {
        const botao = document.createElement('button');
        botao.className = 'apagar';
        botao.title = 'Apagar esta tarefa';

        const icone = document.createElement('i');
        icone.classList.add('fas', 'fa-trash', 'fa-lg')

        botao.appendChild(icone);
        container.appendChild(botao);
    }

    function criaBotaoEditar(container) {
        const botao = document.createElement('button');
        botao.className = 'editar';
        botao.title = 'Editar esta tarefa';

        const icone = document.createElement('i');
        icone.classList.add('fas', 'fa-pen', 'fa-lg');

        botao.appendChild(icone);
        container.appendChild(botao);
    }

    function criaBotaoDetalhar(container) {
         const botao = document.createElement('button');
         botao.className = 'detalhar';
         botao.title = 'Ver detalhes da tarefa';
         botao.innerHTML = '<i class="fas fa-info-circle"></i>';
         container.appendChild(botao);
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

        span.classList.add('animada');
        setTimeout(() => span.classList.remove('animada'), 300);

        const dataAtual = new Date().toLocaleString('pt-BR');
        li.setAttribute('data-criacao', dataAtual);

        // Cria uma badge com status concluída (inicialmente invisível)
        const badge = criaBadgeConcluida();
        li.appendChild(badge);

        const containerBotoes = criaContainerBotoes();
        li.appendChild(containerBotoes);
        tarefasUl.appendChild(li);
        limparCampo();

        salvarTarefasNoLocalStorage();
    }

    function abrirModal() {
        modal.classList.add('ativo');
    }

    function fecharModal() {
        modal.classList.remove('ativo');
        liAtual = null;
    }

    function editaTarefas(e) {
        const botaoEditar = e.target.closest('.editar');
        if (!botaoEditar) return;

        liAtual = botaoEditar.closest('li');
        const texto = liAtual.querySelector('.texto-tarefa');
        inputEdicao.value = texto.innerText;

        abrirModal();
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

            // Efeito visual após salvar
            texto.classList.add('animada');
            setTimeout(() => texto.classList.remove('animada'), 300);

            salvarTarefasNoLocalStorage();
            fecharModal();
        }
    }

    function tornaTarefasConcluidas(e) {
        const item = e.target.closest('.item-tarefa');

        if (!item) return;

        item.classList.toggle('concluida');
        const texto = e.target.closest('.texto-tarefa');

        texto.title = item.classList.contains('concluida')
            ? 'Clique para reabrir a tarefa'
            : 'Clique para marcar como concluída';

        const duracaoEl = document.querySelector('#modal-info .info-duracao');

        if (item.classList.contains('concluida')) {

            const dataCriacao = item.getAttribute('data-criacao');
            const dataConclusao = new Date().toLocaleString('pt-BR');
            item.setAttribute('data-conclusao', dataConclusao);

            const duracaoMs = parseDataBR(dataConclusao) - parseDataBR(dataCriacao);
            item.setAttribute('data-duracao', duracaoMs.toString());

            if (duracaoEl) {
                duracaoEl.innerHTML = `<p>⌚ Duração: <b>${calcularDuracaoComDayjs(dataCriacao, dataConclusao)}</b></p>`;
            }

            // Adiciona ícone visual
            if (!item.querySelector('.icone-check')) {
                const icone = document.createElement('i');
                icone.classList.add('fas', 'fa-check-circle', 'icone-check');
                icone.style.color = 'green';
                icone.style.marginRight = '8px';
                item.insertBefore(icone, item.firstChild);
            }

        } else {
            item.removeAttribute('data-conclusao');
            item.removeAttribute('data-duracao');

            if (duracaoEl) duracaoEl.innerHTML = ''

            // Remove ícone
            const icone = item.querySelector('.icone-check');
            if (icone) icone.remove();
        }
        salvarTarefasNoLocalStorage();
    }

    function salvarTarefasNoLocalStorage() {
        const tarefas = [...document.querySelectorAll('.item-tarefa')].map(li => ({
            texto: li.querySelector('.texto-tarefa').innerText,
            concluida: li.classList.contains('concluida'),
            criacao: li.getAttribute('data-criacao'),
            conclusao: li.getAttribute('data-conclusao')
        }));
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function carregaTarefasDoLocalStorage() {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

        tarefas.forEach(tarefa => {
            const li = criaLi();
            li.classList.add('item-tarefa');
            if(tarefa.concluida) {
                li.classList.add('concluida');
                li.setAttribute('data-conclusao', tarefa.conclusao);
            }
            li.setAttribute('data-criacao', tarefa.criacao);

            const span = document.createElement('span');
            span.classList.add('texto-tarefa');
            span.innerText = tarefa.texto;
            span.title = tarefa.concluida
                ? 'Clique para reabrir a tarefa'
                : 'Clique para marcar como concluída';
            li.appendChild(span);

            const badge = criaBadgeConcluida();
            li.appendChild(badge);

            const containerBotoes = criaContainerBotoes();
            li.appendChild(containerBotoes);

            if(tarefa.concluida) {
                const icone = document.createElement('i');
                icone.classList.add('fas', 'fa-check-circle', 'icone-check');
                icone.style.color = 'green';
                icone.style.marginRight = '8px';
                li.insertBefore(icone, li.firstChild);
            }

            tarefasUl.appendChild(li);
        });
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

    function obterInfoTarefa(li) {
        const tarefa = li.querySelector('.texto-tarefa').innerText;
        const criacao = li.getAttribute('data-criacao') || '---';
        const conclusao = li.getAttribute('data-conclusao') || '---';
        const duracao = li.getAttribute('data-conclusao')
            ? calcularDuracaoComDayjs(criacao, conclusao)
            : '---';
        return { tarefa, criacao, conclusao, duracao };
    }

    function renderizarInfoModal({ tarefa, criacao, conclusao, duracao }) {
        document.querySelector('#modal-info .info-tarefa').innerHTML = 
        `<p><em>${tarefa}</em></p>`
        document.querySelector('#modal-info .info-criacao').innerHTML =
            `<p><strong>📅 Criada:</strong> ${criacao}</p>`;
        document.querySelector('#modal-info .info-conclusao').innerHTML =
            `<p><strong>✅ Concluída:</strong> ${conclusao}</p>`;
        document.querySelector('#modal-info .info-duracao').innerHTML =
            `<p><strong>⌚ Duração:</strong> ${duracao}</p>`;
        document.getElementById('modal-info').classList.add('ativo');
    }

    tarefasUl.addEventListener('click', function (e) {
        const botaoApagar = e.target.closest('.apagar');
        const botaoEditar = e.target.closest('.editar');
        const botaoDetalhar = e.target.closest('.detalhar');
        const item = e.target.closest('.item-tarefa');

        if (!item) return;

        if (botaoApagar) {
            item.remove();
            salvarTarefasNoLocalStorage();
        } else if (botaoEditar) {
            editaTarefas(e);
        } else if (botaoDetalhar) {
            renderizarInfoModal(obterInfoTarefa(item));
        } else if (e.target.classList.contains('texto-tarefa')) {
            tornaTarefasConcluidas(e);
        }
    });

    btnSalvar.addEventListener('click', function () {
        salvaEdicaoModal();
    });

    inputEdicao.addEventListener('keypress', function (e) {
        if (e.code === 'Enter' || e.key == 'Enter') {
            salvaEdicaoModal();
        }
    });

    btnCancelar.addEventListener('click', function () {
        fecharModal();
    });

    function registrarFechamentoModal(idModal, idBotaoFechar) {
        const botao = document.getElementById(idBotaoFechar);
        const modal = document.getElementById(idModal);

        if (botao && modal) {
            botao.addEventListener('click', () => {
                modal.classList.remove('ativo');
            });
        }
    }

    registrarFechamentoModal('modal-editar', 'btn-fechar-edicao');
    registrarFechamentoModal('modal-editar', 'btn-cancelar');
    registrarFechamentoModal('modal-info', 'btn-fechar-info');
    registrarFechamentoModal('modal-info', 'btn-cancelar-info');

    carregaTarefasDoLocalStorage();
}

app();
