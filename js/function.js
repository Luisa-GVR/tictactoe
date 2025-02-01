var siguiente=false;
var contador=0;
var timerEmpezado = false;
var timerIntervalo;
var segundos = 0;
var minutos = 0;
var lineaGanadora;


let tipo = null; 
let posiciones = [];

let imgX = "url(./img/x.png)"; 
let imgO = "url(./img/o.png)";

window.addEventListener('resize', function() {

    if (lineaGanadora != null) {
        lineaGanadora.remove(); // Eliminar la línea ganadora del DOM
        lineaGanadora = null;

        dibujarLineaGanadora(posiciones,tipo);
    }
});

// Timer y turno

function turno(boton) {


    if (!timerEmpezado) {
        startTimer(); 
        timerEmpezado = true;
    }


    boton.disabled = true;
    boton.style.backgroundImage = `url(${!siguiente ? imgX : imgO})`;
    boton.value = (!siguiente) ? "X" : "O";
    boton.style.backgroundSize = "cover";
    boton.style.backgroundPosition = "center";
    boton.style.backgroundRepeat = "no-repeat";

    boton.offsetHeight;

    siguiente = !siguiente;
    document.getElementById("Turno").innerHTML = siguiente ? "Turno: O" : "Turno: X";
    verificar();
    cambiarTema();

}

function startTimer() {
    timerIntervalo = setInterval(updateTimer, 1000); 
}

function updateTimer() {
    segundos++;
    if (segundos == 60) {
        segundos = 0;
        minutos++;
    }
    document.getElementById("timer").innerHTML = "Tiempo: " + formatTime(minutos) + ":" + formatTime(segundos);

    if(minutos == 3){
        bloquear();
        mostrarGanador("El gato ;) ");
        detenerTimer();
    }

}

function formatTime(tiempo) {
    return tiempo < 10 ? "0" + tiempo : tiempo;
}

function detenerTimer() {
    clearInterval(timerIntervalo);
}


function reiniciar() {
    var botones = document.querySelectorAll("input[type='button']");
    
    // quitar botones
    for (let i = 0; i < botones.length; i++) {
        botones[i].value = "";
        botones[i].disabled = false;
        botones[i].style.backgroundColor = ""; 
        botones[i].style.backgroundImage = "";
    }

    lineaGanadora.remove(); // Eliminar la línea ganadora del DOM
    lineaGanadora = null;

    
    siguiente = false;
    contador = 0;
    document.getElementById("Turno").innerHTML = "Turno: X";
    document.getElementById("timer").innerHTML = "Tiempo: 00:00";
    segundos = 0;
    minutos = 0;
    timerEmpezado = false;
    tipo = null; 
    posiciones = [];
    detenerTimer();
}



function verificar() {


    cambiarColores();

    var botones = document.querySelectorAll("input[type='button']");
    if (++contador == 9) {
        document.getElementById("Turno").innerHTML = `Empate`;
        detenerTimer();
    }
     // Horizontales
     if (botones[0].value == botones[1].value && botones[1].value == botones[2].value && botones[0].value != "") {
        mostrarGanador(botones[0].value);
        tipo = "horizontal";
        posiciones = [0, 1, 2];
    } else if (botones[3].value == botones[4].value && botones[4].value == botones[5].value && botones[3].value != "") {
        mostrarGanador(botones[3].value);
        tipo = "horizontal";
        posiciones = [3, 4, 5];
    } else if (botones[6].value == botones[7].value && botones[7].value == botones[8].value && botones[6].value != "") {
        mostrarGanador(botones[6].value);
        tipo = "horizontal";
        posiciones = [6, 7, 8];
    }
    // Verticales
    else if (botones[0].value == botones[3].value && botones[3].value == botones[6].value && botones[0].value != "") {
        mostrarGanador(botones[0].value);
        tipo = "vertical";
        posiciones = [0, 3, 6];
    } else if (botones[1].value == botones[4].value && botones[4].value == botones[7].value && botones[1].value != "") {
        mostrarGanador(botones[1].value);
        tipo = "vertical";
        posiciones = [1, 4, 7];
    } else if (botones[2].value == botones[5].value && botones[5].value == botones[8].value && botones[2].value != "") {
        mostrarGanador(botones[2].value);
        tipo = "vertical";
        posiciones = [2, 5, 8];
    }
    // Diagonales
    else if (botones[0].value == botones[4].value && botones[4].value == botones[8].value && botones[0].value != "") {
        mostrarGanador(botones[0].value);
        tipo = "diagonal";
        posiciones = [0, 4, 8];
    } else if (botones[2].value == botones[4].value && botones[4].value == botones[6].value && botones[2].value != "") {
        mostrarGanador(botones[2].value);
        tipo = "diagonal";
        posiciones = [2, 4, 6];
    }

    if (tipo && posiciones.length > 0) {
        dibujarLineaGanadora(posiciones, tipo);
    }

}



function dibujarLineaGanadora(posiciones, tipo) {
    var linea = document.createElement("div");
    linea.classList.add("linea-ganadora");

    var botones = document.querySelectorAll("input[type='button']");
    var contenedor = botones[0].closest('.grid'); 

    // Obtenemos las coordenadas de los botones
    var coord1 = getCoordinates(botones[posiciones[0]]);
    var coord2 = getCoordinates(botones[posiciones[1]]);
    var coord3 = getCoordinates(botones[posiciones[2]]);

    
    linea.style.position = "absolute";
    linea.style.zIndex = "10"; 
    linea.style.backgroundColor = colorGanador; 

    if (tipo === "horizontal") {
        // Recalcular las coordenadas en función del zoom y la escala
        const scaleX = contenedor.getBoundingClientRect().width / contenedor.offsetWidth;
        
        // Ajustar la posición horizontal de la línea, incluyendo el desplazamiento
        linea.style.top = `${coord1.top + contenedor.scrollTop + coord1.height / 2}px`;
        linea.style.left = `${coord1.left + contenedor.scrollLeft}px`; // Considerar el desplazamiento en el eje X

        // Ajustar el ancho de la línea basado en las posiciones de los botones
        linea.style.width = `${(coord3.left + coord3.width) - coord1.left}px`;  
        linea.style.height = "3px"; 
    } else if (tipo === "vertical") {

        linea.style.left = `${coord1.left + contenedor.scrollLeft + coord1.width / 2}px`;
        linea.style.top = `${coord1.top + contenedor.scrollTop}px`;
        linea.style.height = `${coord1.height * 3}px`; 
        linea.style.width = "3px"; 
    } else if (tipo === "diagonal") {
        
        var center1 = {
            x: coord1.left + coord1.width / 2,
            y: coord1.top + coord1.height / 2
        };
        
        var center2 = {
            x: coord3.left + coord3.width / 2,
            y: coord3.top + coord3.height / 2
        };

        var linea = document.createElement('div');
        document.body.appendChild(linea); 

        var dx = center2.x - center1.x;
        var dy = center2.y - center1.y;
        var length = Math.sqrt(dx * dx + dy * dy); 
        var angle = Math.atan2(dy, dx) * (180 / Math.PI); // Ángulo

        linea.style.position = 'absolute';
        linea.style.width = length + 'px';
        linea.style.height = '2px'; 
        linea.style.backgroundColor = colorGanador;
        linea.style.top = center1.y + 'px';
        linea.style.left = center1.x + 'px';
        linea.style.transformOrigin = '0 0';
        linea.style.transform = 'rotate(' + angle + 'deg)';
    }

    lineaGanadora = linea;

    contenedor.appendChild(linea);
}

function getCoordinates(button) {
    var rect = button.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };
}


function mostrarGanador(ganador) {
    document.getElementById("Turno").innerHTML = `Gana: ${ganador}`;
    bloquear();
    detenerTimer();
}

function bloquear(){
    var botones=document.querySelectorAll("input[type='button']");
    for (let i = 0; i < botones.length; i++) {
        botones[i].disabled=true;
    }
}


//colores

var colorX = "#d18b47";
var colorO = "#AD2E24";
var colorGanador = "#861F18"

function cambiarColores() {
    colorX = (document.getElementById('colorXID')).value;
    colorO = (document.getElementById('colorOID')).value;
    colorGanador = (document.getElementById('colorGanadorID')).value;
    
    var botones = document.querySelectorAll("input[type='button']");

    botones.forEach(function(boton) {
        if (boton.value === "X") {
            boton.style.backgroundColor = colorX;
        } else if (boton.value === "O") {
            boton.style.backgroundColor = colorO;
        }
    });

    if (lineaGanadora) {
        lineaGanadora.style.backgroundColor = colorGanador;
    }

}


//imagenes
function cambiarTema() {
    const temaX = document.getElementById("temaX").value;
    const temaO = document.getElementById("temaO").value;
    const botones = document.querySelectorAll(".grid input");

    let imgX = "";
    let imgO = "";

    switch (temaX) {
        case "default":
            imgX = "url(./img/x.png)";
            break;
        case "binario":
            imgX = "url(./img/1.png)";
            break;
        case "perrito":
            imgX = "url(./img/perro.png)";
            break;
    }

    switch (temaO) {
        case "default":
            imgO = "url(./img/o.png)";
            break;
        case "binario":
            imgO = "url(./img/0.png)";
            break;
        case "gatito":
            imgO = "url(./img/gato.png)";
            break;
    }

    botones.forEach(boton => {
        boton.style.backgroundImage = "";
        if (boton.value === "X") {
            boton.style.backgroundImage = imgX;
        } else if (boton.value === "O") {
            boton.style.backgroundImage = imgO;
        }
        boton.style.backgroundSize = "cover";
        boton.style.backgroundPosition = "center";
        boton.style.backgroundRepeat = "no-repeat";
    });
}
