const generateVerificationCode = () => {
    // Genera un código de 6 dígitos aleatorio
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Almacena el código en el localStorage
    localStorage.setItem("verificationCode", verificationCode);
    
    return verificationCode;
  };
  
  export default generateVerificationCode;
  