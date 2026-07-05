function calcularBMR({ sexo, peso_actual_kg, altura_cm, edad }) {
  const base = 10 * peso_actual_kg + 6.25 * altura_cm - 5 * edad;
  return sexo === 'masculino' ? base + 5 : base - 161;
}

const FACTORES_ACTIVIDAD = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9
};

function calcularTDEE(perfil) {
  const bmr = calcularBMR(perfil);
  return bmr * FACTORES_ACTIVIDAD[perfil.nivel_actividad];
}

function calcularCaloriasYMacros(perfil, tipoObjetivo) {
  const tdee = calcularTDEE(perfil);
  let calorias;

  switch (tipoObjetivo) {
    case 'ganar_musculo':
      calorias = tdee + 300;
      break;
    case 'perder_grasa':
      calorias = tdee - 500;
      break;
    case 'recomposicion':
      calorias = tdee - 100;
      break;
    case 'mantener_peso':
    default:
      calorias = tdee;
  }

  const proteinas_g = (calorias * 0.30) / 4;
  const carbohidratos_g = (calorias * 0.35) / 4;
  const grasas_g = (calorias * 0.35) / 9;

  return {
    calorias: Math.round(calorias),
    proteinas_g: Math.round(proteinas_g),
    carbohidratos_g: Math.round(carbohidratos_g),
    grasas_g: Math.round(grasas_g)
  };
}