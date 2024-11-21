document.addEventListener("DOMContentLoaded", () => {
    fetchCategorias(); // Busca e exibe as categorias no <select>
    fetchProdutos(); // Busca todos os produtos inicialmente
    atualizaCesto(); // Atualiza o cesto com os itens do localStorage
    atualizarPrecoTotal(); // Atualiza o preço total
});

// Função para buscar categorias
function fetchCategorias() {
    const apiURL = 'https://deisishop.pythonanywhere.com/categories/';

    fetch(apiURL)
        .then(response => response.json())
        .then(categorias => {
            console.log(categorias); // Verifica as categorias recebidas
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

    // Adicionar evento de mudança (change) para filtrar produtos
    select.addEventListener("change", (event) => {
        const categoriaSelecionada = event.target.value;
        fetchProdutos(categoriaSelecionada); // Filtra os produtos pela categoria
    });
}

// Função para buscar produtos
function fetchProdutos(categoria = "all") {
    let apiURL = 'https://deisishop.pythonanywhere.com/products/';

    fetch(apiURL)
        .then(response => response.json())
        .then(produtos => {
            console.log(produtos); // Verifica os produtos recebidos
            if (categoria !== "all") {
                produtos = produtos.filter(produto => produto.category === categoria);
            }
            carregarProdutos(produtos); // Exibe os produtos na interface
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
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

// Funções auxiliares (cesto e preço total, já existentes)
function adicionarAoCesto(produto) {
    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    lista.push(produto);
    localStorage.setItem('produtos-selecionados', JSON.stringify(lista));
    atualizaCesto();
    atualizarPrecoTotal();
}

function atualizaCesto() {
    const section = document.getElementById("cesto");
    section.innerHTML = ''; // Limpa o conteúdo existente

    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    lista.forEach(produto => {
        const article = document.createElement('article');

        const title = document.createElement('h3');
        title.textContent = produto.title;
        article.appendChild(title);

        const image = document.createElement('img');
        image.src = produto.image;
        image.alt = produto.title;
        article.appendChild(image);

        const price = document.createElement('h4');
        price.textContent = `${produto.price.toFixed(2)} €`;
        article.appendChild(price);

        const button = document.createElement('button');
        button.textContent = '- Remover do Cesto';
        button.addEventListener('click', () => {
            removerDoCesto(produto.id);
        });
        article.appendChild(button);

        section.appendChild(article);
    });
}

function removerDoCesto(produtoId) {
    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const novaLista = lista.filter(produto => produto.id !== produtoId);
    localStorage.setItem('produtos-selecionados', JSON.stringify(novaLista));
    atualizaCesto();
    atualizarPrecoTotal();
}

function atualizarPrecoTotal() {
    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const total = lista.reduce((acc, produto) => acc + produto.price, 0);
    const precoTotalElemento = document.getElementById("preco-total");
    if (precoTotalElemento) {
        precoTotalElemento.textContent = `Custo Total: ${total.toFixed(2)} €`;
    }
}
