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
    name: {
        required: 'El nombre es requerido',
    },
    link_to_game: {
        required: 'El enlace al videojuego es requerido',
    },
    description: {
        required: 'La descripción es requerida',
    },
    development_team: {
        required: 'El nombre del equipo de desarrollo es requerido',
    },
    release_date: {
        required: 'La fecha de lanzamiento es requerida',
    },
    genres: {
        required: 'Los géneros son requeridos',
    },
    developers: {
        required: 'Los nombres de los desarrolladores son requeridos',
    },
    images: {
        required: 'Debe haber al menos una imágen',
    },
    logo_url: {
        required: 'El enlace al logo es requerido',
    },
  };

const customValidators = [
   "$externalResults",
   "passwordRegexVal",
    "commentRating",
    "linkToGameRegex"
]
  
export const getCustomError = (field, validator, error) => {
    if (customValidators.includes(validator)) {
      return error.$message;
    }
    return customErrors[field][validator];
};