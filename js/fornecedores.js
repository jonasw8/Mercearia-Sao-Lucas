let fornecedores = [];
let proximoId = 1;

document.getElementById('cnpj').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    e.target.value = value;
});

document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
});

document.getElementById('fornecedorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const editIndex = document.getElementById('editIndex').value;
    const fornecedor = {
        id: editIndex ? fornecedores[editIndex].id : proximoId++,
        nome: document.getElementById('nome').value,
        cnpj: document.getElementById('cnpj').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('endereco').value
    };

    if (editIndex !== '') {
        fornecedores[editIndex] = fornecedor;
    } else {
        fornecedores.push(fornecedor);
    }

    renderTable();
    resetForm();
});

function renderTable() {
    const tbody = document.getElementById('fornecedoresBody');
    
    if (fornecedores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Nenhum fornecedor cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = fornecedores.map((f, index) => `
        <tr>
            <td>${f.id}</td>
            <td>${f.nome}</td>
            <td>${f.cnpj}</td>
            <td>${f.telefone}</td>
            <td>${f.email}</td>
            <td>${f.endereco}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editarFornecedor(${index})">Editar</button>
                <button class="btn-delete" onclick="removerFornecedor(${index})">Remover</button>
            </td>
        </tr>
    `).join('');
}

// Função para editar fornecedor
function editarFornecedor(index) {
    const f = fornecedores[index];
    
    document.getElementById('nome').value = f.nome;
    document.getElementById('cnpj').value = f.cnpj;
    document.getElementById('telefone').value = f.telefone;
    document.getElementById('email').value = f.email;
    document.getElementById('endereco').value = f.endereco;
    document.getElementById('editIndex').value = index;
    
    document.getElementById('formTitle').textContent = 'Editar Fornecedor';
    document.getElementById('btnSubmit').textContent = 'Salvar Alterações';
    document.getElementById('btnCancelar').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removerFornecedor(index) {
    if (confirm('Tem certeza que deseja remover este fornecedor?')) {
        fornecedores.splice(index, 1);
        renderTable();
    }

function resetForm() {
    document.getElementById('fornecedorForm').reset();
    document.getElementById('editIndex').value = '';
    document.getElementById('formTitle').textContent = 'Adicionar Novo Fornecedor';
    document.getElementById('btnSubmit').textContent = 'Adicionar Fornecedor';
    document.getElementById('btnCancelar').classList.add('hidden');
}


document.getElementById('btnCancelar').addEventListener('click', resetForm);

renderTable();
