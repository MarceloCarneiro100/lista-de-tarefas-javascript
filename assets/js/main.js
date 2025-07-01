
function app() {
    const formulario  = document.querySelector('.form');
    const inputTarefa = formulario.querySelector('.tarefa');
    const btn         = formulario.querySelector('.btn');
    const tarefasUl   = document.querySelector('.tarefas');
    const inputEdicao = document.getElementById('input-edicao');
    const modal       = document.getElementById('modal-editar');
    const btnSalvar   = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const inputBusca  = document.getElementById('input-busca');
    const filtroStatus = document.getElementById('filtro-status');
    const inputPrioridade = document.getElementById('input-prioridade');
    const selectEdicaoPrioridade = document.getElementById('select-edicao-prioridade');
    const filtroPrioridade =  document.getElementById('filtro-prioridade');

    const nomesPrioridades = {
        baixa: 'Baixa',
        media: 'Média',
        alta: 'Alta'
    }

    let liAtual = null;  // Referência à tarefa sendo editada

    function criaLi() {
        const li = document.createElement('li');
        return li;
    }

    function criaBolinhaPrioridade(nivel) {
        const bolinha = document.createElement('span');
        bolinha.classList.add('bolinha-prioridade', nivel);
        bolinha.title = `Prioridade: ${nomesPrioridades[nivel]}`;
        return bolinha;
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

    function montaTarefa({ texto, prioridade, concluida, criacao, conclusao }) {
        const li = criaLi();
        li.setAttribute('data-prioridade', prioridade);

        li.classList.add('item-tarefa');
        if (concluida) li.classList.add('concluida');
        li.setAttribute('data-criacao', criacao);
        if (conclusao) li.setAttribute('data-conclusao', conclusao);

        // texto
        const span = document.createElement('span');
        span.className = 'texto-tarefa';
        span.innerText = texto;
        span.title = concluida
            ? 'Clique para reabrir a tarefa'
            : 'Clique para marcar como concluída';

        span.classList.add('animada');
        setTimeout(() => span.classList.remove('animada'), 300);

        li.appendChild(span);

        // badge, botões, ícones, etc
        const badge = criaBadgeConcluida();
        li.appendChild(badge);

        const containerBotoes = criaContainerBotoes();
        li.appendChild(containerBotoes);

        if (concluida) {
            const icone = document.createElement('i');
            icone.classList.add('fas', 'fa-check-circle', 'icone-check');
            icone.style.color = 'green';
            icone.style.marginRight = '8px';
            li.insertBefore(icone, li.firstChild);
        }

        const bolinha = criaBolinhaPrioridade(prioridade);
        li.insertBefore(bolinha, li.firstChild);

        tarefasUl.insertBefore(li, tarefasUl.firstChild);
        return li;
    }

    function criaTarefas(texto) {
        const prioridade = inputPrioridade.value;
        const tarefa = {
            texto,
            prioridade,
            concluida: false,
            criacao: new Date().toLocaleString('pt-BR'),
            conclusao: null
        };

        montaTarefa(tarefa);
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

        const prioridade = liAtual.getAttribute('data-prioridade') || 'media';
        selectEdicaoPrioridade.value = prioridade;

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

            const novaPrioridade = selectEdicaoPrioridade.value;
            liAtual.setAttribute('data-prioridade', novaPrioridade);

            const bolinha = liAtual.querySelector('.bolinha-prioridade');
            if (bolinha) {
                bolinha.className = `bolinha-prioridade ${novaPrioridade}`;
                bolinha.title = `Prioridade: ${nomesPrioridades[novaPrioridade]}`;
            }

            salvarTarefasNoLocalStorage();
            aplicarBuscaEFiltro();
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
        aplicarBuscaEFiltro();
    }

    function salvarTarefasNoLocalStorage() {
        const tarefas = [...document.querySelectorAll('.item-tarefa')].map(li => ({
            texto: li.querySelector('.texto-tarefa').innerText,
            prioridade: li.getAttribute('data-prioridade') || 'media',
            concluida: li.classList.contains('concluida'),
            criacao: li.getAttribute('data-criacao'),
            conclusao: li.getAttribute('data-conclusao') || null
        }));
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function carregaTarefasDoLocalStorage() {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.reverse().forEach(montaTarefa);
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
        const prioridade = li.getAttribute('data-prioridade');
        const criacao = li.getAttribute('data-criacao') || '---';
        const conclusao = li.getAttribute('data-conclusao') || '---';
        const duracao = li.getAttribute('data-conclusao')
            ? calcularDuracaoComDayjs(criacao, conclusao)
            : '---';
        return { tarefa, prioridade, criacao, conclusao, duracao };
    }

    function renderizarInfoModal({ tarefa, prioridade, criacao, conclusao, duracao }) {
        document.querySelector('#modal-info .info-tarefa').innerHTML =
            `<p><em>${tarefa}</em></p>`;
        document.querySelector('#modal-info .info-prioridade').innerHTML =
            `<p><strong>🔥 Prioridade: </strong><span class="prioridade-texto ${prioridade}">${nomesPrioridades[prioridade]}</span></p>`
        document.querySelector('#modal-info .info-criacao').innerHTML =
            `<p><strong>📅 Criada:</strong> ${criacao}</p>`;
        document.querySelector('#modal-info .info-conclusao').innerHTML =
            `<p><strong>✅ Concluída:</strong> ${conclusao}</p>`;
        document.querySelector('#modal-info .info-duracao').innerHTML =
            `<p><strong>⌚ Duração:</strong> ${duracao}</p>`;
        document.getElementById('modal-info').classList.add('ativo');
    }

    function aplicarBuscaEFiltro() {
        const termo = inputBusca.value.trim().toLowerCase();
        const status = filtroStatus.value;
        const prioridadeSelecionada = filtroPrioridade.value;

        const tarefas = document.querySelectorAll('.item-tarefa');

        tarefas.forEach(tarefa => {
            const texto = tarefa.querySelector('.texto-tarefa').innerText.toLowerCase();
            const concluida = tarefa.classList.contains('concluida');
            const prioridade = tarefa.getAttribute('data-prioridade');

            const correspondeTexto = texto.includes(termo);
            const correspondeStatus =
                status === 'todas' ||
                (status === 'concluidas' && concluida) ||
                (status === 'pendentes' && !concluida);

            const correspondePrioridade = prioridadeSelecionada === 'todas' || prioridadeSelecionada === prioridade;

            tarefa.style.display = correspondeTexto && correspondeStatus && correspondePrioridade 
            ? 'flex' : 'none';
        });
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

    filtroStatus.addEventListener('change', aplicarBuscaEFiltro);
    filtroPrioridade.addEventListener('change', aplicarBuscaEFiltro);
    inputBusca.addEventListener('input', aplicarBuscaEFiltro);


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
