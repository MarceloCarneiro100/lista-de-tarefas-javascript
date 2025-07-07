function parseDataBR(dataStr) {
    dataStr = dataStr.replace(',', '').trim();
    const [dia, mes, anoHora] = dataStr.split('/');
    const [ano, hora = '00:00:00'] = anoHora.split(' ');
    return dayjs(`${ano}-${mes}-${dia}T${hora}`);
}

function formatarDuracao(ms, { abreviado = false, maxPartes = 2 } = {}) {
    if (typeof ms !== 'number' || isNaN(ms)) return '--';

    const duracao = dayjs.duration(ms);

    const unidades = abreviado
        ? [
            { valor: duracao.years(), rótulo: 'a' },
            { valor: duracao.months(), rótulo: 'm' },
            { valor: duracao.days(), rótulo: 'd' },
            { valor: duracao.hours(), rótulo: 'h' },
            { valor: duracao.minutes(), rótulo: 'min' },
            { valor: duracao.seconds(), rótulo: 's' }
        ]
        : [
            { valor: duracao.years(), singular: 'ano', plural: 'anos' },
            { valor: duracao.months(), singular: 'mês', plural: 'meses' },
            { valor: duracao.days(), singular: 'dia', plural: 'dias' },
            { valor: duracao.hours(), singular: 'hora', plural: 'horas' },
            { valor: duracao.minutes(), singular: 'minuto', plural: 'minutos' },
            { valor: duracao.seconds(), singular: 'segundo', plural: 'segundos' }
        ];

    const partes = unidades
        .filter(u => u.valor > 0)
        .slice(0, maxPartes)
        .map(u => abreviado
            ? `${u.valor}${u.rótulo}`
            : `${u.valor} ${u.valor === 1 ? u.singular : u.plural}`
        );

    return partes.length
        ? abreviado ? partes.join(' e ') : `Levou cerca de ${partes.join(', ').replace(/, ([^,]*)$/, ' e $1')}`
        : abreviado ? '--' : 'Levou menos de 1 segundo';
}