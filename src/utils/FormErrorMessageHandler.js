const customErrors = {
    email: {
      required: 'El email es requerido',
      email: 'El email no es válido',
    },
    username: {
      required: 'El nombre de usuario es requerido',
    },
    comment: {
        required: 'Debes ingresar un comentario a cerca de tu valoración del juego',
        minLength: 'Tú comentario debe contener al menos 10 caractéres'
    },
    password: {
      required: 'La contraseña es requerida',
      regex: 'La contraseña debe tener al menos 8 caracteres y 1 mayúscula',
    },
    confirmedPassword: {
      required: 'La confirmación de contraseña es requerida',
      sameAsPassword: 'Las contraseñas no coinciden',
    },
  };

const customValidators = [
   "$externalResults",
   "passwordRegexVal",
    "commentRating"
]
  
export const getCustomError = (field, validator, error) => {
    if (customValidators.includes(validator)) {
      return error.$message;
    }
    return customErrors[field][validator];
};