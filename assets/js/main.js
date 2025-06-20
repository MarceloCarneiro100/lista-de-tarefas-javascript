function app() {
    const formulario = document.querySelector('.form');
    const inputTarefa = formulario.querySelector('.tarefa');
    const btn = formulario.querySelector('.btn');

    btn.addEventListener('click', function (e) {
         e.preventDefault();
         const valor = inputTarefa.value.trim();
         if(!valor) return;
         console.log(valor)
    });
}


app();