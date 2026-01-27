const precoUnitario = 10;

function calcularSubtotal() {
    const quantidade = Number(document.getElementById("quantidade").value);
    const subtotal = quantidade * precoUnitario;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
}

function adicionarEndereco() {
    const divEnderecos = document.getElementById("enderecos");

    const novoEndereco = document.createElement("div");
    novoEndereco.className = "endereco";

    novoEndereco.innerHTML = `
        <input type="text" placeholder="Rua">
        <input type="text" placeholder="Número">
        <input type="text" placeholder="Bairro">
        <input type="text" placeholder="Cidade">
        <button type="button" onclick="removerEndereco(this)">Remover</button>
    `;

    divEnderecos.appendChild(novoEndereco);
}

function removerEndereco(botao) {
    botao.parentElement.remove();
}

function mostrarCamposCartao() {
    const formaPagamento = document.getElementById("formaPagamento").value;
    const dadosCartao = document.getElementById("dadosCartao");

    if (formaPagamento === "credito" || formaPagamento === "debito") {
        dadosCartao.style.display = "block";
    } else {
        dadosCartao.style.display = "none";
    }
}
