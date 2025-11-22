document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    //  VARIÁVEIS E ELEMENTOS
    // ===============================
    const listaTarefasEl = document.querySelector(".task-list");

    // Modais
const modalAdicionar = document.getElementById('modal-adicionar');
    const modalAlterar = document.getElementById('modal-alterar');
    const modalExcluir = document.getElementById('delete-modal');
    
    const btnShowAdd = document.getElementById('btn-show-add');
    
    const taskListContainer = document.querySelector('.task-list');

    const formAdicionar = modalAdicionar.querySelector('.task-form');
    const formAlterar = modalAlterar.querySelector('.task-form');

    const modalBtnSim = document.getElementById('modal-btn-sim');
    const modalBtnNao = document.getElementById('modal-btn-nao');
    const btnsCancelar = document.querySelectorAll('.btn-cancel');

    function mostrarModal(modal) {
        modal.classList.remove('hidden');
    }

    function esconderModal(modal) {
        modal.classList.add('hidden');
    }

    btnShowAdd.addEventListener('click', () => {
        formAdicionar.reset();
        mostrarModal(modalAdicionar);
    });

    // Controle de tarefa selecionada
    let tarefaSelecionada = null;


    // ===============================
    //  BUSCAR TAREFAS (GET)
    // ===============================
    async function carregarTarefas() {
    listaTarefasEl.innerHTML = ""; // Limpa a lista atual

    try {
        const resposta = await fetch("http://localhost:8080/tarefas");
        const tarefas = await resposta.json();
        
        tarefas.forEach(t => criarElementoTarefa(t));

    } catch (e) {
        console.error("Erro ao buscar tarefas:", e);
    }
}


    // ===============================
    //  CRIAR ELEMENTO NA TELA
    // ===============================
    function criarElementoTarefa(tarefa) {
    const article = document.createElement('article');
    article.classList.add('task-item');

    let tagAtrasada = '';
    const dataTermino = tarefa.dataTermino;
    
    if (dataTermino) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); 
        
        const [ano, mes, dia] = dataTermino.split('-').map(Number);

        const dataVencimento = new Date(ano, mes - 1, dia);

        if (dataVencimento < hoje) {
            tagAtrasada = '<span class="tag-overdue">ATRASADA</span>';
            article.classList.add('overdue');
        }
    }
    
    const dataFormatada = dataTermino || "Sem data";

    article.innerHTML = `
        <h3>${tarefa.titulo} ${tagAtrasada}</h3> <p><strong>Responsável:</strong> ${tarefa.responsavel}</p>
        <p><strong>Data de término:</strong> ${dataFormatada}</p>
        <p class="task-details">${tarefa.detalhamento || ""}</p>

        <div class="task-actions">
            <button class="btn btn-secondary btn-edit">Alterar</button>
            <button class="btn btn-danger btn-delete">Excluir</button>
        </div>
    `;

    // botão editar
    article.querySelector(".btn-edit").addEventListener("click", () => {
    tarefaSelecionada = tarefa;
    abrirModalEditar(tarefa);
    });

    // botão excluir
    article.querySelector(".btn-delete").addEventListener("click", () => {
    tarefaSelecionada = tarefa;
    
    // CORREÇÃO: Usar o ID da tarefa salva para configurar o modal de exclusão
    const titulo = tarefa.titulo;
    modalExcluir.querySelector('p').textContent = `Deseja excluir a tarefa "${titulo}"?`;
    esconderModal(modalAlterar); // Esconde o modal de alteração se estiver aberto (manter)
    mostrarModal(modalExcluir);  // 💡 CHAMA O MODAL DE EXCLUSÃO
    });

    listaTarefasEl.appendChild(article);
}


    // ===============================
    //  ADICIONAR (POST)
    // ===============================
    modalAdicionar.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const novaTarefa = {
            titulo: document.getElementById("add-titulo").value,
            responsavel: document.getElementById("add-responsavel").value,
            dataTermino: document.getElementById("add-data").value,
            detalhamento: document.getElementById("add-detalhamento").value
        };

        try {
            await fetch("http://localhost:8080/tarefas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaTarefa)
            });

            modalAdicionar.querySelector("form").reset();
            modalAdicionar.classList.add("hidden");
            carregarTarefas();

        } catch (e) {
            console.error("Erro ao adicionar tarefa:", e);
        }
    });


    // ===============================
    //  EDITAR (PUT)
    // ===============================
    function abrirModalEditar(t) {
    document.getElementById("edit-titulo").value = t.titulo;
    document.getElementById("edit-responsavel").value = t.responsavel;
    document.getElementById("edit-data").value = t.dataTermino;
    document.getElementById("edit-detalhamento").value = t.detalhamento;

    modalAlterar.classList.remove("hidden");
}

modalAlterar.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const tarefaAtualizada = {
        titulo: document.getElementById("edit-titulo").value,
        responsavel: document.getElementById("edit-responsavel").value,
        dataTermino: document.getElementById("edit-data").value,
        detalhamento: document.getElementById("edit-detalhamento").value
    };

    try {
        await fetch(`http://localhost:8080/tarefas/${tarefaSelecionada.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarefaAtualizada)
        });

        modalAlterar.querySelector("form").reset();
        modalAlterar.classList.add("hidden");
        carregarTarefas();

    } catch (e) {
        console.error("Erro ao editar tarefa:", e);
    }
});


    // ===============================
    //  EXCLUIR (DELETE)
    // ===============================
    document.getElementById("modal-btn-sim").addEventListener("click", async () => {
        try {
            await fetch(`http://localhost:8080/tarefas/${tarefaSelecionada.id}`, {
                method: "DELETE"
            });

            modalExcluir.classList.add("hidden");
            carregarTarefas();

        } catch (e) {
            console.error("Erro ao excluir tarefa:", e);
        }
    });

    document.getElementById("modal-btn-nao").addEventListener("click", () => {
        modalExcluir.classList.add("hidden");
    });


    // ===============================
    //  INICIAR
    // ===============================
    carregarTarefas();
});
