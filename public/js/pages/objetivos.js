const selectTipo = document.getElementById('tipo-objetivo');
const btnCalcular = document.getElementById('btn-calcular');
const btnGuardar = document.getElementById('btn-guardar');
const tarjetaMacros = document.getElementById('tarjeta-macros');
const mensaje = document.getElementById('mensaje-objetivo');

let usuarioActual = null;

async function inicializar() {
  usuarioActual = await obtenerUsuario();

  if (!usuarioActual) {
    mensaje.textContent = 'Primero debes crear tu perfil';
    mensaje.classList.add('error');
    btnCalcular.disabled = true;
    return;
  }

  const objetivoActivo = await obtenerObjetivoActivo(usuarioActual.id);
  if (objetivoActivo) {
    selectTipo.value = objetivoActivo.tipo;
    mostrarMacros({
      calorias: objetivoActivo.calorias_objetivo,
      proteinas_g: objetivoActivo.proteinas_objetivo_g,
      carbohidratos_g: objetivoActivo.carbohidratos_objetivo_g,
      grasas_g: objetivoActivo.grasas_objetivo_g
    });
  }
}

function mostrarMacros(macros) {
  document.getElementById('calorias').value = macros.calorias;
  document.getElementById('proteinas').value = macros.proteinas_g;
  document.getElementById('carbohidratos').value = macros.carbohidratos_g;
  document.getElementById('grasas').value = macros.grasas_g;
  tarjetaMacros.style.display = 'flex';
}

btnCalcular.addEventListener('click', async () => {
  const tipo = selectTipo.value;

  if (!tipo) {
    mensaje.textContent = 'Selecciona un objetivo primero';
    mensaje.classList.add('error');
    return;
  }

  try {
    const macros = await calcularVistaPreviaObjetivo(usuarioActual.id, tipo);
    mostrarMacros(macros);
    mensaje.textContent = '';
  } catch (error) {
    mensaje.textContent = 'Ocurrio un error al calcular';
    mensaje.classList.add('error');
  }
});

btnGuardar.addEventListener('click', async () => {
  const tipo = selectTipo.value;
  const macrosManuales = {
    calorias: Number(document.getElementById('calorias').value),
    proteinas_g: Number(document.getElementById('proteinas').value),
    carbohidratos_g: Number(document.getElementById('carbohidratos').value),
    grasas_g: Number(document.getElementById('grasas').value)
  };

  try {
    await guardarObjetivo(usuarioActual.id, tipo, macrosManuales);
    mensaje.textContent = 'Objetivo guardado correctamente';
    mensaje.classList.remove('error');
  } catch (error) {
    mensaje.textContent = 'Ocurrio un error al guardar el objetivo';
    mensaje.classList.add('error');
  }
});

inicializar();