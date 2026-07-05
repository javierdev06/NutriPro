const inputBuscarInv = document.getElementById('buscar-alimento-inv');
const resultadosInv = document.getElementById('resultados-inv');
const seleccionInv = document.getElementById('seleccion-inv');
const nombreSeleccionadoInv = document.getElementById('nombre-seleccionado-inv');
const btnGuardarInv = document.getElementById('btn-guardar-inv');
const listaInventario = document.getElementById('lista-inventario');
const mensajeInv = document.getElementById('mensaje-inv');

let usuarioActual = null;
let alimentoSeleccionadoInv = null;

async function inicializarInventario() {
  usuarioActual = await obtenerUsuario();

  if (!usuarioActual) {
    mensajeInv.textContent = 'Primero debes crear tu perfil';
    mensajeInv.classList.add('error');
    return;
  }

  cargarInventario();
}

async function cargarInventario() {
  const inventario = await obtenerInventario(usuarioActual.id);
  listaInventario.innerHTML = '';

  if (inventario.length === 0) {
    listaInventario.innerHTML = '<p class="mensaje">Tu inventario esta vacio</p>';
    return;
  }

  for (const item of inventario) {
    const div = document.createElement('div');
    div.className = 'item-inventario';
    div.innerHTML = `
      <div class="info-alimento">
        <h3>${item.alimento_nombre}</h3>
        <span>${item.cantidad_gramos} g</span>
      </div>
      <div class="controles-inv">
        <button data-id="${item.alimento_id}" data-delta="-100">-100g</button>
        <button data-id="${item.alimento_id}" data-delta="100">+100g</button>
        <button class="btn-eliminar-inv" data-id="${item.alimento_id}">Eliminar</button>
      </div>
    `;
    listaInventario.appendChild(div);
  }

  document.querySelectorAll('.controles-inv button[data-delta]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await ajustarInventario(usuarioActual.id, btn.dataset.id, Number(btn.dataset.delta));
      cargarInventario();
    });
  });

  document.querySelectorAll('.btn-eliminar-inv').forEach(btn => {
    btn.addEventListener('click', async () => {
      await eliminarDeInventario(usuarioActual.id, btn.dataset.id);
      cargarInventario();
    });
  });
}

let temporizadorInv;
inputBuscarInv.addEventListener('input', () => {
  clearTimeout(temporizadorInv);
  const texto = inputBuscarInv.value;

  if (!texto) {
    resultadosInv.innerHTML = '';
    return;
  }

  temporizadorInv = setTimeout(async () => {
    const alimentos = await buscarAlimentos(texto);
    renderizarResultadosInv(alimentos);
  }, 300);
});

function renderizarResultadosInv(alimentos) {
  resultadosInv.innerHTML = '';
  for (const alimento of alimentos) {
    const div = document.createElement('div');
    div.className = 'resultado-item';
    div.textContent = alimento.nombre;
    div.addEventListener('click', () => {
      alimentoSeleccionadoInv = alimento;
      nombreSeleccionadoInv.textContent = `Seleccionado: ${alimento.nombre}`;
      seleccionInv.style.display = 'block';
      resultadosInv.innerHTML = '';
      inputBuscarInv.value = alimento.nombre;
    });
    resultadosInv.appendChild(div);
  }
}

btnGuardarInv.addEventListener('click', async () => {
  if (!alimentoSeleccionadoInv) return;

  const cantidad = Number(document.getElementById('cantidad-inv').value);
  await guardarEnInventario(usuarioActual.id, alimentoSeleccionadoInv.id, cantidad);

  mensajeInv.textContent = 'Agregado al inventario';
  mensajeInv.classList.remove('error');
  seleccionInv.style.display = 'none';
  inputBuscarInv.value = '';
  alimentoSeleccionadoInv = null;
  cargarInventario();
});

inicializarInventario();