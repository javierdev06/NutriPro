const HORAS_COMIDA = {
  desayuno: 8,
  colacion: 11,
  almuerzo: 14,
  merienda: 17,
  once: 19,
  snack_nocturno: 21
};

async function inicializarDashboard() {
  const usuario = await obtenerUsuario();

  if (!usuario) {
    document.getElementById('contenido-dashboard').innerHTML =
      '<p class="mensaje error">Primero debes crear tu perfil</p>';
    return;
  }

  document.getElementById('saludo-usuario').textContent = `Hola, ${usuario.nombre}`;

  const hoy = new Date();
  const fechaISO = formatearFechaISO(hoy);

  const [objetivo, dia, agua] = await Promise.all([
    obtenerObjetivoActivo(usuario.id),
    obtenerDia(usuario.id, fechaISO),
    obtenerAgua(usuario.id, fechaISO)
  ]);

  if (!objetivo) {
    document.getElementById('contenido-dashboard').innerHTML =
      '<p class="mensaje error">Primero debes definir tu objetivo</p>';
    return;
  }

  renderizarCalorias(objetivo, dia.macrosDelDia);
  renderizarMacros(objetivo, dia.macrosDelDia);
  renderizarAgua(agua, usuario.id, fechaISO);
  renderizarProximaComida(dia.comidas, hoy);
}

function renderizarCalorias(objetivo, consumido) {
  const restante = Math.max(0, objetivo.calorias_objetivo - consumido.calorias);
  const porcentaje = Math.min(100, Math.round((consumido.calorias / objetivo.calorias_objetivo) * 100));

  document.getElementById('tarjeta-calorias').innerHTML = `
    <h3>Calorias</h3>
    <div class="valor-grande">${Math.round(consumido.calorias)}</div>
    <div class="valor-secundario">de ${objetivo.calorias_objetivo} kcal · Restan ${Math.round(restante)}</div>
    <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${porcentaje}%"></div></div>
  `;
}

function renderizarMacros(objetivo, consumido) {
  document.getElementById('tarjeta-macros').innerHTML = `
    <h3>Macronutrientes</h3>
    <div class="fila-macro"><span>Proteinas</span><span>${consumido.proteinas_g}g / ${objetivo.proteinas_objetivo_g}g</span></div>
    <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${Math.min(100, consumido.proteinas_g / objetivo.proteinas_objetivo_g * 100)}%"></div></div>
    <div class="fila-macro"><span>Carbohidratos</span><span>${consumido.carbohidratos_g}g / ${objetivo.carbohidratos_objetivo_g}g</span></div>
    <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${Math.min(100, consumido.carbohidratos_g / objetivo.carbohidratos_objetivo_g * 100)}%"></div></div>
    <div class="fila-macro"><span>Grasas</span><span>${consumido.grasas_g}g / ${objetivo.grasas_objetivo_g}g</span></div>
    <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${Math.min(100, consumido.grasas_g / objetivo.grasas_objetivo_g * 100)}%"></div></div>
  `;
}

function renderizarAgua(agua, usuarioId, fechaISO) {
  const porcentaje = Math.min(100, Math.round((agua.mililitros / agua.meta_ml) * 100));

  document.getElementById('tarjeta-agua').innerHTML = `
    <h3>Agua</h3>
    <div class="valor-grande">${agua.mililitros} ml</div>
    <div class="valor-secundario">Meta: ${agua.meta_ml} ml</div>
    <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${porcentaje}%"></div></div>
    <div class="botones-agua">
      <button data-ml="250">+250 ml</button>
      <button data-ml="500">+500 ml</button>
      <button data-ml="-250">-250 ml</button>
    </div>
  `;

  document.querySelectorAll('.botones-agua button').forEach(btn => {
    btn.addEventListener('click', async () => {
      await agregarAgua(usuarioId, fechaISO, Number(btn.dataset.ml));
      inicializarDashboard();
    });
  });
}

function renderizarProximaComida(comidas, ahora) {
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

  const proxima = comidas.find(c => HORAS_COMIDA[c.tipo] >= horaActual) || comidas[0];

  document.getElementById('tarjeta-proxima-comida').innerHTML = `
    <h3>Proxima comida</h3>
    <div class="valor-grande">${NOMBRES_COMIDAS[proxima.tipo]}</div>
    <div class="valor-secundario">
      ${proxima.items.length > 0
        ? proxima.items.map(i => i.alimento_nombre || i.receta_nombre).join(', ')
        : 'Aun no has planificado esta comida'}
    </div>
  `;
}

inicializarDashboard();