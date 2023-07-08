var secuencia = [];
var modoJugador = false;
var timerTurno = null;
var pasoJugador = 0;

function cambiarPantalla(displayInicio, displayJuego) {
  var pantallaInicio = document.getElementById("pantallaInicio");
  pantallaInicio.style.display = displayInicio;
  var pantallaJuego = document.getElementById("pantallaJuego");
  pantallaJuego.style.display = displayJuego;
}

function empezarJuego() {
  // muestro pantalla de juego
  cambiarPantalla('none', 'block');

  // inicializo secuencia
  secuencia = [];
  
  // comienzo secuencia de computadora
  empezarTurnoComputadora();
}

function volver() {
  // detengo el modo jugador y limpio el timer de juego
  modoJugador = false;
  clearTimeout(timerTurno);

  // vuelvo a pantalla de inicio
  cambiarPantalla('block', 'none');
}

function empezarTurnoComputadora() {
  // remuevo estilos del modo jugador en los botones
  limpiarEstilosModoJugador();

  // Espero 3 segundos y arranco la secuencia a imitar
  setTimeout(function() {
    ejecutarPaso(0);
  }, 1500)
}

function ejecutarPaso(pasoSecuencia) {
  setTimeout(function() {
    // remuevo la secuencia actual seleccionada
    // en caso que haya alguna
    limpiarSecuenciaActual();

    // si llegó al último paso de la secuencia,
    // agrego un nuevo paso a la secuencia, lo ejecuto
    // e inicio el turno del jugador 
    if (pasoSecuencia === secuencia.length) {
      agregarPasoSecuencia();

      pintarPasoSecuencia(pasoSecuencia);
      
      pasoJugador = 0;

      setTimeout(() => {
        limpiarSecuenciaActual();
        empezarTurnoJugador();
      }, 1000);
    }
    else {
      // Si no llegué al ultimo paso de la secuencia,
      // ejecuto el paso actual y paso al siguiente paso
      // (llamada recursiva para continuar validando si se llegó al final)
      pintarPasoSecuencia(pasoSecuencia);

      ejecutarPaso(pasoSecuencia + 1);
    }
  }, 1000)
}

function agregarPasoSecuencia() {
  // ejecuto lógica para calcular un número aleatorio del 1 al 4
  var max = 4;
  var min = 1;
  var nuevoPaso = Math.floor(Math.random() * (max - min + 1) + min);
  
  // agrego el nuevo paso a la secuencia
  secuencia.push(nuevoPaso);
}

function pintarPasoSecuencia(pasoSecuencia) {
  // busco el boton de la secuencia por ID y le agrego la clase 'activo'
  // los botones estan identificados como boton-secuencia-[1|2|3|4]
  document.getElementById("boton-secuencia-" + secuencia[pasoSecuencia]).classList.add("activo");

  // luego de pintar el paso, limpio los estilos al poco tiempo
  setTimeout(() => {
    limpiarSecuenciaActual();  
  }, 500);
}

function limpiarEstilosModoJugador() {
  // limpio estilos del modo jugador en los botones
  var botones = document.getElementsByClassName("boton-secuencia");

  for (let index = 0; index < botones.length; index++) {
    botones[index].classList.remove("modo-jugador");
  }
}

function limpiarSecuenciaActual() {
  // limpio la clase 'activo' de cualquier botón de la secuencia
  // remuevo estilos del modo jugador en los botones
  var botones = document.getElementsByClassName("boton-secuencia");

  for (let index = 0; index < botones.length; index++) {
    botones[index].classList.remove("activo");
  }
}

function empezarTurnoJugador() {
  // pongo estilos del modo jugador
  var botones = document.getElementsByClassName("boton-secuencia");

  for (let index = 0; index < botones.length; index++) {
    botones[index].classList.add("modo-jugador");
  }

  // limpio el timer del turno del jugador si existe alguno activo
  clearTimeout(timerTurno);

  // inicio el modo jugador
  modoJugador = true;

  // inicio un timer para el tiempo de juego 
  timerTurno = setTimeout(() => {
    alert('Se ha agotado su tiempo de espera. Ha alcanzado ' + (secuencia.length - 1) + ' pasos.');

    // vuelvo al inicio
    volver();
  }, 3000);
}

function validarPasoJugador(e) {
  // si no se encuentra activo el modo jugador
  // ignoro las acciones del usuario en los botones
  if (!modoJugador) {
    return;
  }

  // limpio el timer del turno para reiniciarlo luego
  clearTimeout(timerTurno);

  // obtengo el botón presionado por medio de su ID
  var botonPresionado = parseInt(e.target.id.replace("boton-secuencia-", ""));
  
  // si el jugador presionó un un paso de la secuencia incorrecto, pierde
  if(secuencia[pasoJugador] !== botonPresionado) {
    alert('Ha seleccionado un paso incorrecto en la secuencia. Ha alcanzado ' + (secuencia.length - 1) + ' pasos.');
    volver();
    return;
  }

  // si el jugador llegó al último paso de la secuencia
  // inicio nuevamente la secuencia para agregar un nuevo paso
  if(pasoJugador === secuencia.length - 1) {
    // desactivo el modo jugador
    modoJugador = false;

    empezarTurnoComputadora();
    return;
  }

  // si el jugador presionó correctamente la secuencia actual
  // y quedan pasos en la secuencia, se espera el próximo paso del jugador
  pasoJugador = pasoJugador + 1;
  empezarTurnoJugador();
}

function botonPresionado(e) {
  if (!modoJugador) {
    return;
  }

  e.target.classList.add("activo");
}

function botonSoltado(e) {
  if (!modoJugador) {
    return;
  }

  e.target.classList.remove("activo");
}