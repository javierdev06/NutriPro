async function inicializarCompras() {
  const usuario = await obtenerUsuario();

  if (!usuario) {
    document.getElementById('lista-compras').innerHTML =
      '<p class="mensaje error">Primero debes crear tu perfil</p>';
    return;
  }

  const hoy = new Date();
  const dias = obtenerDiasDeLaSemana(hoy);
  const inicioISO = formatearFechaISO(dias[0]);
  const finISO = formatearFechaISO(dias[6]);

  document.getElementById('rango-semana-compras').textContent =
    `Semana del ${formatearFechaCorta(dias[0])} al ${formatearFechaCorta(dias[6])}`;

  const necesidades = await obtenerNecesidadesSemana(usuario.id, inicioISO, finISO);
  renderizarListaCompras(necesidades, usuario.id);
}

function renderizarListaCompras(necesidades, usuarioId) {
  const contenedor = document.getElementById('lista-compras');
  contenedor.innerHTML = '';

  if (necesidades.length === 0) {
    contenedor.innerHTML = '<p class="mensaje">No hay alimentos planificados esta semana</p>';
    return;
  }

  for (const item of necesidades) {
    const div = document.createElement('div');
    div.className = 'item-inventario';

    const estado = item.faltante_gramos > 0
      ? `Faltan ${item.faltante_gramos} g`
      : 'Tienes suficiente';

    div.innerHTML = `
      <div class="info-alimento">
        <h3>${item.nombre}</h3>
        <span>Necesitas ${item.necesario_gramos}g · Tienes ${item.disponible_gramos}g · ${estado}</span>
      </div>
      ${item.faltante_gramos > 0
        ? `<button class="boton-secundario btn-comprado" data-id="${item.alimento_id}" data-faltante="${item.faltante_gramos}">Marcar comprado</button>`
        : ''}
    `;
    contenedor.appendChild(div);
  }

  document.querySelectorAll('.btn-comprado').forEach(btn => {
    btn.addEventListener('click', async () => {
      await ajustarInventario(usuarioId, btn.dataset.id, Number(btn.dataset.faltante));
      inicializarCompras();
    });
  });
}

inicializarCompras();