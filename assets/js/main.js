
function app() {
    const formulario = document.querySelector('.form');
    const inputTarefa = formulario.querySelector('.tarefa');
    const btn = formulario.querySelector('.btn');
    const tarefasUl = document.querySelector('.tarefas');
    const inputEdicao = document.getElementById('input-edicao');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const inputBusca = document.getElementById('input-busca');
    const filtroStatus = document.getElementById('filtro-status');
    const inputPrioridade = document.getElementById('input-prioridade');
    const selectEdicaoPrioridade = document.getElementById('select-edicao-prioridade');
    const filtroPrioridade = document.getElementById('filtro-prioridade');
    const btnExportar = document.getElementById('btn-exportar');
    const inputImportar = document.getElementById('input-importar');

    let tarefasImportadasTemporarias = [];
    let paginaAtual = 1;
    const tarefasPorPagina = 5;


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
        aplicarBuscaEFiltro();
    }

    function abrirModal(modal) {
        modal.classList.add('ativo');
    }

    function fecharModal(modal) {
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

        const modal = document.getElementById('modal-editar');
        abrirModal(modal);
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

            const modal = document.getElementById('modal-editar');
            fecharModal(modal);
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
        if (e.key === 'Enter') {
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

            const deveExibir = correspondeTexto && correspondeStatus && correspondePrioridade;
            tarefa.style.display = deveExibir ? 'flex' : 'none';
        });

        paginaAtual = 1;
        renderizarTarefasComPaginacao();
        atualizarResumoTarefas();
    }

    function renderizarTarefasComPaginacao() {
        const todas = [...document.querySelectorAll('.item-tarefa')];
        const tarefasVisiveis = todas.filter(el => el.style.display !== 'none');

        const total = tarefasVisiveis.length;
        const totalPaginas = Math.ceil(total / tarefasPorPagina);
        if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

        tarefasUl.querySelectorAll('.item-tarefa').forEach(el => el.classList.add('oculta'));

        const inicio = (paginaAtual - 1) * tarefasPorPagina;
        const fim = inicio + tarefasPorPagina;

        tarefasVisiveis.slice(inicio, fim).forEach(el => el.classList.remove('oculta'));

        renderizarControlesDePaginacao(totalPaginas);
    }

    function renderizarControlesDePaginacao(totalPaginas) {
        const paginacaoDiv = document.getElementById('paginacao');
        paginacaoDiv.innerHTML = '';

        if (totalPaginas <= 1) return;

        const botoes = [
            { texto: '⏮ Início', ativo: paginaAtual > 1, acao: () => paginaAtual = 1 },
            { texto: '◀ Anterior', ativo: paginaAtual > 1, acao: () => paginaAtual-- },
            { texto: 'Próxima ▶', ativo: paginaAtual < totalPaginas, acao: () => paginaAtual++ },
            { texto: 'Fim ⏭', ativo: paginaAtual < totalPaginas, acao: () => paginaAtual = totalPaginas },
        ];

        botoes.forEach(({ texto, ativo, acao }) => {
            const btn = document.createElement('button');
            btn.textContent = texto;
            btn.disabled = !ativo;
            btn.addEventListener('click', () => {
                acao();
                renderizarTarefasComPaginacao();
            });
            paginacaoDiv.appendChild(btn);
        });

        const status = document.createElement('span');
        status.className = 'status';
        status.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
        paginacaoDiv.appendChild(status);
    }

    function atualizarResumoTarefas() {
        const todas = document.querySelectorAll('.item-tarefa');
        const visiveis = Array.from(todas).filter(t => t.style.display !== 'none');

        const resumo = document.getElementById('resumo-tarefas');
        resumo.textContent = visiveis.length === 1
            ? `🔎 1 tarefa encontrada`
            : `🔎 ${visiveis.length} tarefas encontradas`;

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
            aplicarBuscaEFiltro();
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
        const modal = document.getElementById('modal-editar');
        fecharModal(modal);
    });

    btnExportar.addEventListener('click', () => {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        const json = JSON.stringify(tarefas, null, 2);
        const blob = new Blob([json], { type: 'application/octet-stream' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tarefas.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    inputImportar.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const tarefas = JSON.parse(e.target.result);
                if (!Array.isArray(tarefas)) throw new Error('Formato inválido');

                tarefasImportadasTemporarias = tarefas;
                const modal = document.getElementById('modal-confirmar-importacao');
                abrirModal(modal);

            } catch (err) {
                alert('Erro ao importar tarefas. Verifique o conteúdo do arquivo JSON.');
            }
        };
        reader.readAsText(file);
        inputImportar.value = '';

    });

    document.getElementById('btn-confirmar-importacao').addEventListener('click', () => {
        localStorage.setItem('tarefas', JSON.stringify(tarefasImportadasTemporarias));
        location.reload();
    });

    function registrarFechamentoModal(idModal, idBotaoFechar) {
        const botao = document.getElementById(idBotaoFechar);
        const modal = document.getElementById(idModal);

        if (botao && modal) {
            botao.addEventListener('click', () => {
                fecharModal(modal);
            });
        }
    }

    window.addEventListener('scroll', () => {
        const botaoTopo = document.getElementById('btn-topo');
        botaoTopo.style.display = window.scrollY > 200 ? 'block' : 'none';
    });

    document.getElementById('btn-topo').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    registrarFechamentoModal('modal-editar', 'btn-fechar-edicao');
    registrarFechamentoModal('modal-editar', 'btn-cancelar');
    registrarFechamentoModal('modal-info', 'btn-fechar-info');
    registrarFechamentoModal('modal-info', 'btn-cancelar-info');
    registrarFechamentoModal('modal-confirmar-importacao', 'btn-cancelar-importacao');
    registrarFechamentoModal('modal-confirmar-importacao', 'fechar-modal-importar');

    carregaTarefasDoLocalStorage();
    aplicarBuscaEFiltro();
}

app();