const customErrors = {
    email: {
      required: 'El email es requerido',
      email: 'El email no es válido',
    },
    username: {
      required: 'El nombre de usuario es requerido',
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
]
  
export const getCustomError = (field, validator, error) => {
    if (customValidators.includes(validator)) {
      return error.$message;
    }
    return customErrors[field][validator];
};