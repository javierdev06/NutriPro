const contenedorDias = document.getElementById('contenedor-dias');
const textoSemana = document.getElementById('texto-semana');

const modal = document.getElementById('modal-agregar-item');
const modalBuscar = document.getElementById('modal-buscar');
const modalResultados = document.getElementById('modal-resultados');
const modalSeleccion = document.getElementById('modal-seleccion');
const modalSeleccionNombre = document.getElementById('modal-seleccion-nombre');
const campoGramos = document.getElementById('campo-gramos');
const campoPorciones = document.getElementById('campo-porciones');
const tabAlimento = document.getElementById('tab-alimento');
const tabReceta = document.getElementById('tab-receta');
const btnConfirmarItem = document.getElementById('btn-confirmar-item');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

let usuarioActual = null;
let fechaReferencia = new Date();
let tipoModal = 'alimento';
let itemSeleccionado = null;
let comidaObjetivoId = null;

async function inicializar() {
  usuarioActual = await obtenerUsuario();
  if (!usuarioActual) {
    contenedorDias.innerHTML = '<p class="mensaje error">Primero debes crear tu perfil</p>';
    return;
  }
  await renderizarSemana();
}

async function renderizarSemana() {
  const dias = obtenerDiasDeLaSemana(fechaReferencia);
  textoSemana.textContent = `${formatearFechaCorta(dias[0])} — ${formatearFechaCorta(dias[6])}`;

  contenedorDias.innerHTML = '';

  for (let i = 0; i < dias.length; i++) {
    const fecha = dias[i];
    const fechaISO = formatearFechaISO(fecha);
    const diaData = await obtenerDia(usuarioActual.id, fechaISO);
    contenedorDias.appendChild(crearTarjetaDia(fecha, diaData));
  }
}

function crearTarjetaDia(fecha, diaData) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta-dia';

  const nombreDia = NOMBRES_DIAS[fecha.getDay() === 0 ? 6 : fecha.getDay() - 1];

  tarjeta.innerHTML = `
    <h2>${nombreDia}</h2>
    <div class="fecha-dia">${formatearFechaCorta(fecha)}</div>
    <div class="resumen-dia">
      ${diaData.macrosDelDia.calorias} kcal · P: ${diaData.macrosDelDia.proteinas_g}g ·
      C: ${diaData.macrosDelDia.carbohidratos_g}g · G: ${diaData.macrosDelDia.grasas_g}g
    </div>
  `;

  for (const comida of diaData.comidas) {
    tarjeta.appendChild(crearBloqueComida(comida));
  }

  return tarjeta;
}

function crearBloqueComida(comida) {
  const bloque = document.createElement('div');
  bloque.className = 'bloque-comida';

  const itemsHTML = comida.items.map(item => `
    <div class="item-comida">
      <span>${item.alimento_nombre || item.receta_nombre} (${item.macros.calorias} kcal)</span>
      <button class="btn-quitar-item" data-item-id="${item.id}">x</button>
    </div>
  `).join('');

  bloque.innerHTML = `
    <div class="titulo-comida">
      <h4>${NOMBRES_COMIDAS[comida.tipo]}</h4>
      <button class="btn-agregar-item" data-comida-id="${comida.id}">+</button>
    </div>
    ${itemsHTML}
  `;

  bloque.querySelector('.btn-agregar-item').addEventListener('click', () => {
    abrirModal(comida.id);
  });

  bloque.querySelectorAll('.btn-quitar-item').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      await eliminarItemComida(e.target.dataset.itemId);
      renderizarSemana();
    });
  });

  return bloque;
}

document.getElementById('btn-semana-anterior').addEventListener('click', () => {
  fechaReferencia.setDate(fechaReferencia.getDate() - 7);
  renderizarSemana();
});

document.getElementById('btn-semana-siguiente').addEventListener('click', () => {
  fechaReferencia.setDate(fechaReferencia.getDate() + 7);
  renderizarSemana();
});

document.getElementById('btn-generar-plan').addEventListener('click', async () => {
  const confirmado = confirm(
    'Esto va a reemplazar todos los alimentos ya asignados en esta semana. ¿Deseas continuar?'
  );
  if (!confirmado) return;

  const dias = obtenerDiasDeLaSemana(fechaReferencia);
  const inicioISO = formatearFechaISO(dias[0]);

  try {
    await generarPlanSemanal(usuarioActual.id, inicioISO);
    await renderizarSemana();
  } catch (error) {
    alert(error.message);
  }
});

// --- Modal ---

function abrirModal(comidaId) {
  comidaObjetivoId = comidaId;
  itemSeleccionado = null;
  modalBuscar.value = '';
  modalResultados.innerHTML = '';
  modalSeleccion.style.display = 'none';
  modal.style.display = 'flex';
}

btnCerrarModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

tabAlimento.addEventListener('click', () => cambiarTab('alimento'));
tabReceta.addEventListener('click', () => cambiarTab('receta'));

function cambiarTab(tipo) {
  tipoModal = tipo;
  tabAlimento.classList.toggle('activo', tipo === 'alimento');
  tabReceta.classList.toggle('activo', tipo === 'receta');
  campoGramos.style.display = tipo === 'alimento' ? 'flex' : 'none';
  campoPorciones.style.display = tipo === 'receta' ? 'flex' : 'none';
  modalResultados.innerHTML = '';
  modalBuscar.value = '';
  modalSeleccion.style.display = 'none';
}

let temporizadorModal;
modalBuscar.addEventListener('input', () => {
  clearTimeout(temporizadorModal);
  const texto = modalBuscar.value;

  if (!texto) {
    modalResultados.innerHTML = '';
    return;
  }

  temporizadorModal = setTimeout(async () => {
    if (tipoModal === 'alimento') {
      const alimentos = await buscarAlimentos(texto);
      renderizarResultadosModal(alimentos.map(a => ({ id: a.id, nombre: a.nombre })));
    } else {
      const recetas = await obtenerRecetas();
      const filtradas = recetas.filter(r => r.nombre.toLowerCase().includes(texto.toLowerCase()));
      renderizarResultadosModal(filtradas.map(r => ({ id: r.id, nombre: r.nombre })));
    }
  }, 300);
});

function renderizarResultadosModal(items) {
  modalResultados.innerHTML = '';
  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'resultado-item';
    div.textContent = item.nombre;
    div.addEventListener('click', () => {
      itemSeleccionado = item;
      modalSeleccionNombre.textContent = `Seleccionado: ${item.nombre}`;
      modalSeleccion.style.display = 'flex';
      modalResultados.innerHTML = '';
      modalBuscar.value = item.nombre;
    });
    modalResultados.appendChild(div);
  }
}

btnConfirmarItem.addEventListener('click', async () => {
  if (!itemSeleccionado) return;

  const datos = tipoModal === 'alimento'
    ? { alimento_id: itemSeleccionado.id, gramos: Number(document.getElementById('modal-cantidad').value) }
    : { receta_id: itemSeleccionado.id, porciones: Number(document.getElementById('modal-porciones').value) };

  await agregarItemComida(comidaObjetivoId, datos);
  modal.style.display = 'none';
  renderizarSemana();
});

inicializar();