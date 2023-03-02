

// Variables del dom
const inputLetra = document.getElementsByClassName("container-input-letter")[0].getElementsByTagName("input")[0];
const cajaError = document.getElementsByClassName("caja-error")[0];
const btnAgregar = document.getElementsByClassName('container-input-letter')[0].getElementsByTagName('button')[0];
const inputAgregar= document.getElementsByClassName('container-input-letter')[0].getElementsByTagName('input')[0]
const imgAhorcado = document.getElementById('imgAhorcado');
const cajafallo = document.getElementsByClassName("caja-fallo")[0];
const modalOpciones= document.getElementsByClassName('modal-opciones')[0];
const cajaLetras = document.getElementsByClassName('cajaLetras')[0];
const btnJugar = document.getElementById("btnJugar");
const btnCrearPalabra = document.getElementById("crearPalabra");
const btnVolverAlInicio = document.getElementById("volverAlInicio");
const fila1 = document.getElementById('fila1');
const fila2 = document.getElementById('fila2');
const blurDiv = document.getElementById('blurDiv');
modalOpciones.style.display = 'none';

//Variables y arrays para manipular 
let palabraSeleccionada = "";
let intentos = 0;
let aciertos = 0;

let arrayInput = []

const palabras = [
    "patata",
    "pera",
    "cama",
    "javascript",
    "casa",
    "perro",
    "gato",
    "cerveza",
    "estilos",
    "cascada",
    "permutar"
];


/* ------------------------------------
                Funciones
    ------------------------------------     */
    
const isValidInput= (letra)=>{
    let isValid = false;
    cajaError.innerHTML="";
    let error = ""

    //comparando si el input que se ha introducido es solo una letra
    if(letra.length > 1){
        error = "Solamente puedes introducir una letra";
    }else if(letra.length === 1){
        //comparando que el input sea una sola letra y que sea un string
        if((letra.charCodeAt(0) >= 65 && letra.charCodeAt(0) <=90) || (letra.charCodeAt(0) >= 97 && letra.charCodeAt(0) <=122) ){
            //comparando si la letra ha sido introducida antes con operador ternario
            arrayInput.includes(letra) ? 
            error = `Ya has introducido la letra ${letra.toUpperCase()}` 
            : (arrayInput.push(letra),isValid = true);

        } else{
            error = "Solo puedes introducir letras" ;
        }

    }else if(letra.length === 0){
       error = "Tienes que introducir una letra";
    }

    if(error.length > 0){
        let newError = document.createTextNode(error);
        cajaError.appendChild(newError);
        isValid = false;
    }

    inputLetra.value = "";
    
    //retornando si es válido que introduce el usuario una letra
    return isValid;

}

//Empezamos eligiendo la palabra random para generar lo demás
const elegirPalabraRandom = () =>{
    const numAleatorio = Math.ceil( (Math.random() *palabras.length)-1);
    return palabras[numAleatorio];
}

//acá genero la tabla con la cantidad de columnas por filas

const renderizarTabla = (palabra)=>{
    palabraSeleccionada=palabra;
    const numeroLetras = palabra.length;
    //recorriendo la palabra para generar la cantidad de TD
    for(let i=0;i<numeroLetras;i++){
        let TD1 = document.createElement('TD');
        let TD2 = document.createElement('TD');
        let hr = document.createElement("HR");
        TD1.setAttribute("id",i)
        TD1.innerHTML= `&nbsp;`;
        TD2.appendChild(hr);
        fila1.appendChild(TD1);
        fila2.appendChild(TD2);
    }
}

const btnPresionado = (valor)=>{
    main(String.fromCharCode(valor));
}

const generarLetras = () =>{

    if(cajaLetras.childElementCount === 0){
        const fragment = document.createDocumentFragment();
        for(let i=0;i<26;i++){
            let btn = document.createElement('BUTTON');
            let codeLetra = 97+i;
            btn.setAttribute('class','btnLetra')
            btn.setAttribute('id',codeLetra.toString());
            btn.setAttribute('onclick',`btnPresionado(${codeLetra})`)
            btn.textContent = `${String.fromCharCode(codeLetra).toUpperCase()}`;
            fragment.append(btn);
        }
        cajaLetras.append(fragment);
    }

}

const reiniciar = ()=>{
    btnVolverAlInicio.style.visibility='hidden';
    btnJugar.disabled=false;
    limpiarMemoria();
    limpiarFilas();
    cajafallo.innerHTML="";
    cajaError.innerHTML="";
    btnCrearPalabra.style.visibility = 'visible';
    inputAgregar.disabled=true;
    btnAgregar.disabled=true;
}

const limpiarFilas = () =>{
    fila1.innerHTML="";
    fila2.innerHTML="";
}

const jugar = () =>{
    btnCrearPalabra.style.visibility = 'hidden';
    limpiarFilas();
    cajafallo.innerHTML="";
    // limpiarMemoria();
    btnJugar.disabled=true;
    inputAgregar.disabled=false;
    btnAgregar.disabled=false;
    btnVolverAlInicio.style.visibility='visible';
    palabraSeleccionada = elegirPalabraRandom();
    renderizarTabla(palabraSeleccionada);
    generarLetras();
}

//función para comparar cada entrada del input
const compararPalabraContraLetra = (letra)=>{
    let coincidencia = false;
    for(let i=0;i<palabraSeleccionada.length;i++){
        if(palabraSeleccionada[i] == letra){
            document.getElementById(i.toString()).innerHTML=`${letra.toUpperCase()}`;
            coincidencia = true;
            aciertos++;
        }
    }
    return coincidencia;
}

const deshabilitarInputs = ()=>{
    inputAgregar.disabled=true;
    btnAgregar.disabled=true;
}

const limpiarMemoria = ()=>{
    cajaLetras.innerHTML="";
    intentos = 0;
    aciertos = 0;
    arrayInput = [];
}

const main = (letra) =>{

    letra = letra.toLowerCase(); // convirtiendo letra a minúscula
    if(isValidInput(letra)){

        let coincidencia = compararPalabraContraLetra(letra);
        if(!coincidencia){
           intentos++; 
           imgAhorcado.src = `./img/ahorcado${intentos}.jpg`;
        }

        if(intentos>=6){
            // función para deshabilitar el botón y el input tipo texto
            deshabilitarInputs();
            btnJugar.disabled = false;
            limpiarMemoria();
            btnVolverAlInicio.style.visibility = 'hidden';
            // Función que se ejecuta 1 segundo después de haber fallado
            setTimeout(()=>{
                cajafallo.innerHTML=`Perdiste, la palabra era: ${palabraSeleccionada}`;
            },1000);
        }else if(aciertos === palabraSeleccionada.length){
            // función para deshabilitar el botón y el input tipo texto
            deshabilitarInputs();
            limpiarMemoria();
            btnJugar.disabled = false;
            btnVolverAlInicio.style.visibility = 'hidden';
            // Función que se ejecuta 1 segundo después de haber Acertado para genrerar la pantalla de ganaste o perdiste;
            setTimeout(()=>{
                cajafallo.innerHTML='Has Ganado';
            },1000);

            console.log("has ganado");
        }
    }
}

const opciones = ()=>{
    blurDiv.classList.add('blur');
    // modalOpciones.style.visibility= 'visible';
    modalOpciones.style.display='flex';
}

const crearPalabra = ()=>{
    console.log("creando nueva palabra");
}


const cerrarModal=()=>{
    blurDiv.classList.remove('blur');
    // modalOpciones.style.visibility= 'hidden';
    modalOpciones.style.display = 'none';

}
const abrirNavInstrucciones=()=>{
    document.getElementsByClassName('nav-instrucciones')[0].style.visibility = 'visible';
}

const cerrarNavInstrucciones=()=>{
    document.getElementsByClassName('nav-instrucciones')[0].style.visibility = 'hidden';
}



/* ------------------------------------
                Eventos
    ------------------------------------     */

//evento para crear un modal de opciones para agregar palabras al array

// Añadiendo una escucha de evento para cuando se presione enter
inputLetra.addEventListener("keypress",(evt)=>{
    if(evt.key ==="Enter"){
        //tomo el valor del input
        let letra = inputLetra.value;
        main(letra);
    }
})

// función a ejecutar cuando se ejecute el evento onclick
const agregarLetra = () =>{
    //tomo el valor del input
    let letra = inputLetra.value;
    main(letra);
}
