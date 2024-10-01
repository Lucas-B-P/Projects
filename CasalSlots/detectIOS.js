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
