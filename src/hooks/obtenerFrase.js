import frasesTarot from "../utils/phrases";



const obtenerFraseAleatoria = (grupo) => {
    const frases = frasesTarot[grupo];
    return frases[Math.floor(Math.random() * frases.length)];
  };


  export default obtenerFraseAleatoria