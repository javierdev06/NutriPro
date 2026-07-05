// Calcula el metabolismo basal (BMR) usando la fórmula de Mifflin-St Jeor
function calcularBMR({ sexo, peso_actual_kg, altura_cm, edad }) {
  const base = 10 * peso_actual_kg + 6.25 * altura_cm - 5 * edad;
  return sexo === 'masculino' ? base + 5 : base - 161;
}

// Factores de actividad física estándar
const FACTORES_ACTIVIDAD = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9
};

// Calcula el gasto calórico total diario (TDEE)
function calcularTDEE(perfil) {
  const bmr = calcularBMR(perfil);
  return bmr * FACTORES_ACTIVIDAD[perfil.nivel_actividad];
}

// Ajusta las calorías según el objetivo y calcula los macronutrientes
export function calcularCaloriasYMacros(perfil, tipoObjetivo) {
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

  // Distribución de macros: 30% proteína, 35% carbohidratos, 35% grasas
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