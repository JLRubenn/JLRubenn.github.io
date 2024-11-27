document.addEventListener("DOMContentLoaded", () => {
    fetchCategorias(); // Busca e exibe as categorias no <select>
    fetchProdutos(); // Busca todos os produtos inicialmente
    atualizaCesto(); // Atualiza o cesto com os itens do localStorage
    atualizarPrecoTotal(); // Atualiza o preço total

    // Adicionar eventos para ordenação e pesquisa
    document.getElementById("ordenar").addEventListener("change", aplicarFiltros);
    document.getElementById("pesquisa").addEventListener("input", aplicarFiltros);
    document.getElementById("categoria").addEventListener("change", aplicarFiltros);
});

document.addEventListener("DOMContentLoaded", () => {
    atualizaCesto(); // Atualiza os produtos no cesto
    atualizarPrecoTotal(); // Atualiza o custo total
    document.getElementById("finalizar-compra").addEventListener("click", finalizarCompra);
});

// Variável global para armazenar os produtos carregados
let todosProdutos = [];

// Função para buscar produtos
function fetchProdutos() {
    const apiURL = 'https://deisishop.pythonanywhere.com/products/';

    fetch(apiURL)
        .then(response => response.json())
        .then(produtos => {
            todosProdutos = produtos; // Armazena os produtos na variável global
            aplicarFiltros(); // Exibe os produtos com os filtros aplicados
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

// Função para aplicar os filtros, ordenação e pesquisa
function aplicarFiltros() {
    const categoriaSelecionada = document.getElementById("categoria").value;
    const ordemSelecionada = document.getElementById("ordenar").value;
    const termoPesquisa = document.getElementById("pesquisa").value.toLowerCase();

    let produtosFiltrados = [...todosProdutos];

    // Filtrar por categoria
    if (categoriaSelecionada !== "all") {
        produtosFiltrados = produtosFiltrados.filter(
            produto => produto.category === categoriaSelecionada
        );
    }

    // Filtrar por termo de pesquisa
    if (termoPesquisa) {
        produtosFiltrados = produtosFiltrados.filter(
            produto => produto.title.toLowerCase().includes(termoPesquisa)
        );
    }

    // Ordenar por preço
    if (ordemSelecionada === "asc") {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (ordemSelecionada === "desc") {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }

    // Exibe os produtos filtrados e ordenados
    carregarProdutos(produtosFiltrados);
}

// Função para exibir os produtos na página
function carregarProdutos(produtos) {
    const section = document.getElementById("produtos");
    if (!section) {
        console.error("Elemento com id 'produtos' não encontrado no HTML.");
        return;
    }

    section.innerHTML = ""; // Limpa os produtos anteriores

    produtos.forEach(produto => {
        const article = document.createElement('article');

        // Nome do produto
        const title = document.createElement('h3');
        title.textContent = produto.title;
        article.appendChild(title);

        // Imagem do produto
        const image = document.createElement('img');
        image.src = produto.image;
        image.alt = produto.title;
        article.appendChild(image);

        // Preço do produto
        const price = document.createElement('h4');
        price.textContent = `${produto.price.toFixed(2)} €`;
        article.appendChild(price);

        // Descrição do produto
        const description = document.createElement('p');
        description.textContent = produto.description;
        article.appendChild(description);

        // Botão para adicionar ao cesto
        const button = document.createElement('button');
        button.textContent = '+ Adicionar ao Cesto';
        button.addEventListener('click', () => {
            adicionarAoCesto(produto); // Adiciona o produto ao cesto
        });
        article.appendChild(button);

        // Adiciona o artigo à seção de produtos
        section.appendChild(article);
    });
}

// Função para buscar categorias
function fetchCategorias() {
    const apiURL = 'https://deisishop.pythonanywhere.com/categories/';

    fetch(apiURL)
        .then(response => response.json())
        .then(categorias => {
            carregarCategorias(categorias);
        })
        .catch(error => console.error('Erro ao carregar categorias:', error));
}

// Função para preencher o <select> com as categorias
function carregarCategorias(categorias) {
    const select = document.getElementById("categoria");
    if (!select) return;

    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        select.appendChild(option);
    });
}

// Funções auxiliares (cesto e preço total, já existentes)
function adicionarAoCesto(produto) {
    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    lista.push(produto);
    localStorage.setItem('produtos-selecionados', JSON.stringify(lista));
    atualizarCesto();
    atualizarPrecoTotal();
}

function atualizarCesto() {
    const cesto = document.getElementById("cesto");
    const produtos = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    cesto.innerHTML = ""; // Limpar conteúdo existente

    produtos.forEach(produto => {
        const article = document.createElement("article");
        article.classList.add("produto-cesto");

        article.innerHTML = `
            <h3>${produto.title}</h3>
            <img src="${produto.image}" alt="${produto.title}">
            <h4>Custo total: ${produto.price.toFixed(2)} €</h4>
            <p>
                <span class="rating">⭐ ${produto.rating.rate.toFixed(1)}</span>
                <span class="reviews">(${produto.rating.count} avaliações)</span>
            </p>
            <button onclick="removerDoCesto(${produto.id})">- Remover do Cesto</button>
        `;

        cesto.appendChild(article);
    });

    atualizarPrecoTotal(); // Atualizar o preço total
}


function removerDoCesto(produtoId) {
    const produtos = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const novaLista = produtos.filter(produto => produto.id !== produtoId);
    localStorage.setItem('produtos-selecionados', JSON.stringify(novaLista));
    atualizaCesto(); // Atualiza o cesto
}

function atualizarPrecoTotal() {
    const produtos = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const total = produtos.reduce((acc, produto) => acc + produto.price, 0);

    const precoTotalElemento = document.getElementById("total");
    if (precoTotalElemento) {
        precoTotalElemento.textContent = `${total.toFixed(2)} €`;
    }
}

let referenciaAtual = 2011240000;

function finalizarCompra() {
    const apiURL = 'https://deisishop.pythonanywhere.com/buy/'; // Endpoint correto
    const produtos = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];

    if (produtos.length === 0) {
        alert("O cesto está vazio!");
        return;
    }

    const idsProdutos = produtos.map(produto => produto.id); // Extrai os IDs dos produtos
    const estudante = document.getElementById("estudante").checked; // Verifica se o checkbox está marcado
    const cupom = document.getElementById("cupom").value; // Obtém o cupom digitado

    const dados = {
        products: idsProdutos,
        student: estudante,
        coupon: cupom || null,
    };

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao finalizar compra: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta da API:", data);
            exibirResultadoCompra(data);
        })
        .catch(error => {
            console.error("Erro ao finalizar compra:", error);
            alert("Houve um erro ao finalizar a compra.");
        });
}

function exibirResultadoCompra(dados) {
    const resultadoDiv = document.getElementById("resultado-compra");
    const referencia = `201124-${referenciaAtual}`;
    referenciaAtual += 1; // Incrementa a referência para a próxima compra

    resultadoDiv.innerHTML = `
        <p>Valor final a pagar (com eventuais descontos): ${dados.totalCost} €</p>
        <p>Referência de pagamento: ${referencia}</p>
    `;
}


