# ✅ Gerenciador de Tarefas com Filtros, Duração, Gráfico e Relatórios

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Um app web intuitivo e interativo para **criação, gerenciamento e acompanhamento de tarefas**, com suporte a **filtros avançados**, **marcação de conclusão**, **cálculo de duração detalhada**, **relatórios otimizados**, **gráfico de tarefas** e muito mais.

---

## 🌐 Acesse o app online

🔗 [Clique aqui para acessar](https://marcelocarneiro100.github.io/lista-de-tarefas-javascript/)

---

## ✨ Funcionalidades Principais

- 📝 Criação de Tarefas com prioridade personalizada  
- 🧠 Busca inteligente por texto, em tempo real  
- 🎯 Filtros dinâmicos por:
  - Status (pendente, concluída)
  - Prioridade (baixa, média, alta)
  - Período (hoje, últimos 7 ou 30 dias)  
- ✅ Marcação de Conclusão com atualização automática da data e cálculo de duração  
- ⏱ Cálculo da Duração entre data de criação e conclusão com precisão  
- 💾 Armazenamento com LocalStorage: tarefas persistem no navegador  
- 📊 Gráfico Dinâmico com contagem de tarefas por status  
- 🧾 Geração de Relatório com as tarefas filtradas  
- 📁 Permite fazer upload e download de arquivos JSON, permitindo fazer o backup das tarefas.
- 🔄 Refatoração centralizada da lógica de filtragem na função `filtrarTarefas()`  
- 🧠 Formatação reutilizável da duração exibida no modal e no relatório  
- 📱 Design responsivo e estilizado por prioridade  

---

## 📦 Estrutura do Objeto Tarefa

```js
{
  texto: "Exemplo de tarefa",
  prioridade: "alta", // ou "media", "baixa"
  concluida: false,
  criacao: "08/07/2025 14:23:00",
  conclusao: null,
  duracao: null // preenchido após conclusão
}
```

A propriedade `duracao` é calculada em milissegundos e formatada dinamicamente.

---

## 🔧 Funções-Chave

| Função                       | Descrição                                                             |
|------------------------------|------------------------------------------------------------------------|
| `formatarDuracao(ms)`        | Formata o tempo total em estilo curto ou completo                     |
| `filtrarTarefas(li)`         | Centraliza todos os critérios de filtro                               |
| `getTodasTarefasFiltradas()` | Retorna um array de tarefas que atendem aos critérios atuais          |
| `aplicarBuscaEFiltro()`      | Mostra/esconde itens com base em `filtrarTarefas()`                   |
| `renderizarInfoModal()`      | Preenche o modal com os dados da tarefa, incluindo duração formatada  |

---

## 📊 Gráfico de Acompanhamento

- Exibe um gráfico de barras dinâmico  
- Mostra o total de tarefas por status  
- Respeita os filtros ativos no app  
- Oferece visão instantânea de produtividade  

---

## 🧪 Exemplos de Duração Formatada

| Milissegundos   | Abreviado     | Completo                              |
|-----------------|---------------|----------------------------------------|
| `3153600000`    | `1m e 5d`     | Levou cerca de 1 mês e 5 dias          |
| `62000`         | `1min e 2s`   | Levou cerca de 1 minuto e 2 segundos   |
| `0`             | `--`          | Levou menos de 1 segundo               |

---

## 🛠 Refatorações Importantes

- 🔄 Criação da função `filtrarTarefas()` para unificar filtros  
- ♻️ Reaproveitamento total de lógica em `getTodasTarefasFiltradas()` e `aplicarBuscaEFiltro()`  
- ⏱ Duração padronizada com base em milissegundos  
- ✨ Eliminação de duplicações de código  
- 📋 Consistência total entre modal e relatório  

---

## 💾 Tecnologias Utilizadas

- HTML5  
- CSS3 (com classes por prioridade)  
- JavaScript (ES6+)  
- [Day.js](https://day.js.org/) para datas  
- LocalStorage  
- Gráficos com canvas ou biblioteca equivalente  

---

## 👨‍💻 Autor

Desenvolvido com dedicação por **Marcelo Carneiro**  
Com foco em legibilidade, reutilização e experiência do usuário ⚡
