document.addEventListener('DOMContentLoaded', () => {

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

    let tarefaParaExcluir = null;
    let tarefaParaAlterar = null;



    /**
     * Converte uma data do formato AAAA-MM-DD para DD/MM/AAAA.
     * @param {string} dataISO "2025-12-01"
     * @returns {string} "01/12/2025"
     */
    function formatarDataParaDisplay(dataISO) {
        if (!dataISO) return "";
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    /**
     * Converte uma data do formato DD/MM/AAAA para AAAA-MM-DD.
     * @param {string} dataDisplay "01/12/2025"
     * @returns {string} "2025-12-01"
     */
    function formatarDataParaInput(dataDisplay) {
        if (!dataDisplay) return "";
        const [dia, mes, ano] = dataDisplay.split('/');
        return `${ano}-${mes}-${dia}`;
    }

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

    formAdicionar.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('add-titulo').value;
        const responsavel = document.getElementById('add-responsavel').value;
        const data = document.getElementById('add-data').value;
        const detalhamento = document.getElementById('add-detalhamento').value;

        const novaTarefa = document.createElement('article');
        novaTarefa.classList.add('task-item');
        
        novaTarefa.innerHTML = `
            <h3>${titulo}</h3>
            <p><strong>Responsável:</strong> ${responsavel}</p>
            <p><strong>Data de término:</strong> ${formatarDataParaDisplay(data)}</p>
            <p class="task-details">${detalhamento}</p>
            <div class="task-actions">
                <button class="btn btn-secondary">Alterar</button>
                <button class="btn btn-danger">Excluir</button>
            </div>
        `;

        taskListContainer.appendChild(novaTarefa);
        alert('Tarefa incluída com sucesso!');
        esconderModal(modalAdicionar);
    });

    taskListContainer.addEventListener('click', (e) => {
        const target = e.target;
        const tarefaItem = target.closest('.task-item');

        if (!tarefaItem) return;

        if (target.classList.contains('btn-danger')) {
            tarefaParaExcluir = tarefaItem;
            const titulo = tarefaParaExcluir.querySelector('h3').textContent;
            modalExcluir.querySelector('p').textContent = `Deseja excluir a tarefa "${titulo}"?`;
            mostrarModal(modalExcluir);
        }

        if (target.classList.contains('btn-secondary')) {
            tarefaParaAlterar = tarefaItem;

            const titulo = tarefaParaAlterar.querySelector('h3').textContent;
            const responsavel = tarefaParaAlterar.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
            const dataDisplay = tarefaParaAlterar.querySelector('p:nth-of-type(2)').textContent.split(': ')[1].split(' ')[0];
            const detalhamento = tarefaParaAlterar.querySelector('.task-details').textContent;

            document.getElementById('edit-titulo').value = titulo;
            document.getElementById('edit-responsavel').value = responsavel;
            document.getElementById('edit-detalhamento').value = detalhamento;
            document.getElementById('edit-data').value = formatarDataParaInput(dataDisplay);
            
            mostrarModal(modalAlterar);
        }
    });

    modalBtnNao.addEventListener('click', () => {
        esconderModal(modalExcluir);
        tarefaParaExcluir = null;
    });

    modalBtnSim.addEventListener('click', () => {
        if (tarefaParaExcluir) {
            tarefaParaExcluir.remove();
        }
        esconderModal(modalExcluir);
        tarefaParaExcluir = null;
    });

    formAlterar.addEventListener('submit', (e) => {
        e.preventDefault();

        if (tarefaParaAlterar) {
            const novoTitulo = document.getElementById('edit-titulo').value;
            const novoResponsavel = document.getElementById('edit-responsavel').value;
            const novaData = document.getElementById('edit-data').value;
            const novoDetalhamento = document.getElementById('edit-detalhamento').value;

            tarefaParaAlterar.querySelector('h3').textContent = novoTitulo;
            tarefaParaAlterar.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Responsável:</strong> ${novoResponsavel}`;
            tarefaParaAlterar.querySelector('p:nth-of-type(2)').innerHTML = `<strong>Data de término:</strong> ${formatarDataParaDisplay(novaData)}`;
            tarefaParaAlterar.querySelector('.task-details').textContent = novoDetalhamento;

            alert('Tarefa alterada com sucesso!');
            esconderModal(modalAlterar);
            tarefaParaAlterar = null;
        }
    });


    btnsCancelar.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            esconderModal(modal);
        });
    });

});