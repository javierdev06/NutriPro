const btnMostrarFormulario = document.getElementById('btn-mostrar-formulario');
const formReceta = document.getElementById('form-receta');
const inputBuscarIngrediente = document.getElementById('buscar-ingrediente');
const resultadosBusqueda = document.getElementById('resultados-busqueda');
const listaIngredientes = document.getElementById('lista-ingredientes');
const macrosTotales = document.getElementById('macros-totales');
const listaRecetas = document.getElementById('lista-recetas');
const mensaje = document.getElementById('mensaje-receta');

let ingredientesSeleccionados = [];

btnMostrarFormulario.addEventListener('click', () => {
  const visible = formReceta.style.display === 'flex';
  formReceta.style.display = visible ? 'none' : 'flex';
});

let temporizadorBusqueda;
inputBuscarIngrediente.addEventListener('input', () => {
  clearTimeout(temporizadorBusqueda);
  const texto = inputBuscarIngrediente.value;

  if (!texto) {
    resultadosBusqueda.innerHTML = '';
    return;
  }

  temporizadorBusqueda = setTimeout(async () => {
    const alimentos = await buscarAlimentos(texto);
    renderizarResultadosBusqueda(alimentos);
  }, 300);
});

function renderizarResultadosBusqueda(alimentos) {
  resultadosBusqueda.innerHTML = '';

  for (const alimento of alimentos) {
    const item = document.createElement('div');
    item.className = 'resultado-item';
    item.textContent = `${alimento.nombre} (${alimento.calorias_100g} kcal/100g)`;
    item.addEventListener('click', () => agregarIngrediente(alimento));
    resultadosBusqueda.appendChild(item);
  }
}

function agregarIngrediente(alimento) {
  const yaExiste = ingredientesSeleccionados.find(i => i.alimento_id === alimento.id);
  if (yaExiste) return;

  ingredientesSeleccionados.push({
    alimento_id: alimento.id,
    nombre: alimento.nombre,
    gramos: 100,
    calorias_100g: alimento.calorias_100g,
    proteinas_100g: alimento.proteinas_100g,
    carbohidratos_100g: alimento.carbohidratos_100g,
    grasas_100g: alimento.grasas_100g
  });

  inputBuscarIngrediente.value = '';
  resultadosBusqueda.innerHTML = '';
  renderizarIngredientes();
}

function renderizarIngredientes() {
  listaIngredientes.innerHTML = '';

  for (const ing of ingredientesSeleccionados) {
    const item = document.createElement('div');
    item.className = 'ingrediente-item';
    item.innerHTML = `
      <span>${ing.nombre}</span>
      <input type="number" value="${ing.gramos}" min="1" data-id="${ing.alimento_id}" class="input-gramos">
      <span>g</span>
      <button type="button" class="btn-quitar" data-id="${ing.alimento_id}">Quitar</button>
    `;
    listaIngredientes.appendChild(item);
  }

  document.querySelectorAll('.input-gramos').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = Number(e.target.dataset.id);
      const ingrediente = ingredientesSeleccionados.find(i => i.alimento_id === id);
      ingrediente.gramos = Number(e.target.value);
      actualizarMacrosTotales();
    });
  });

  document.querySelectorAll('.btn-quitar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id);
      ingredientesSeleccionados = ingredientesSeleccionados.filter(i => i.alimento_id !== id);
      renderizarIngredientes();
      actualizarMacrosTotales();
    });
  });

  actualizarMacrosTotales();
}

function actualizarMacrosTotales() {
  const totales = ingredientesSeleccionados.reduce((acc, ing) => {
    const factor = ing.gramos / 100;
    acc.calorias += ing.calorias_100g * factor;
    acc.proteinas += ing.proteinas_100g * factor;
    acc.carbohidratos += ing.carbohidratos_100g * factor;
    acc.grasas += ing.grasas_100g * factor;
    return acc;
  }, { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });

  macrosTotales.textContent =
    `Calorias: ${Math.round(totales.calorias)} · Proteinas: ${Math.round(totales.proteinas)}g · ` +
    `Carbohidratos: ${Math.round(totales.carbohidratos)}g · Grasas: ${Math.round(totales.grasas)}g`;
}

formReceta.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (ingredientesSeleccionados.length === 0) {
    mensaje.textContent = 'Agrega al menos un ingrediente';
    mensaje.classList.add('error');
    return;
  }

  const datos = {
    nombre: document.getElementById('nombre-receta').value.trim(),
    descripcion: document.getElementById('descripcion-receta').value.trim(),
    tiempo_preparacion_min: Number(document.getElementById('tiempo-receta').value) || null,
    instrucciones: document.getElementById('instrucciones-receta').value.trim(),
    ingredientes: ingredientesSeleccionados.map(i => ({
      alimento_id: i.alimento_id,
      gramos: i.gramos
    }))
  };

  try {
    await crearReceta(datos);
    mensaje.textContent = 'Receta guardada correctamente';
    mensaje.classList.remove('error');
    formReceta.reset();
    formReceta.style.display = 'none';
    ingredientesSeleccionados = [];
    listaIngredientes.innerHTML = '';
    cargarRecetas();
  } catch (error) {
    mensaje.textContent = 'Ocurrio un error al guardar la receta';
    mensaje.classList.add('error');
  }
});

async function cargarRecetas() {
  const recetas = await obtenerRecetas();
  listaRecetas.innerHTML = '';

  for (const receta of recetas) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-receta';
    tarjeta.innerHTML = `
      <h3>${receta.nombre}</h3>
      <div class="macros-alimento">
        ${receta.macros.calorias} kcal · P: ${receta.macros.proteinas_g}g ·
        C: ${receta.macros.carbohidratos_g}g · G: ${receta.macros.grasas_g}g
      </div>
      <button class="btn-eliminar" data-id="${receta.id}">Eliminar</button>
    `;
    listaRecetas.appendChild(tarjeta);
  }

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      await eliminarReceta(e.target.dataset.id);
      cargarRecetas();
    });
  });
}

cargarRecetas();