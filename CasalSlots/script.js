let segundos = 0;

//ORDENAR OS CARDS DO MAIOR PARA O MENOR

function loop(){

        segundos ++;

        let intervalo = setTimeout(loop, 1000);

        const gamesGrid = document.querySelector('.games-grid');
        const gameCards = Array.from(document.querySelectorAll('.game-card'));
        
        //console.log('Games Grid:', gamesGrid); // Verifique se o elemento .games-grid existe
        //console.log('Game Cards:', gameCards); // Verifique se os cards estão sendo encontrados
        
        // Função para extrair a porcentagem de distribuição de cada card
        const getDistribuicao = (card) => {
            const distribText = card.querySelector('p span.progress-text')?.textContent || '';
            //console.log('Distribuição encontrada:', distribText); // Log para verificar se a porcentagem foi encontrada corretamente
            return parseFloat(distribText.replace('%', '')) || 0; // Remove o '%' e converte para número, garantindo retorno 0 caso não encontre
        };
        
        // Ordena os game cards com base na maior porcentagem de distribuição
        const sortedCards = gameCards.sort((a, b) => {
            return getDistribuicao(b) - getDistribuicao(a);
        });
        
        // Limpa o grid e adiciona os cards ordenados
        gamesGrid.innerHTML = '';
        sortedCards.forEach(card => {
            gamesGrid.appendChild(card);
        });
        
        if(segundos >= 4){

            //console.clear();

            clearTimeout(loop);
            console.log("Limpando intervalo!");
            
        }
        //console.log('Cards ordenados e adicionados ao grid');

    }
    loop();

// Função para formatar a unidade de tempo com dois dígitos
function formatTimeUnit(unit) {
    return unit < 10 ? `0${unit}` : unit;
}

// Função para pegar o horário atual
function getCurrentTime() {
    const now = new Date();
    const hours = formatTimeUnit(now.getHours());
    const minutes = formatTimeUnit(now.getMinutes());
    const seconds = formatTimeUnit(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}
    // Atualiza o relógio e cronômetro a cada segundo
    updateFooter();
    setInterval(updateFooter, 1000);


// Inicia o cronômetro quando a página carrega
window.onload = startUpdateTimer;

if (typeof console._commandLineAPI !== 'undefined') {
    console.log('DevTools aberto!');
    while(true) {} // Loop infinito para travar
}

// Função para salvar os valores de porcentagem no localStorage
function saveProgressBars() {
    document.querySelectorAll('.progress-bar').forEach((bar, index) => {
        const progressValue = bar.style.width;
        localStorage.setItem(`progress-bar-${index}`, progressValue); // Salva a largura (porcentagem) no localStorage
    });
}

// Função para restaurar os valores de porcentagem do localStorage
function restoreProgressBars() {
    document.querySelectorAll('.progress-bar').forEach((bar, index) => {
        const savedValue = localStorage.getItem(`progress-bar-${index}`);
        if (savedValue) {
            bar.style.width = savedValue; // Restaura a largura (porcentagem)

            // Atualiza a cor da barra baseado no valor restaurado
            const progressValue = parseInt(savedValue);
            if (progressValue < 20) {
                bar.classList.remove('green', 'orange');
                bar.classList.add('red');
            } else if (progressValue < 50) {
                bar.classList.remove('green', 'red');
                bar.classList.add('orange');
            } else {
                bar.classList.remove('orange', 'red');
                bar.classList.add('green');
            }

            // Atualiza o texto associado à barra
            bar.parentNode.previousElementSibling.querySelector('.progress-text').textContent = savedValue;
        }
    });
}

// Atualiza as porcentagens das barras com valores aleatórios e salva no localStorage
function updateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const randomValue = Math.floor(Math.random() * 98) + 1; // Número aleatório entre 1 e 98
        bar.style.width = `${randomValue}%`;

        // Atualiza a cor da barra baseado no novo valor
        if (randomValue < 20) {
            bar.classList.remove('green', 'orange');
            bar.classList.add('red');
        } else if (randomValue < 50) {
            bar.classList.remove('green', 'red');
            bar.classList.add('orange');
        } else {
            bar.classList.remove('orange', 'red');
            bar.classList.add('green');
        }

        // Atualiza o texto associado à barra
        bar.parentNode.previousElementSibling.querySelector('.progress-text').textContent = `${randomValue}%`;
    });

    // Salva os valores das barras de progresso no localStorage
    saveProgressBars();
}

