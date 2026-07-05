const IMAGENES_COMIDA = {
  desayuno: 'https://cdn.pixabay.com/photo/2020/12/30/00/13/fruit-5871971_640.jpg',
  almuerzo: 'https://cdn.pixabay.com/photo/2021/05/30/13/54/chicken-6295945_640.jpg',
  once: 'https://cdn.pixabay.com/photo/2021/05/30/13/54/chicken-6295945_640.jpg'
};

const ICONOS_COMIDA = {
  colacion: 'fi fi-sr-apple-whole',
  merienda: 'fi fi-sr-glass-water',
  snack_nocturno: 'fi fi-sr-bowl-rice'
};

const HORAS_COMIDA = {
  desayuno: 8, colacion: 11, almuerzo: 14, merienda: 17, once: 19, snack_nocturno: 21
};

let graficoDonut = null;
let graficoPesoMini = null;

async function inicializarDashboard() {
  const usuario = await obtenerUsuario();

  if (!usuario) {
    document.querySelector('.contenido-principal').innerHTML =
      '<p class="mensaje error">Primero debes crear tu perfil</p>';
    return;
  }

  document.getElementById('saludo-usuario').innerHTML = `¡Hola, ${usuario.nombre}! <i class="fi fi-sr-hand-wave"></i>`;
  document.getElementById('sidebar-nombre').textContent = usuario.nombre;
  document.getElementById('sidebar-avatar').textContent = usuario.nombre.charAt(0).toUpperCase();
  document.getElementById('avatar-topbar').textContent = usuario.nombre.charAt(0).toUpperCase();

  const hoy = new Date();
  const fechaISO = formatearFechaISO(hoy);
  document.getElementById('pill-fecha').innerHTML = '<i class="fi fi-sr-calendar"></i> ' + hoy.toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  const [objetivo, dia, agua, actividades, nota] = await Promise.all([
    obtenerObjetivoActivo(usuario.id),
    obtenerDia(usuario.id, fechaISO),
    obtenerAgua(usuario.id, fechaISO),
    obtenerActividadesDia(usuario.id, fechaISO),
    obtenerNotaDia(usuario.id, fechaISO)
  ]);

  if (!objetivo) {
    document.querySelector('.contenido-principal').innerHTML =
      '<p class="mensaje error">Primero debes definir tu objetivo</p>';
    return;
  }

  document.getElementById('sidebar-objetivo-nombre').textContent = nombreObjetivo(objetivo.tipo);
  document.getElementById('sidebar-objetivo-calorias').textContent = `${objetivo.calorias_objetivo} kcal`;

  renderizarStats(objetivo, dia.macrosDelDia);
  renderizarDonut(dia.macrosDelDia);
  renderizarProximaComida(dia.comidas, hoy);
  renderizarComidasHoy(dia.comidas, hoy);
  renderizarAnilloObjetivo(objetivo);
  renderizarAgua(agua, usuario.id, fechaISO);
  renderizarPesoMini(usuario.id);
  renderizarActividades(actividades);
  document.getElementById('nota-dia').value = nota ? nota.texto : '';

  document.getElementById('btn-agregar-actividad').addEventListener('click', async () => {
    const nombre = document.getElementById('actividad-nombre').value.trim();
    const duracion = Number(document.getElementById('actividad-duracion').value) || 0;
    const calorias = Number(document.getElementById('actividad-calorias').value) || 0;
    if (!nombre) return;

    await crearActividad(usuario.id, fechaISO, { nombre, duracion_min: duracion, calorias_quemadas: calorias });
    const actualizadas = await obtenerActividadesDia(usuario.id, fechaISO);
    renderizarActividades(actualizadas);
    document.getElementById('actividad-nombre').value = '';
    document.getElementById('actividad-duracion').value = '';
    document.getElementById('actividad-calorias').value = '';
  });

  document.getElementById('btn-guardar-nota').addEventListener('click', async () => {
    await guardarNotaDia(usuario.id, fechaISO, document.getElementById('nota-dia').value);
  });
}

function nombreObjetivo(tipo) {
  const nombres = {
    ganar_musculo: 'Ganar musculo',
    perder_grasa: 'Perder grasa',
    mantener_peso: 'Mantener peso',
    recomposicion: 'Recomposicion corporal'
  };
  return nombres[tipo] || tipo;
}

function renderizarStats(objetivo, consumido) {
  const stats = [
    { titulo: 'Calorias consumidas', icono: '<i class="fi fi-sr-flame"></i>', clase: 'verde', valor: Math.round(consumido.calorias), meta: objetivo.calorias_objetivo, unidad: 'kcal' },
    { titulo: 'Proteinas', icono: '<i class="fi fi-sr-drumstick"></i>', clase: 'verde', valor: consumido.proteinas_g, meta: objetivo.proteinas_objetivo_g, unidad: 'g' },
    { titulo: 'Carbohidratos', icono: '<i class="fi fi-sr-wheat"></i>', clase: 'azul', valor: consumido.carbohidratos_g, meta: objetivo.carbohidratos_objetivo_g, unidad: 'g' },
    { titulo: 'Grasas', icono: '<i class="fi fi-sr-droplet"></i>', clase: 'naranjo', valor: consumido.grasas_g, meta: objetivo.grasas_objetivo_g, unidad: 'g' }
  ];

  const fila = document.getElementById('fila-stats');
  fila.innerHTML = stats.map(s => {
    const porcentaje = Math.min(100, Math.round((s.valor / s.meta) * 100));
    return `
      <div class="stat-card">
        <div class="stat-encabezado">
          <span class="stat-icono ${s.clase}">${s.icono}</span>
          ${s.titulo}
        </div>
        <div class="stat-valor">${s.valor} <small>${s.unidad} / ${s.meta} ${s.unidad}</small></div>
        <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${porcentaje}%"></div></div>
        <div class="stat-porcentaje"><span></span><span>${porcentaje}%</span></div>
      </div>
    `;
  }).join('');
}

function renderizarDonut(consumido) {
  const ctx = document.getElementById('donut-macros').getContext('2d');
  if (graficoDonut) graficoDonut.destroy();

  const total = consumido.proteinas_g + consumido.carbohidratos_g + consumido.grasas_g || 1;

  graficoDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Proteinas', 'Carbohidratos', 'Grasas'],
      datasets: [{
        data: [consumido.proteinas_g, consumido.carbohidratos_g, consumido.grasas_g],
        backgroundColor: ['#22c55e', '#3b82f6', '#fb923c'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      plugins: { legend: { display: false } }
    }
  });

  const leyenda = [
    { color: '#22c55e', label: 'Proteinas', valor: consumido.proteinas_g },
    { color: '#3b82f6', label: 'Carbohidratos', valor: consumido.carbohidratos_g },
    { color: '#fb923c', label: 'Grasas', valor: consumido.grasas_g }
  ];

  document.getElementById('leyenda-macros').innerHTML = leyenda.map(l => {
    const porcentaje = Math.round((l.valor / total) * 100);
    return `
      <div class="fila-leyenda">
        <span style="color:${l.color}">${porcentaje}%</span>
        ${l.label}
        <strong>${l.valor} g</strong>
      </div>
    `;
  }).join('');
}

function renderizarProximaComida(comidas, ahora) {
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60;
  const proxima = comidas.find(c => HORAS_COMIDA[c.tipo] >= horaActual) || comidas[0];

  document.getElementById('badge-hora-proxima').textContent =
    String(HORAS_COMIDA[proxima.tipo]).padStart(2, '0') + ':00';
  document.getElementById('nombre-proxima-comida').textContent = NOMBRES_COMIDAS[proxima.tipo];
  document.getElementById('img-proxima-comida').src =
    IMAGENES_COMIDA[proxima.tipo] || 'https://cdn.pixabay.com/photo/2020/12/30/00/13/fruit-5871971_640.jpg';

  const lista = document.getElementById('lista-proxima-comida');
  if (proxima.items.length === 0) {
    lista.innerHTML = '<li>Aun no has planificado esta comida</li>';
  } else {
    lista.innerHTML = proxima.items.map(i =>
      `<li>${i.gramos ? i.gramos + ' g ' : ''}${i.alimento_nombre || i.receta_nombre}</li>`
    ).join('');
  }
}

function renderizarComidasHoy(comidas, ahora) {
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60;
  const fila = document.getElementById('fila-comidas-hoy');

  fila.innerHTML = comidas.map(comida => {
    const esActual = Math.abs(HORAS_COMIDA[comida.tipo] - horaActual) < 1.5;
    const tieneComida = comida.items.length > 0;
    const imagenUrl = IMAGENES_COMIDA[comida.tipo];
    const nombresItems = comida.items.map(i => i.alimento_nombre || i.receta_nombre).join(', ') || 'Sin planificar';
    const kcal = comida.macros.calorias;

    return `
      <div class="mini-comida ${esActual ? 'actual' : ''}">
        <div class="mini-comida-header">${NOMBRES_COMIDAS[comida.tipo]}</div>
        <div class="mini-comida-hora">${String(HORAS_COMIDA[comida.tipo]).padStart(2, '0')}:00</div>
        ${imagenUrl
          ? `<img src="${imagenUrl}" alt="">`
          : `<div class="placeholder-img"><i class="${ICONOS_COMIDA[comida.tipo] || 'fi fi-sr-utensils'}"></i></div>`}
        <div class="mini-comida-nombre">${nombresItems}</div>
        <div class="mini-comida-kcal">${kcal} kcal</div>
        <div class="estado-punto ${tieneComida ? 'completo' : ''}"></div>
      </div>
    `;
  }).join('');
}

function dibujarAnillo(canvasId, porcentaje, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radio = cx - 6;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(cx, cy, radio, 0, Math.PI * 2);
  ctx.strokeStyle = '#2a2e38';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radio, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * porcentaje / 100));
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.fillStyle = '#f3f4f6';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(porcentaje + '%', cx, cy);
}

function renderizarAnilloObjetivo(objetivo) {
  document.getElementById('objetivo-nombre-grande').textContent = nombreObjetivo(objetivo.tipo);

  const fechaInicio = new Date(objetivo.fecha_inicio);
  const diasTranscurridos = Math.floor((new Date() - fechaInicio) / (1000 * 60 * 60 * 24));
  const diasMeta = 90;
  const porcentaje = Math.min(100, Math.round((diasTranscurridos / diasMeta) * 100));

  document.getElementById('objetivo-tiempo').textContent = `Dia ${diasTranscurridos} de ${diasMeta}`;
  dibujarAnillo('anillo-objetivo', porcentaje, '#22c55e');
}

function renderizarAgua(agua, usuarioId, fechaISO) {
  const porcentaje = Math.min(100, Math.round((agua.mililitros / agua.meta_ml) * 100));
  document.getElementById('agua-total-litros').textContent = `${(agua.mililitros / 1000).toFixed(1)} L`;
  dibujarAnillo('anillo-agua', porcentaje, '#3b82f6');

  const totalVasos = Math.ceil(agua.meta_ml / 250);
  const vasosLlenos = Math.floor(agua.mililitros / 250);

  const contenedor = document.getElementById('vasos-agua');
  let html = '';
  for (let i = 0; i < totalVasos; i++) {
    html += `<span class="vaso ${i < vasosLlenos ? 'lleno' : ''}"><i class="fi fi-sr-glass-water"></i></span>`;
  }
  html += `<button class="btn-agregar-vaso" id="btn-agregar-vaso">+</button>`;
  contenedor.innerHTML = html;

  document.getElementById('btn-agregar-vaso').addEventListener('click', async () => {
    await agregarAgua(usuarioId, fechaISO, 250);
    const actualizada = await obtenerAgua(usuarioId, fechaISO);
    renderizarAgua(actualizada, usuarioId, fechaISO);
  });
}

async function renderizarPesoMini(usuarioId) {
  const historial = await obtenerHistorialPeso(usuarioId);
  if (historial.length === 0) {
    document.getElementById('peso-actual-grande').textContent = 'Sin datos';
    return;
  }

  const ultimo = historial[historial.length - 1];
  document.getElementById('peso-actual-grande').textContent = `${ultimo.peso_kg} kg`;

  if (historial.length > 1) {
    const anterior = historial[historial.length - 2];
    const delta = (ultimo.peso_kg - anterior.peso_kg).toFixed(1);
    document.getElementById('peso-delta').textContent = `${delta > 0 ? '+' : ''}${delta} kg`;
  }

  const ctx = document.getElementById('grafico-peso-mini').getContext('2d');
  if (graficoPesoMini) graficoPesoMini.destroy();

  graficoPesoMini = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historial.map(() => ''),
      datasets: [{
        data: historial.map(r => r.peso_kg),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.15)',
        tension: 0.3,
        fill: true,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}

function renderizarActividades(actividades) {
  const lista = document.getElementById('lista-actividades-hoy');
  if (actividades.length === 0) {
    lista.innerHTML = '<p class="valor-secundario" style="font-size:0.8rem;">Sin actividad registrada hoy</p>';
    return;
  }
  lista.innerHTML = actividades.map(a => `
    <div class="item-actividad">
      <span>${a.nombre} · ${a.duracion_min} min</span>
      <span>${a.calorias_quemadas} kcal</span>
    </div>
  `).join('');
}

inicializarDashboard();