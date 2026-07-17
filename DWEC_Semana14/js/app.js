const casillas =
document.querySelectorAll(".casilla");


const turnoTexto =
document.getElementById("turno");


const resultado =
document.getElementById("resultado");


const reiniciar =
document.getElementById("reiniciar");



let codigoPartida="";

let jugador="";

let canalPartida=null;





// =================================
// CREAR PARTIDA
// =================================


async function crearPartida(){



codigoPartida =
Math.random()
.toString(36)
.substring(2,8)
.toUpperCase();



jugador="X";



let tableroInicial=[

"",
"",
"",
"",
"",
"",
"",
"",
""

];





const {data,error}=await supabaseClient

.from("partidas")

.insert({

codigo:codigoPartida,

jugador_x:"Jugador X",

tablero:tableroInicial,

turno:"X",

ganador:null

})

.select()

.single();





if(error){

console.error(error);

return;

}




juego.id=data.id;



juego.actualizar(

data.tablero,

data.turno

);



juego.terminado=false;



dibujar();



alert(

"Código de partida: "

+
codigoPartida

);



escucharCambios();



}







// =================================
// UNIRSE PARTIDA
// =================================


async function unirsePartida(){



codigoPartida =
prompt(
"Ingresa código"
);




const {data,error}=await supabaseClient

.from("partidas")

.select("*")

.eq(

"codigo",

codigoPartida

)

.maybeSingle();





if(error || !data){


alert(
"No existe partida"
);


return;


}




jugador="O";





await supabaseClient

.from("partidas")

.update({

jugador_o:"Jugador O"

})

.eq(

"id",

data.id

);





juego.id=data.id;



juego.actualizar(

data.tablero,

data.turno

);



juego.terminado=false;



dibujar();



escucharCambios();



}









// =================================
// JUGAR
// =================================


casillas.forEach(casilla=>{


casilla.addEventListener(

"click",

async()=>{





if(!juego.id){

return;

}



if(juego.terminado){

return;

}





if(juego.turno !== jugador){


console.log(
"No es tu turno"
);


return;


}





let posicion =
casilla.dataset.pos;





let movimiento =
juego.jugar(

posicion,

jugador

);





if(!movimiento){

return;

}






let ganador =
juego.verificarGanador();



let mensaje=null;





if(ganador){


mensaje =
"Ganó el jugador "
+
ganador;



juego.terminado=true;


}





else if(juego.verificarEmpate()){



mensaje="Empate";


juego.terminado=true;


}







juego.cambiarTurno();







const {error}=await supabaseClient

.from("partidas")

.update({

tablero:juego.tablero,

turno:juego.turno,

ganador:mensaje

})

.eq(

"id",

juego.id

);






if(error){

console.error(error);

}





dibujar();





if(mensaje){


resultado.textContent=mensaje;


}



}

);


});










// =================================
// REALTIME
// =================================


function escucharCambios(){



if(canalPartida){

return;

}





canalPartida =
supabaseClient



.channel(

"partida-online"

)





.on(

"postgres_changes",

{

event:"UPDATE",

schema:"public",

table:"partidas",

filter:

"id=eq."+juego.id


},



(payload)=>{





juego.actualizar(

payload.new.tablero,

payload.new.turno

);





dibujar();





if(payload.new.ganador){



resultado.textContent =
payload.new.ganador;



juego.terminado=true;



}



}



)



.subscribe(

status=>{


console.log(

"Realtime:",

status

);


}

);



}










// =================================
// REINICIAR PARTIDA
// =================================


reiniciar.addEventListener(

"click",

async()=>{



if(!juego.id){

return;

}





let nuevoTablero=[

"",
"",
"",
"",
"",
"",
"",
"",
""

];





const {error}=await supabaseClient

.from("partidas")

.update({

tablero:nuevoTablero,

turno:"X",

ganador:null

})

.eq(

"id",

juego.id

);






if(error){


console.error(error);


return;


}





juego.actualizar(

nuevoTablero,

"X"

);



juego.terminado=false;



resultado.textContent="";



dibujar();



}

);










// =================================
// DIBUJAR
// =================================


function dibujar(){



casillas.forEach(casilla=>{


casilla.textContent =

juego.tablero[

casilla.dataset.pos

];


});





turnoTexto.textContent =

"Turno jugador "

+

juego.turno;



}