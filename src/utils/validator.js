// validators.js

// Validar email
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  
  // Validar contraseña
  export const validatePassword = (password) => {
    // Al menos una mayúscula, una minúscula, un número, un caracter especial, sin espacios
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/;
    return re.test(password);
  };
  
  // Función de validación general
  export const validateForm = (email, password) => {
    const errors = {};
  
    if (!validateEmail(email)) {
      errors.email = "El email no es válido";
    }
  
    if (!validatePassword(password)) {
      errors.password = "La contraseña debe contener al menos una mayúscula, una minúscula, un número, un caracter especial y no debe tener espacios";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };