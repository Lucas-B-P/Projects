function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function checkLowPowerMode() {
    if (navigator.userAgent.includes("iPhone")) {
        alert("Para uma melhor experiência, desative o modo de baixo consumo de energia nas configurações do seu iPhone.");
    }
}


window.onload = function() {
    checkLowPowerMode();
};

const updateTimeElement = document.getElementById('update-time');
let tempoRestante;

const updateTimeElement = document.getElementById('update-time');
let tempoRestante;

// FILTRA OS JOGOS NA BARRA DE PESQUISA
document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');

    const searchInput = document.querySelector('#pesquisar');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase(); // Pegando o valor do campo de busca em minúsculo

        gameCards.forEach(card => {
            const cardName = card.querySelector('h3').textContent.toLowerCase(); // Nome do jogo em minúsculo

            if (cardName.includes(searchTerm)) {
                card.style.display = ''; // Mostra o card
            } else {
                card.style.display = 'none'; // Esconde o card
            }
        });
    });
});

async function pegarTempo() {
    const url = "https://temmp-woad.vercel.app";
    try {
        const resultado = await fetch(url);
        if (!resultado.ok) throw new Error('Erro ao buscar tempo');
        const tempo = await resultado.json();
        return tempo.timeLeft;
    } catch (error) {
        console.error(error);
        return 0; // Retorna 0 em caso de erro
    }
}

async function inicializarTempo() {
    tempoRestante = await pegarTempo();
    console.log(`Tempo inicial: ${tempoRestante} segundos`);
    atualizarDisplayTempo();
}

function obterHorario() {
    const agora = new Date();
    const horario = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return { horario, minutos };
}

function atualizarDisplayTempo() {
    const { horario, minutos } = obterHorario();
    updateTimeElement.innerHTML = `
        <p>Última atualização: ${horario}:${minutos}</p>
        <p>Próxima atualização em: ${formatTimeUnit(tempoRestante)} segundos</p>
    `;
}

async function atualizarTempo() {
    if (tempoRestante <= 0) {
        tempoRestante = await pegarTempo();
        console.log(`Tempo recarregado: ${tempoRestante} segundos`);
        atualizarDisplayTempo();
        atualizarProgressBars(); // Atualiza as barras de progresso
    } else {
        tempoRestante--;
    }

    updateTimeElement.querySelector('p:last-child').textContent = `Próxima atualização em: ${formatTimeUnit(tempoRestante)} segundos`;
}

document.addEventListener("DOMContentLoaded", function () {
    inicializarTempo();
    setInterval(atualizarTempo, 1000); // Atualiza o tempo a cada segundo
    setInterval(ordenarGameCards, 4000); // Reordena os cards a cada 4 segundos
});

// Função para ordenar e exibir os cards
function ordenarGameCards() {
    const gameCards = document.querySelectorAll(".game-card");
    const gamesGrid = document.querySelector(".games-grid");
    const cardsArray = Array.from(gameCards);

    // Ordena com base no valor de "Distribuição"
    cardsArray.sort((a, b) => {
        const distA = parseFloat(a.querySelector(".progress-text").innerText.replace("%", ""));
        const distB = parseFloat(b.querySelector(".progress-text").innerText.replace("%", ""));
        return distB - distA; // Ordem decrescente
    });

    // Limpa o grid de jogos
    gamesGrid.innerHTML = "";

    // Reinsere os game-cards ordenados
    cardsArray.forEach(card => {
        gamesGrid.appendChild(card);
    });
}

// Função para formatar a unidade de tempo com dois dígitos
function formatTimeUnit(unit) {
    return unit < 10 ? `0${unit}` : unit;
}

// Função para salvar os valores de porcentagem no localStorage
function saveProgressBars() {
    document.querySelectorAll('.progress-bar').forEach((bar, index) => {
        const progressValue = bar.style.width;
        localStorage.setItem(`progress-bar-${index}`, progressValue);
    });
}

// Função para restaurar os valores de porcentagem do localStorage
function restoreProgressBars() {
    document.querySelectorAll('.progress-bar').forEach((bar, index) => {
        const savedValue = localStorage.getItem(`progress-bar-${index}`);
        if (savedValue) {
            bar.style.width = savedValue;
            updateProgressBarColor(bar);
            bar.parentNode.previousElementSibling.querySelector('.progress-text').textContent = savedValue;
        }
    });
}

// Função para atualizar a cor da barra de progresso
function updateProgressBarColor(bar) {
    const progressValue = parseInt(bar.style.width);
    bar.classList.remove('green', 'orange', 'red');
    if (progressValue < 20) {
        bar.classList.add('red');
    } else if (progressValue < 50) {
        bar.classList.add('orange');
    } else {
        bar.classList.add('green');
    }
}

// Atualiza as porcentagens das barras com valores aleatórios e salva no localStorage
function atualizarProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const randomValue = Math.floor(Math.random() * 98) + 1; // Número aleatório entre 1 e 98
        bar.style.width = `${randomValue}%`;
        updateProgressBarColor(bar);
        bar.parentNode.previousElementSibling.querySelector('.progress-text').textContent = `${randomValue}%`;
    });

    // Salva os valores das barras de progresso no localStorage
    saveProgressBars();
}

// Chama a função de restauração de progresso ao carregar
restoreProgressBars();
