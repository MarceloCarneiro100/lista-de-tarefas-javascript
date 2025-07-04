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
        { valor: duracao.years(), singular: 'ano', plural: 'anos' },
        { valor: duracao.months(), singular: 'mês', plural: 'meses' },
        { valor: duracao.days(), singular: 'dia', plural: 'dias' },
        { valor: duracao.hours(), singular: 'hora', plural: 'horas' },
        { valor: duracao.minutes(), singular: 'minuto', plural: 'minutos' },
        { valor: duracao.seconds(), singular: 'segundo', plural: 'segundos' }
    ];

    // Filtrar unidades relevantes (> 0) e formatar
    const partesRelevantes = unidades
        .filter(u => u.valor)
        .map(u => `${u.valor} ${u.valor === 1 ? u.singular : u.plural}`)
        .slice(0, maxPartes);

    if (partesRelevantes.length === 0) return 'Levou menos de 1 segundo';
    if (partesRelevantes.length === 1) return `Levou cerca de ${partesRelevantes[0]}`;

    const ultima = partesRelevantes.pop();
    return `Levou cerca de ${partesRelevantes.join(', ')} e ${ultima}`;
}