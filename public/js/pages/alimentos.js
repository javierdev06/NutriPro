const inputBuscar = document.getElementById('input-buscar');
const listaAlimentos = document.getElementById('lista-alimentos');
const btnMostrarFormulario = document.getElementById('btn-mostrar-formulario');
const formAlimento = document.getElementById('form-alimento');
const selectCategoria = document.getElementById('categoria-alimento');
const mensaje = document.getElementById('mensaje-alimento');

function renderizarAlimentos(alimentos) {
  listaAlimentos.innerHTML = '';

  if (alimentos.length === 0) {
    listaAlimentos.innerHTML = '<p class="mensaje">No se encontraron alimentos</p>';
    return;
  }

  for (const alimento of alimentos) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-alimento';
    tarjeta.innerHTML = `
      <div class="info-alimento">
        <h3>${alimento.nombre}</h3>
        <span>${alimento.categoria_nombre || 'Sin categoria'}</span>
      </div>
      <div class="macros-alimento">
        <strong>${alimento.calorias_100g} kcal</strong> / 100g<br>
        P: ${alimento.proteinas_100g}g · C: ${alimento.carbohidratos_100g}g · G: ${alimento.grasas_100g}g
      </div>
    `;
    listaAlimentos.appendChild(tarjeta);
  }
}

async function cargarAlimentos(texto = '') {
  const alimentos = await buscarAlimentos(texto);
  renderizarAlimentos(alimentos);
}

async function cargarCategorias() {
  const categorias = await obtenerCategorias();
  for (const categoria of categorias) {
    const opcion = document.createElement('option');
    opcion.value = categoria.id;
    opcion.textContent = categoria.nombre;
    selectCategoria.appendChild(opcion);
  }
}

let temporizadorBusqueda;
inputBuscar.addEventListener('input', () => {
  clearTimeout(temporizadorBusqueda);
  temporizadorBusqueda = setTimeout(() => {
    cargarAlimentos(inputBuscar.value);
  }, 300);
});

btnMostrarFormulario.addEventListener('click', () => {
  const visible = formAlimento.style.display === 'flex';
  formAlimento.style.display = visible ? 'none' : 'flex';
});

formAlimento.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const datos = {
    nombre: document.getElementById('nombre-alimento').value.trim(),
    categoria_id: document.getElementById('categoria-alimento').value || null,
    calorias_100g: Number(document.getElementById('calorias-alimento').value),
    proteinas_100g: Number(document.getElementById('proteinas-alimento').value),
    carbohidratos_100g: Number(document.getElementById('carbohidratos-alimento').value),
    grasas_100g: Number(document.getElementById('grasas-alimento').value)
  };

  try {
    await crearAlimentoPersonalizado(datos);
    mensaje.textContent = 'Alimento agregado correctamente';
    mensaje.classList.remove('error');
    formAlimento.reset();
    formAlimento.style.display = 'none';
    cargarAlimentos(inputBuscar.value);
  } catch (error) {
    mensaje.textContent = 'Ocurrio un error al guardar el alimento';
    mensaje.classList.add('error');
  }
});

document.addEventListener('datosListos', () => {
  cargarCategorias();
  cargarAlimentos();
});