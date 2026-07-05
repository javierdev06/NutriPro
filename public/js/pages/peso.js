const formPeso = document.getElementById('form-peso');
const mensajePeso = document.getElementById('mensaje-peso');
const listaRegistrosPeso = document.getElementById('lista-registros-peso');

let usuarioActual = null;
let grafico = null;

async function inicializarPeso() {
  usuarioActual = await obtenerUsuario();

  if (!usuarioActual) {
    mensajePeso.textContent = 'Primero debes crear tu perfil';
    mensajePeso.classList.add('error');
    formPeso.style.display = 'none';
    return;
  }

  cargarHistorial();
}

async function cargarHistorial() {
  const historial = await obtenerHistorialPeso(usuarioActual.id);
  dibujarGrafico(historial);
  renderizarListaRegistros(historial);
}

function dibujarGrafico(historial) {
  const etiquetas = historial.map(r => new Date(r.fecha).toLocaleDateString('es-CL'));
  const datosPeso = historial.map(r => r.peso_kg);

  if (grafico) {
    grafico.destroy();
  }

  const ctx = document.getElementById('grafico-peso').getContext('2d');
  grafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Peso (kg)',
        data: datosPeso,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.15)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#d1d5db' } }
      },
      scales: {
        x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
        y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
      }
    }
  });
}

function renderizarListaRegistros(historial) {
  listaRegistrosPeso.innerHTML = '';

  const historialInvertido = [...historial].reverse();

  for (const registro of historialInvertido) {
    const fecha = new Date(registro.fecha).toLocaleDateString('es-CL');
    const div = document.createElement('div');
    div.className = 'tarjeta-alimento';
    div.innerHTML = `
      <div class="info-alimento">
        <h3>${registro.peso_kg} kg</h3>
        <span>${fecha}${registro.porcentaje_grasa ? ' · Grasa: ' + registro.porcentaje_grasa + '%' : ''}${registro.masa_muscular_kg ? ' · Musculo: ' + registro.masa_muscular_kg + 'kg' : ''}</span>
      </div>
      <button class="btn-eliminar" data-id="${registro.id}" style="background:none;border:none;color:#f87171;cursor:pointer;">Eliminar</button>
    `;
    listaRegistrosPeso.appendChild(div);
  }

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      await eliminarRegistroPeso(e.target.dataset.id);
      cargarHistorial();
    });
  });
}

formPeso.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const datos = {
    peso_kg: Number(document.getElementById('peso-kg').value),
    porcentaje_grasa: Number(document.getElementById('grasa-corporal').value) || null,
    masa_muscular_kg: Number(document.getElementById('masa-muscular').value) || null
  };

  try {
    await crearRegistroPeso(usuarioActual.id, datos);
    mensajePeso.textContent = 'Registro guardado correctamente';
    mensajePeso.classList.remove('error');
    formPeso.reset();
    cargarHistorial();
  } catch (error) {
    mensajePeso.textContent = 'Ocurrio un error al guardar el registro';
    mensajePeso.classList.add('error');
  }
});

inicializarPeso();