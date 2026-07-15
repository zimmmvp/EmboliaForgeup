let listaItems = [];

async function cargarDatos() {
    try {
        // Leemos el archivo item.txt
        const res = await fetch('data/item.txt');
        const texto = await res.text();
        
        // Procesamos línea por línea
        const lineas = texto.split('\n');
        
        lineas.forEach(linea => {
            // Solo nos interesan los nombres que empiezan con "item_name_"
            if (linea.includes('item_name_')) {
                const [llave, valor] = linea.split('=>');
                const id = llave.split('item_name_')[1].trim();
                
                listaItems.push({
                    id: id,
                    nombre: valor.trim()
                });
            }
        });

        console.log("Ítems cargados:", listaItems);
        renderizarItems(listaItems);
        
    } catch (error) {
        console.error("Error al cargar los ítems:", error);
    }
}

function renderizarItems(items) {
    const contenedor = document.getElementById('lista-items');
    contenedor.innerHTML = ''; // Limpiar lista
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `<span>${item.nombre}</span>`;
        div.onclick = () => equiparItem(item);
        contenedor.appendChild(div);
    });
}

// Buscador
document.getElementById('buscador').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase();
    const filtrados = listaItems.filter(i => i.nombre.toLowerCase().includes(busqueda));
    renderizarItems(filtrados);
});
function equiparItem(item) {
    console.log("Equipando:", item.nombre);
    
    // Buscamos en el HTML todos los slots disponibles
    const slots = document.querySelectorAll('.slot');
    
    // Esto es un ejemplo simple: asignamos el primer slot que esté vacío
    for (let slot of slots) {
        // Comparamos si el texto del slot es igual al data-tipo original
        if (slot.innerText.toLowerCase() === slot.getAttribute('data-tipo').toLowerCase()) {
            slot.innerText = item.nombre;
            slot.style.border = "2px solid #00e676"; // Cambia el borde a verde al equipar
            break; // Salimos del bucle para no llenar todos los slots
        }
    }
}
// Iniciamos
cargarDatos();

// Abrir modal al hacer clic en un slot equipado
function abrirModal(item) {
    document.getElementById('modal-edicion').style.display = "block";
    document.getElementById('titulo-item').innerText = "Editando: " + item.nombre;
}

function cerrarModal() {
    document.getElementById('modal-edicion').style.display = "none";
}

// Modificación: cuando equipos un ítem, ahora abrimos el editor
function equiparItem(item) {
    const slots = document.querySelectorAll('.slot');
    for (let slot of slots) {
        if (slot.innerText === slot.getAttribute('data-tipo') || slot.innerText === item.nombre) {
            slot.innerText = item.nombre;
            slot.style.border = "2px solid #00e676";
            
            // Al hacer clic, que se abra el editor
            slot.onclick = () => abrirModal(item); 
            break;
        }
    }
}
