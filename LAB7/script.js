function showHoverMessage() {
    document.getElementById('hover-message').textContent = "Obrigado por passares!";
}

function resetHoverMessage() {
    document.getElementById('hover-message').textContent = "1. Passa por aqui!";
}

function changeH2Color(color) {
    document.querySelector('.inline h2').style.color = color;
}

function changeInputColor() {
    const input = document.getElementById('text-input');
    input.style.backgroundColor = getRandomColor();
}

function submitColor() {
    const color = document.getElementById('color-input').value.toLowerCase();
    document.body.style.backgroundColor = color;
}

let count = 0;
function incrementCounter() {
    count++;
    document.getElementById('counter').textContent = 'Contagem: ' + count;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}