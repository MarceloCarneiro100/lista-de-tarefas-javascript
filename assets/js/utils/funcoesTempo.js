function parseDataBR(dataStr) {
    dataStr = dataStr.replace(',', '').trim();
    const [dia, mes, anoHora] = dataStr.split('/');
    const [ano, hora = '00:00:00'] = anoHora.split(' ');
    return dayjs(`${ano}-${mes}-${dia}T${hora}`);
}

function calcularDuracaoComDayjs(dataInicioStr, dataFimStr, maxPartes = 2) {
    const inicio = parseDataBR(dataInicioStr);
    const fim = parseDataBR(dataFimStr);

    if (!inicio.isValid() || !fim.isValid()) {
        return 'Data inválida';
    }

    if (inicio.isAfter(fim)) {
        return 'Data de início posterior à de conclusão';
    }

    const duracaoMs = fim.diff(inicio);
    const duracao = dayjs.duration(duracaoMs);

    const unidades = [
        { valor: duracao.years(), nome: 'ano' },
        { valor: duracao.months(), nome: 'mês' },
        { valor: duracao.days(), nome: 'dia' },
        { valor: duracao.hours(), nome: 'hora' },
        { valor: duracao.minutes(), nome: 'minuto' },
        { valor: duracao.seconds(), nome: 'segundo' }
    ];

    // Filtrar unidades relevantes (> 0) e formatar
    const partesRelevantes = unidades
        .filter(u => u.valor)
        .map(u => `${u.valor} ${u.valor === 1 ? u.nome : u.nome + 's'}`)
        .slice(0, maxPartes);

    if (partesRelevantes.length === 0) return 'Levou menos de 1 segundo';
    if (partesRelevantes.length === 1) return `Levou cerca de ${partesRelevantes[0]}`;

    const ultima = partesRelevantes.pop();
    return `Levou cerca de ${partesRelevantes.join(', ')} e ${ultima}`;
}