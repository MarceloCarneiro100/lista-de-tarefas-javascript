
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
    const btnExcluirTodas = document.getElementById('btn-excluir-todas');
    const modalConfirmacaoApagarTudo = document.getElementById('modal-confirmar-apagar-tudo');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');
   
    
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

    function montaTarefa({ texto, prioridade, concluida, criacao, conclusao, duracao }) {
        const li = criaLi();
        li.setAttribute('data-prioridade', prioridade);

        li.classList.add('item-tarefa');
        if (concluida) li.classList.add('concluida');
        li.setAttribute('data-criacao', criacao);
        if (conclusao) li.setAttribute('data-conclusao', conclusao);
        if (duracao) li.setAttribute('data-duracao', duracao);

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
            criacao: dayjs().format('DD/MM/YYYY HH:mm:ss'),
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
            const dataConclusao = dayjs().format('DD/MM/YYYY HH:mm:ss');
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
            conclusao: li.getAttribute('data-conclusao') || null,
            duracao: li.getAttribute('data-duracao') || null
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
        const periodo = document.getElementById('filtro-periodo').value;
        const tarefas = document.querySelectorAll('.item-tarefa');

        const correspondePeriodo = (tarefa) => {

            if (periodo === 'todas') return true;

            const dataCriacao = tarefa.getAttribute('data-criacao')?.trim();
            const dataConclusao = tarefa.getAttribute('data-conclusao')?.trim();

            const criadaEm = dayjs(dataCriacao, 'DD/MM/YYYY HH:mm:ss');
            const concluidaEm = dataConclusao
                ? dayjs(dataConclusao, 'DD/MM/YYYY HH:mm:ss')
                : null;

            const dataRef = tarefa.classList.contains('concluida') ? concluidaEm : criadaEm;

            const hoje = dayjs().format('YYYY-MM-DD');
            const dataEhValida = dataRef?.isValid?.();
            const dataFormatada = dataRef?.format?.('YYYY-MM-DD');
            const correspondeHoje = dataFormatada === hoje;
            const corresponde7dias = dayjs().diff(dataRef, 'day') <= 7;
            const corresponde30dias = dayjs().diff(dataRef, 'day') <= 30;

            if (!dataRef || !dataEhValida) return false;
            if (periodo === 'hoje') return correspondeHoje;
            if (periodo === '7dias') return corresponde7dias;
            if (periodo === '30dias') return corresponde30dias;

            return true;
        };


        tarefas.forEach(tarefa => {

            const texto = tarefa.querySelector('.texto-tarefa').innerText.toLowerCase();
            const concluida = tarefa.classList.contains('concluida');
            const prioridade = tarefa.getAttribute('data-prioridade');

            const correspondeTexto = texto.includes(termo);
            const correspondeStatus =
                status === 'todas' ||
                (status === 'concluidas' && concluida) ||
                (status === 'pendentes' && !concluida);

            const correspondePrioridade =
                prioridadeSelecionada === 'todas' || prioridadeSelecionada === prioridade;
            const correspondeData = correspondePeriodo(tarefa);

            const deveExibir =
                correspondeTexto &&
                correspondeStatus &&
                correspondePrioridade &&
                correspondeData;

            tarefa.style.display = deveExibir ? 'flex' : 'none';
        });

        paginaAtual = 1;
        renderizarTarefasComPaginacao();
        atualizarResumoTarefas();
    }

    function getTodasTarefasFiltradas() {
        const termo = inputBusca.value.trim().toLowerCase();
        const status = filtroStatus.value;
        const prioridadeSelecionada = filtroPrioridade.value;
        const periodo = document.getElementById('filtro-periodo').value;
        const todas = [...document.querySelectorAll('.item-tarefa')];

        return todas.filter(tarefa => {
            const texto = tarefa.querySelector('.texto-tarefa').innerText.toLowerCase();
            const concluida = tarefa.classList.contains('concluida');
            const prioridade = tarefa.getAttribute('data-prioridade');

            const correspondeTexto = texto.includes(termo);
            const correspondeStatus =
                status === 'todas' ||
                (status === 'concluidas' && concluida) ||
                (status === 'pendentes' && !concluida);

            const correspondePrioridade =
                prioridadeSelecionada === 'todas' || prioridadeSelecionada === prioridade;

            const dataCriacao = tarefa.getAttribute('data-criacao')?.trim();
            const dataConclusao = tarefa.getAttribute('data-conclusao')?.trim();
            const criadaEm = dayjs(dataCriacao, 'DD/MM/YYYY HH:mm:ss');
            const concluidaEm = dataConclusao
                ? dayjs(dataConclusao, 'DD/MM/YYYY HH:mm:ss')
                : null;

            const dataRef = tarefa.classList.contains('concluida') ? concluidaEm : criadaEm;
            const hoje = dayjs().format('YYYY-MM-DD');
            const dataEhValida = dataRef?.isValid?.();
            const dataFormatada = dataRef?.format?.('YYYY-MM-DD');
            const correspondeHoje = dataFormatada === hoje;
            const corresponde7dias = dayjs().diff(dataRef, 'day') <= 7;
            const corresponde30dias = dayjs().diff(dataRef, 'day') <= 30;

            const correspondeData = (() => {
                if (!dataRef || !dataEhValida) return false;
                if (periodo === 'todas') return true;
                if (periodo === 'hoje') return correspondeHoje;
                if (periodo === '7dias') return corresponde7dias;
                if (periodo === '30dias') return corresponde30dias;
                return true;
            })();

            return correspondeTexto && correspondeStatus && correspondePrioridade && correspondeData;
        }).map(li => ({
            texto: li.querySelector('.texto-tarefa').innerText,
            prioridade: li.getAttribute('data-prioridade'),
            concluida: li.classList.contains('concluida'),
            criacao: li.getAttribute('data-criacao'),
            conclusao: li.getAttribute('data-conclusao'),
            duracao: li.getAttribute('data-duracao') || null
        }));
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

        document.getElementById('contador-tarefas').textContent =
            visiveis.length === 1
                ? `1 tarefa encontrada`
                : `${visiveis.length} tarefas encontradas`;

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

    btnExcluirTodas?.addEventListener('click', () => {
        const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');

        if (tarefas.length > 0) {
            abrirModal(modalConfirmacaoApagarTudo);
        } else {
            btnExcluirTodas.classList.add('tremer');
            setTimeout(() => {
                btnExcluirTodas.classList.remove('tremer');
            }, 300);
        }
    });

    btnConfirmarExclusao?.addEventListener('click', () => {
        localStorage.removeItem('tarefas');
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

    document.getElementById('filtro-periodo').addEventListener('change', aplicarBuscaEFiltro);


    registrarFechamentoModal('modal-editar', 'btn-fechar-edicao');
    registrarFechamentoModal('modal-editar', 'btn-cancelar');
    registrarFechamentoModal('modal-info', 'btn-fechar-info');
    registrarFechamentoModal('modal-info', 'btn-cancelar-info');
    registrarFechamentoModal('modal-confirmar-importacao', 'btn-cancelar-importacao');
    registrarFechamentoModal('modal-confirmar-importacao', 'fechar-modal-importar');
    registrarFechamentoModal('modal-confirmar-apagar-tudo', 'btn-cancelar-exclusao');
    registrarFechamentoModal('modal-confirmar-apagar-tudo', 'fechar-modal-apagar');

    carregaTarefasDoLocalStorage();
    aplicarBuscaEFiltro();

    // Plugin de rótulo de dados para o gráfico
    Chart.register(ChartDataLabels);

    document.getElementById('btn-relatorio-pdf').addEventListener('click', async () => {
        const tarefas = getTodasTarefasFiltradas();
        if (tarefas.length === 0) {
            alert('Nenhuma tarefa encontrada para gerar o relatório.');
            return;
        }

        const filtros = {
            busca: inputBusca.value,
            status: filtroStatus.value,
            prioridade: filtroPrioridade.value,
            periodo: document.getElementById('filtro-periodo').value
        };

        function calcularEstatisticas(tarefas) {
            return {
                total: tarefas.length,
                concluidas: tarefas.filter(t => t.concluida).length,
                pendentes: tarefas.filter(t => !t.concluida).length,
                porPrioridade: {
                    alta: tarefas.filter(t => t.prioridade === 'alta').length,
                    media: tarefas.filter(t => t.prioridade === 'media').length,
                    baixa: tarefas.filter(t => t.prioridade === 'baixa').length
                }
            };
        }

        const estatisticas = calcularEstatisticas(tarefas);
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.text("RELATÓRIO DE TAREFAS", 14, 20);
        doc.setFont("courier", "normal");

        let y = 30;
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleString('pt-BR')}`, 14, y);
        y += 7;

        doc.text(`Filtros:`, 14, y);
        y += 6;
        doc.text(`• Busca: "${filtros.busca}"`, 20, y);
        y += 6;
        doc.text(`• Status: ${filtros.status}`, 20, y);
        y += 6;
        doc.text(`• Prioridade: ${filtros.prioridade}`, 20, y);
        y += 6;
        doc.text(`• Período: ${filtros.periodo}`, 20, y);

        y += 10;
        doc.text(`Estatísticas:`, 14, y);
        y += 6;
        doc.text(`• Total: ${estatisticas.total}   • Concluídas: ${estatisticas.concluidas}   • Pendentes: ${estatisticas.pendentes}`, 20, y);
        y += 6;
        doc.text(`• Alta: ${estatisticas.porPrioridade.alta}   • Média: ${estatisticas.porPrioridade.media}   • Baixa: ${estatisticas.porPrioridade.baixa}`, 20, y);

        y += 10;
        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        const renderCabecalho = () => {
            doc.text("Nº | Tarefa                          | Status     | Priorid | Duração", 14, y);
            y += 5;
            doc.setFont("courier", "normal");
            doc.text("---------------------------------------------------------------------", 14, y);
            y += 5;
        };

        doc.setFontSize(12);
        doc.text("TAREFAS FILTRADAS", 14, y);
        y += 8;
        doc.setFontSize(12);
        renderCabecalho();

        tarefas.forEach((t, i) => {
            const numero = String(i + 1).padStart(2, '0');
            const texto = t.texto.length > 30
                ? t.texto.slice(0, 27) + "..."
                : t.texto.padEnd(30, ' ');

            const status = (t.concluida ? "Concluída" : "Pendente ").padEnd(10, ' ');
            const prioridade = (t.prioridade || "").padEnd(8, ' ');

            let duracaoFormatada = "--";
            if (t.concluida && t.duracao && !isNaN(parseInt(t.duracao))) {
                const ms = parseInt(t.duracao);
                const segundos = Math.floor(ms / 1000) % 60;
                const minutos = Math.floor(ms / 60000) % 60;
                const horas = Math.floor(ms / 3600000) % 24;
                const dias = Math.floor(ms / 86400000);
                const partes = [];

                if (dias > 0) partes.push(`${dias}d`);
                if (horas > 0) partes.push(`${horas}h`);
                if (minutos > 0) partes.push(`${minutos}min`);
                if (segundos > 0 && dias === 0 && horas === 0) partes.push(`${segundos}s`);

                duracaoFormatada = partes.join(" ").padEnd(8, ' ');
            } else {
                duracaoFormatada = duracaoFormatada.padEnd(8, ' ');
            }

            const linha = `${numero} | ${texto} | ${status} | ${prioridade} | ${duracaoFormatada}`;
            doc.text(linha, 14, y);
            y += 6;

            if (y > 270) {
                doc.addPage();
                y = 20;
                renderCabecalho();
            }
        });

        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');

        await new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Concluídas', 'Pendentes', 'Alta', 'Média', 'Baixa'],
                datasets: [{
                    label: 'Estatísticas',
                    data: [
                        estatisticas.concluidas,
                        estatisticas.pendentes,
                        estatisticas.porPrioridade.alta,
                        estatisticas.porPrioridade.media,
                        estatisticas.porPrioridade.baixa
                    ],
                    backgroundColor: ['#28a745', '#dc3545', '#e74c3c', '#f1c40f', '#3498db']
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: false,
                layout: { padding: { top: 20 } },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: -4,
                        color: '#000',
                        font: { weight: 'bold', size: 12 }
                    }
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 600));
        const imgData = canvas.toDataURL("image/png");
        doc.addPage();
        doc.setFontSize(12);
        doc.text("Gráfico de Estatísticas", 14, 20);
        doc.addImage(imgData, 'PNG', 15, 30, 180, 100);

        const totalPaginas = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginas; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${totalPaginas}`, 180, 290, { align: "right" });
        }
        doc.save('relatorio_tarefas.pdf');
    });
}

app();