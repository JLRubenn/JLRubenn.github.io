// Inicializa o `localStorage` com a chave 'produtos-selecionados' caso ela não exista
if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

// Variável global para armazenar os produtos carregados da API
let produtos = [];

// Requisição para buscar produtos da API
fetch("https://deisishop.pythonanywhere.com/products/")
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        console.log(data); // Exibe os dados no console para depuração

        produtos = data.map(produto => {
            if (!produto.rate) {
                produto.rate = (Math.random() * 5).toFixed(1); // Adiciona um rate aleatório entre 0.0 e 5.0
            }
            return produto;
        });

        produtos = data; // Armazena os produtos na variável global
        carregarProdutos(produtos); // Renderiza os produtos na página
    });

// Função para criar o elemento HTML de um produto
function criarProduto(produto) {
    const article = document.createElement(`article`); // Contêiner principal do produto

    // Título do produto
    const title = document.createElement(`h3`);
    title.textContent = produto.title;
    article.append(title);

    // Imagem do produto
    const image = document.createElement(`img`);
    image.src = produto.image;
    article.append(image);

    // Preço do produto
    const price = document.createElement(`h4`);
    price.textContent = produto.price + " €";
    article.append(price);

    // Descrição do produto
    const description = document.createElement(`p`);
    description.textContent = produto.description;
    article.append(description);

    const rate = document.createElement(`p`);
    rate.textContent = "Avaliação: " + produto.rate + " ★";
    article.append(rate);

    // Botão para adicionar o produto ao carrinho
    const button = document.createElement(`button`);
    button.textContent = "+ Adicionar ao Cesto";
    article.append(button);

    // Evento para adicionar o produto ao carrinho
    button.addEventListener("click", () => {
        const lista = JSON.parse(localStorage.getItem('produtos-selecionados')); // Recupera os produtos do carrinho
        lista.push(produto); // Adiciona o novo produto
        localStorage.setItem('produtos-selecionados', JSON.stringify(lista)); // Atualiza o `localStorage`
        atualizaCesto(); // Atualiza o carrinho na interface
    });

    return article; // Retorna o elemento criado
}

// Função para carregar e exibir os produtos na página
function carregarProdutos(prod) {
    const section = document.getElementById("produtos"); // Seleciona a seção onde os produtos serão exibidos
    section.innerHTML = ""; // Limpa o conteúdo atual
    prod.forEach(produto => {
        section.append(criarProduto(produto)); // Adiciona cada produto à seção
    });
}

// Função para criar o elemento de um produto no carrinho
function criarProdutoCesto(produto) {
    const article = document.createElement(`article`); // Contêiner principal do produto no carrinho

    // Título do produto
    const title = document.createElement(`h3`);
    title.textContent = produto.title;
    article.append(title);

    // Imagem do produto
    const image = document.createElement(`img`);
    image.src = produto.image;
    article.append(image);

    // Preço do produto
    const price = document.createElement(`h4`);
    price.textContent = produto.price + " €";
    article.append(price);

    // Botão para remover o produto do carrinho
    const button = document.createElement(`button`);
    button.textContent = "- Remover do Cesto";
    article.append(button);

    // Evento para remover o produto do carrinho
    button.addEventListener("click", () => {
        const lista = JSON.parse(localStorage.getItem('produtos-selecionados')); // Recupera os produtos do carrinho
        const indice = lista.findIndex(item => item.id === produto.id); // Encontra o índice do produto
        lista.splice(indice, 1); // Remove o produto da lista
        localStorage.setItem('produtos-selecionados', JSON.stringify(lista)); // Atualiza o `localStorage`
        const section = document.getElementById("cesto"); // Seleciona a seção do carrinho
        section.removeChild(article); // Remove o elemento HTML do carrinho
        atualizaCesto(); // Atualiza o carrinho na interface
    });

    return article; // Retorna o elemento criado
}

// Função para atualizar o conteúdo do carrinho
function atualizaCesto() {
    const section = document.getElementById("cesto"); // Seleciona a seção do carrinho
    section.innerHTML = ""; // Limpa o conteúdo atual
    let somaTotal = 0; // Inicializa a soma total

    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')); // Recupera os produtos do carrinho
    lista.forEach(produto => {
        section.append(criarProdutoCesto(produto)); // Adiciona cada produto à seção do carrinho
        somaTotal += parseFloat(produto.price); // Soma o preço do produto ao total
    });

    // Atualiza o custo total exibido na interface
    document.getElementById("custoTotal").textContent = somaTotal.toFixed(2) + " €";
}

// Evento executado ao carregar a página
addEventListener("DOMContentLoaded", () => {
    atualizaCesto(); // Atualiza o carrinho
    criarFiltros(); // Configura os filtros
    ordenarPorRate(); // Configura a ordenação
    pesquisar(); // Configura a pesquisa
    comprar(); // Configura o botão de compra
});

// Função para configurar os filtros de categorias
function criarFiltros() {
    const filtrar = document.getElementById("filtros"); // Seleciona o elemento de filtros
    fetch("https://deisishop.pythonanywhere.com/categories/") // Requisição para buscar categorias
        .then(response => response.json())
        .then(data => {
            data.forEach(categoria => {
                const option = document.createElement("option"); // Cria um elemento `<option>`
                option.textContent = categoria; // Define o texto da opção
                option.value = categoria; // Define o valor da opção
                filtrar.append(option); // Adiciona a opção ao filtro
            });

            // Evento para filtrar produtos ao mudar o filtro
            filtrar.onchange = function () {
                if (this.value != "todas") {
                    carregarProdutos(produtos.filter(produto => produto.category === this.value)); // Filtra por categoria
                } else {
                    carregarProdutos(produtos); // Exibe todos os produtos
                }
            };
        });
}

// Função para configurar a ordenação por preço
function ordenarPorRate() {
    const selectOrdenar = document.getElementById("ordenar"); // Seleciona o elemento de ordenação
    selectOrdenar.onchange = function () {
        if (this.value === "ascendente") {
            carregarProdutos(produtos.sort((a, b) => a.rate - b.rate)); // Ordena por preço crescente
        } else if (this.value === "descendente") {
            carregarProdutos(produtos.sort((a, b) => b.rate - a.rate)); // Ordena por preço decrescente
        }
    };
}

// Função para configurar a pesquisa de produtos
function pesquisar() {
    const pesquisarProduto = document.getElementById("pesquisar"); // Seleciona o campo de pesquisa
    pesquisarProduto.oninput = function () {
        carregarProdutos(produtos.filter(produto => produto.title.toLowerCase().includes(this.value.toLowerCase()))); 
        carregarProdutos(produtos.filter(produto => produto.description.toLowerCase().includes(this.value.toLowerCase())));// Filtra produtos pelo título
    };
}



// Função para configurar o botão de compra
function comprar() {
    const botaoComprar = document.getElementById("botao"); // Seleciona o botão de compra
    let counter = 1; // Contador para gerenciar a exibição de mensagens

    botaoComprar.onclick = function () {
        let idProdutos = []; // Lista de IDs dos produtos no carrinho
        const produtosCarrinho = JSON.parse(localStorage.getItem('produtos-selecionados'));
        produtosCarrinho.forEach(produto => {
            idProdutos.push(produto.id); // Adiciona o ID do produto à lista
        });

        const checkBox = document.getElementById("alunoDeisi"); // Seleciona o checkbox de desconto
        const cupaoDesconto = document.getElementById("cupao"); // Seleciona o campo de cupom
        const morada = document.getElementById("adress");
        const bodyEnvio = {
            products: idProdutos, // IDs dos produtos
            student: checkBox.checked, // Indica se é estudante
            coupon: cupaoDesconto.value,
            adress: morada.value // Código do cupom

        };

        fetch('https://deisishop.pythonanywhere.com/buy/', {
            method: 'POST', // Envia os dados via POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyEnvio) // Converte os dados para JSON
        })
            .then(response => response.json())
            .then(data => {
                const section = document.getElementById("checkout"); // Seleciona a seção de checkout

                if (counter === 1) {
                    // Exibe o valor final com desconto
                    const newH3 = document.createElement('h3');
                    newH3.id = "desconto";
                    newH3.textContent = "Valor final a pagar (com eventuais descontos): ";
                    section.append(newH3);
                }

                const h3Alterar = document.getElementById("desconto");
                h3Alterar.textContent = "Valor final a pagar (com eventuais descontos): " + data.totalCost + " €";

                if (counter === 1) {
                    // Exibe a referência de pagamento
                    const newP = document.createElement('p');
                    newP.textContent = "Referência de pagamento: " + data.reference;
                    newP.id = "referencia";
                    section.append(newP);
                }

                const pReferencia = document.getElementById("referencia");
                pReferencia.textContent = "Referência de pagamento: " + data.reference;

                if (counter === 1) {
                    // Exibe o valor final com desconto
                    const newP = document.createElement('p');
                    newP.textContent = "Morada: " + data.adress;
                    newP.id = "adress";
                    section.append(newP);
                }

                const pAdress = document.getElementById("adress");
                pAdress.textContent = "Morada: " + data.adress;

                counter++;
            });
    };
}

function adicionartodos() { 
    const botaoTodos = document.getElementById("adicionar-todos");
    botaoTodos.addEventListener("click" , () => {
        const lista = JSON.parse(localStorage.getItem('produtos-selecionados'));
        const idProdutos = lista.map(produto => produto.id)

        const produtosAdicionar = produtos.filter(produto => !idProdutos.includes(produto))

        lista.push(...produtosAdicionar);



    })
}