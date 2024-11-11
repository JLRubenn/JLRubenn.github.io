
document.getElementById("btnClick").addEventListener("click", function() {
    this.textContent = "Você clicou!";
    this.style.backgroundColor = "#4CAF50";
    this.style.color = "#fff";
});


document.getElementById("btnClick").addEventListener("dblclick", function() {
    this.textContent = "Clique Aqui";
    this.style.backgroundColor = "";
    this.style.color = "";
});


const box = document.getElementById("box");
box.addEventListener("mouseover", function() {
    box.style.backgroundColor = "#FFC107";
    box.textContent = "Mouse sobre a caixa!";
});

box.addEventListener("mouseout", function() {
    box.style.backgroundColor = "#e0e0e0";
    box.textContent = "Passe o mouse aqui!";
});


box.addEventListener("mousemove", function(e) {
    box.textContent = `Posição do mouse: X=${e.clientX}, Y=${e.clientY}`;
});


const textInput = document.getElementById("textInput");
textInput.addEventListener("keydown", function() {
    textInput.style.backgroundColor = "#e6f7ff";
});

textInput.addEventListener("keyup", function() {
    textInput.style.backgroundColor = "";
});

const form = document.getElementById("myForm");
form.addEventListener("submit", function(event) {
    event.preventDefault(); 
    const name = document.getElementById("nameInput").value;
    document.getElementById("output").innerHTML = `<strong>Nome enviado:</strong> ${name}`;
    form.reset();
});


const nameInput = document.getElementById("nameInput");
nameInput.addEventListener("change", function() {
    document.getElementById("output").textContent = `Nome alterado para: ${nameInput.value}`;
});
