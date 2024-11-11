
const showHoverMessage = () => {
    document.getElementById('hover-message').textContent = "Obrigado por passares!";
};


const resetHoverMessage = () => {
    document.getElementById('hover-message').textContent = "1. Passa por aqui!";
};

document.querySelectorAll('[data-color]').forEach(button => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;
        document.querySelector('.inline h2').style.color = color;
    });
});


function changeInputColor() {
    const input = document.getElementById('text-input');
    input.style.backgroundColor = getRandomColor();
}


function changeBackgroundColor(select) {
    document.body.style.backgroundColor = select.value;
}


if (!localStorage.getItem('counter')) {
    localStorage.setItem('counter', 0);
}


function incrementCounter() {
    let count = parseInt(localStorage.getItem('counter'), 10);
    count++;
    document.getElementById('counter').textContent = 'Contagem: ' + count;
    localStorage.setItem('counter', count);
}


document.getElementById('counter').textContent = 'Contagem: ' + localStorage.getItem('counter');


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


document.querySelector('#user-form').onsubmit = (e) => {
    e.preventDefault(); 
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    document.getElementById('greeting-message').textContent = `Olá, o ${name} tem ${age}!`;
};


let autoCounter = 0;
function autoIncrementCounter() {
    autoCounter++;
    document.getElementById('auto-counter').textContent = 'Automatic Counter: ' + autoCounter;
}


setInterval(autoIncrementCounter, 1000);