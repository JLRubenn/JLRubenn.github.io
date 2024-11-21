if(!localStorage.getItem('produtos-selecionados')){
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}
function criarProduto(produto){
    const article = document.createElement(`article`);    //criar article        
    const title = document.createElement (`h3`);         //criar h3 para titulo do produto
    title.textContent = produto.title;
    article.append(title);

    const image = document.createElement(`img`);          //criar imagem do produto
    image.src= produto.image;
    article.append(image);

    const price = document.createElement(`h4`);
    price.textContent = produto.price + " €";
    article.append(price);

    const description = document.createElement(`p`);
    description.textContent = produto.description;
    article.append(description);

    const button = document.createElement(`button`);
    button.textContent = "+ Adicionar ao Cesto"
    article.append(button);
    button.addEventListener("click", () =>{
        //adicionar ao local storage
        const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) ;        
        lista.push(produto);
        localStorage.setItem('produtos-selecionados', JSON.stringify(lista));
         
        atualizaCesto();
        atualizarPrecoTotal();
    });

    return article;

}
function carregarProdutos(produtos){
    produtos.forEach(produto => {
        const section =document.getElementById("produtos");   
        section.append(criarProduto(produto));  
    });
}

function criarProdutoCesto (produto){
    const article = document.createElement(`article`); 

    const title = document.createElement (`h3`);         
    title.textContent = produto.title;
    article.append(title);

    const image = document.createElement(`img`);          //criar imagem do produto
    image.src= produto.image;
    article.append(image);
    
    const price = document.createElement(`h4`);
    price.textContent = produto.price + " €";
    article.append(price);

    const button = document.createElement(`button`);
    button.textContent = "- Remover do Cesto"
    article.append(button);
    button.addEventListener("click", () =>{
        //remove do localStorage
        const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) ; 
        const indice = lista.findIndex(item => item.id === produto.id);
        const retirado = lista.splice(indice, 1);
        localStorage.setItem('produtos-selecionados', JSON.stringify(lista));
        //remove da section
        const section =document.getElementById("cesto");  
        section.removeChild(article);

        atualizarPrecoTotal();
    });
    return article;


}

function atualizaCesto() {
    const section = document.getElementById("cesto");
    section.innerHTML = ''; // Limpa o conteúdo existente antes de adicionar novos elementos

    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    lista.forEach(produto => {
        section.append(criarProdutoCesto(produto));
    });
}

function atualizarPrecoTotal() {
    const lista = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const total = lista.reduce((acc, produto) => acc + produto.price, 0); // Soma os preços de todos os produtos
    const precoTotalElemento = document.getElementById("preco-total");

    if (precoTotalElemento) {
        precoTotalElemento.textContent = `Custo Total: ${total.toFixed(2)} €`;
    }
}

 

addEventListener("DOMContentLoaded",() => {
    carregarProdutos(produtos);
    atualizaCesto();
    atualizarPrecoTotal();
})