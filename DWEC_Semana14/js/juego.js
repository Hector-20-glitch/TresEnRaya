class Juego{


constructor(){


this.id=null;


this.tablero=[

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


this.turno="X";


this.terminado=false;



this.combinaciones=[

[0,1,2],

[3,4,5],

[6,7,8],

[0,3,6],

[1,4,7],

[2,5,8],

[0,4,8],

[2,4,6]

];


}





jugar(posicion,jugador){



if(this.terminado){

return false;

}




if(this.tablero[posicion] !== ""){

return false;

}




this.tablero[posicion]=jugador;



return true;


}







verificarGanador(){



for(let combinacion of this.combinaciones){



let a=combinacion[0];

let b=combinacion[1];

let c=combinacion[2];





if(

this.tablero[a] !== ""

&&

this.tablero[a] === this.tablero[b]

&&

this.tablero[a] === this.tablero[c]

){


return this.tablero[a];


}


}




return null;


}







verificarEmpate(){


return this.tablero.every(

casilla=>casilla!==""

);


}







cambiarTurno(){



this.turno =

this.turno==="X"

?

"O"

:

"X";


}







actualizar(tablero,turno){



this.tablero=tablero;


this.turno=turno;


}



}




const juego=new Juego();