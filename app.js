let listaItems = [], slotActual = '', itemActual = null, equipoPersonaje = {}, tempStatsBase = [], tempMods = [];
let personajeActual = "Guerrero Zombie";
const DATOS_PERSONAJES = { "Guerrero Zombie": { equipo: {} }, "Mago Oscuro": { equipo: {} }, "Ninja": { equipo: {} } };
const coloresRareza = { "Normal": "#ffffff", "Mágico": "#007bff", "Raro": "#28a745", "Épico": "#ff00ff", "Legendario": "#ff8c00" };

function cambiarPersonaje(nombre) {
    DATOS_PERSONAJES[personajeActual].equipo = { ...equipoPersonaje };
    personajeActual = nombre;
    equipoPersonaje = { ...DATOS_PERSONAJES[personajeActual].equipo };
    limpiarSlots();
    cargarEquipoEnSlots();
    actualizarEstadisticasGlobales();
}

function limpiarSlots() {
    document.querySelectorAll('.slot').forEach(slot => {
        slot.style.borderColor = "#333";
        slot.style.backgroundColor = "#1a1a1e";
        slot.style.backgroundImage = "none";
        slot.innerHTML = slot.id.replace('slot-', '').toUpperCase();
    });
}

function cargarEquipoEnSlots() {
    for (const slot in equipoPersonaje) { dibujarSlot(slot, equipoPersonaje[slot]); }
}

function dibujarSlot(slot, info) {
    const el = document.getElementById('slot-' + slot);
    if (!el) return;
    el.style.backgroundColor = coloresRareza[info.rareza];
    el.style.borderColor = "#fff";
    el.innerHTML = `<div style="height:100%; position:relative;"><div style="position:absolute; bottom:2px; left:4px; background:black; color:white; padding:0 4px; border-radius:3px; font-size:11px; font-weight:bold;">${info.nivel}</div></div>`;
}

function actualizarEstadisticasGlobales() {
    let totales = {}; 
    if(typeof LISTA_STATS !== 'undefined') {
        LISTA_STATS.forEach(s => totales[s] = 0);
        for (const s in equipoPersonaje) {
            [...equipoPersonaje[s].statsBase, ...equipoPersonaje[s].modificadores].forEach(item => {
                if (totales[item.tipo] !== undefined) totales[item.tipo] += parseFloat(item.valor) || 0;
            });
        }
        LISTA_STATS.forEach(s => { const el = document.getElementById(`stat-${s.replace(/ /g, '-')}`); if (el) el.innerText = totales[s]; });
    }
}

async function cargarDatos() {
    try {
        const res = await fetch('data/item.txt');
        const texto = await res.text();
        listaItems = texto.split('\n').filter(l => l.includes('item_name_')).map(l => ({ id: l.split('=>')[0].split('item_name_')[1].trim(), nombre: l.split('=>')[1].trim() }));
    } catch (e) { console.error("Error al cargar datos"); }
}

function abrirModalParaSeleccion(slot) {
    slotActual = slot;
    document.getElementById('modal-planner').style.display = "block";
    if (equipoPersonaje[slotActual]) { activarEdicion(equipoPersonaje[slotActual].itemOriginal); }
    else { document.getElementById('pantalla-seleccion').style.display = "block"; document.getElementById('seccion-edicion').style.display = "none"; filtrarPorSlot(slot); }
}

function filtrarPorSlot(slot) {
    const cont = document.getElementById('lista-modal');
    cont.innerHTML = '';
    const tunicasPermitidas = ["túnica de sombras", "túnica ciruja", "túnica de majul"];
    listaItems.filter(i => {
        const nombre = i.nombre.toLowerCase();
        if (slot === 'armadura') return nombre.includes('armadura') || tunicasPermitidas.some(t => nombre.includes(t));
        return nombre.includes(slot.toLowerCase());
    }).forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card'; div.innerText = item.nombre;
        div.onclick = () => activarEdicion(item);
        cont.appendChild(div);
    });
}

function cerrarModal() { document.getElementById('modal-planner').style.display = "none"; }

cargarDatos();
