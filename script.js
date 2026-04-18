// Datos con imágenes seguras
const pacientes = [
    { id: 1, nombre: "Rocko", especie: "perro", raza: "Golden", dueño: "Carlos", costo: 45000, critico: true, activo: true, cita: "10:00", imagen: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" },
    { id: 2, nombre: "Luna", especie: "gato", raza: "Persa", dueño: "Marta", costo: 38000, critico: false, activo: true, cita: "16:30", imagen: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" },
    { id: 3, nombre: "Burbuja", especie: "otro", raza: "Pez Dorado", dueño: "Juan", costo: 12000, critico: false, activo: true, cita: "09:00", imagen: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400" },
    { id: 4, nombre: "Bruno", especie: "perro", raza: "Bulldog", dueño: "Ana", costo: 55000, critico: true, activo: true, cita: "18:00", imagen: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400" },
    { id: 5, nombre: "Mica", especie: "gato", raza: "Siamés", dueño: "Luis", costo: 42000, critico: false, activo: true, cita: "09:15", imagen:"Mishu.jpg"},
    { id: 6, nombre: "Zeus", especie: "perro", raza: "Pastor", dueño: "Pedro", costo: 48000, critico: false, activo: true, cita: "11:00", imagen: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400" },
    { id: 7, nombre: "Nala", especie: "gato", raza: "Angora", dueño: "Elena", costo: 39000, critico: true, activo: true, cita: "08:30", imagen: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400" },
    { id: 8, nombre: "Copito", especie: "otro", raza: "Conejo", dueño: "Lucas", costo: 25000, critico: false, activo: true, cita: "15:00", imagen: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400" },
    { id: 9, nombre: "Drako", especie: "perro", raza: "Ovejero", dueño: "Santi", costo: 65000, critico: true, activo: true, cita: "08:00", imagen: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400" },
    { id: 10, nombre: "Bella", especie: "gato", raza: "Tricolor", dueño: "Rosa", costo: 34000, critico: false, activo: true, cita: "12:00", imagen: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400" }
];

// Sonidos
const audioLlamar = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const audioCheck = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');

// Lógica de Monitor Priorizada
function llamarSiguiente() {
    const enEspera = pacientes.filter(p => p.activo);
    if (enEspera.length === 0) {
        showToast("📭 No hay pacientes en espera");
        return;
    }

    // Prioridad: 1. Críticos, 2. Hora de cita
    enEspera.sort((a, b) => (b.critico - a.critico) || a.cita.localeCompare(b.cita));
    const siguiente = enEspera[0];

    audioLlamar.play().catch(()=>{});
    
    const pantalla = document.getElementById("pacienteLlamado");
    pantalla.textContent = "🔔 " + siguiente.nombre;
    pantalla.style.color = siguiente.critico ? "IndianRed" : "LightGreen";
    
    document.getElementById("btnAtendido").classList.remove("oculto");
    document.getElementById("btnSiguiente").classList.add("oculto");
    showToast(`Atendiendo a ${siguiente.nombre}...`);
}

function finalizarAtencion() {
    const pantalla = document.getElementById("pacienteLlamado");
    const nombre = pantalla.textContent.replace("🔔 ", "");
    
    const paciente = pacientes.find(p => p.nombre === nombre);
    if (paciente) { 
        paciente.activo = false; 
        paciente.critico = false; 
    }

    audioCheck.play().catch(()=>{});
    pantalla.textContent = "ESPERANDO PACIENTE...";
    pantalla.style.color = "white";
    
    document.getElementById("btnAtendido").classList.add("oculto");
    document.getElementById("btnSiguiente").classList.remove("oculto");
    refrescarUI();
}

// Interfaz
function refrescarUI() {
    const busqueda = document.getElementById("inputBusqueda").value.toLowerCase();
    const especie = document.getElementById("selectEspecie").value;
    const soloActivos = document.getElementById("checkActivo").checked;

    let filtrados = pacientes.filter(p => {
        const matchN = p.nombre.toLowerCase().includes(busqueda) || p.dueño.toLowerCase().includes(busqueda);
        const matchE = especie === "todos" || p.especie === especie;
        const matchA = soloActivos ? p.activo : true;
        return matchN && matchE && matchA;
    });

    render(filtrados);
}

function render(lista) {
    const grid = document.getElementById("gridPacientes");
    grid.innerHTML = "";
    
    document.getElementById("totalPacientes").textContent = lista.length;
    document.getElementById("valorCaja").textContent = "$" + lista.reduce((a,b)=>a+b.costo,0).toLocaleString();
    
    // Alerta de sirena si hay críticos
    lista.some(p => p.critico && p.activo) ? 
        document.getElementById("alertaEmergencia").classList.remove("oculto") : 
        document.getElementById("alertaEmergencia").classList.add("oculto");

    lista.forEach((p, index) => {
        grid.innerHTML += `
            <article class="vet-card" style="animation-delay: ${index * 0.1}s">
                <span class="badge ${p.critico ? 'rojo' : 'gris'}">${p.critico ? 'CRÍTICO' : 'ESTABLE'}</span>
                <img src="${p.imagen}" class="img-box">
                <div class="card-body">
                    <h3>${p.nombre}</h3>
                    <p>${p.raza} • ${p.dueño}</p>
                    <span class="cita-tag">🕒 ${p.cita} hs</span>
                    <div style="margin-top:15px; font-weight:800; color:var(--primary); font-size:1.1rem">
                        $${p.costo.toLocaleString()}
                    </div>
                </div>
            </article>`;
    });
}

function showToast(m) {
    const t = document.getElementById("toast"); t.textContent = m;
    t.classList.remove("oculto"); setTimeout(() => t.classList.add("oculto"), 3000);
}

// Event Listeners
document.getElementById("inputBusqueda").oninput = refrescarUI;
document.getElementById("selectEspecie").onchange = refrescarUI;
document.getElementById("checkActivo").onchange = refrescarUI;

refrescarUI();