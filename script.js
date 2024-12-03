let usuario = {};
let vistaStack = []; // Pila para rastrear la navegación entre vistas
const categorias = {
    "Programación": [
        { titulo: "Curso de HTML Básico", videoId: "MJkdaVFHrto", porcentaje: 0 },
        { titulo: "JavaScript Avanzado", videoId: "W6NZfCO5SIk", porcentaje: 0 },
        { titulo: "CSS para Principiantes", videoId: "1Rs2ND1ryYc", porcentaje: 0 }
    ],
    "Diseño": [
        { titulo: "Photoshop desde Cero", videoId: "ZlvkLxXajzg", porcentaje: 0 },
        { titulo: "Introducción a Figma", videoId: "gf5Fo1-TirA", porcentaje: 0 },
        { titulo: "Ilustración Digital", videoId: "ubUoEuWdyuE", porcentaje: 0 }
    ],
    "Marketing": [
        { titulo: "Estrategias en Redes Sociales", videoId: "4rbEoA8THBE", porcentaje: 0 },
        { titulo: "Email Marketing Eficaz", videoId: "eyaqWErxpZg", porcentaje: 0 },
        { titulo: "SEO para Principiantes", videoId: "p0M_JdrLgnw", porcentaje: 0 }
    ]
};

let players = [];
let graficoBarra = null;
let graficoPastel = null;

// Cambiar de vista
function mostrarVista(vistaId) {
    const vistaActual = document.querySelector(".view:not(.hidden)")?.id;
    if (vistaActual && vistaActual !== vistaId) {
        vistaStack.push(vistaActual); // Guardar la vista actual en la pila
    }

    // Ocultar todas las vistas
    document.querySelectorAll(".view").forEach((view) => {
        view.classList.add("hidden");
    });

    // Mostrar la vista seleccionada
    const vista = document.getElementById(vistaId);
    if (vista) {
        vista.classList.remove("hidden");
    } else {
        console.error(`Vista no encontrada: ${vistaId}`);
    }
}

// Función para volver a la vista anterior
function volver() {
    if (vistaStack.length > 0) {
        const vistaAnterior = vistaStack.pop(); // Recuperar la última vista de la pila
        mostrarVista(vistaAnterior);
    } else {
        console.error("No hay una vista anterior registrada.");
    }
}

// Manejar el registro del usuario
function procesarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const edad = document.getElementById("edad").value.trim();

    if (!nombre || !correo || !edad) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    usuario = { nombre, correo, edad };

    document.getElementById("userName").innerText = usuario.nombre;
    document.getElementById("userEmail").innerText = usuario.correo;
    document.getElementById("userAge").innerText = usuario.edad;

    mostrarVista("userView");
}

// Mostrar categorías y videos
function mostrarCategorias() {
    const categoriasDiv = document.getElementById("categorias");
    categoriasDiv.innerHTML = "";

    for (const categoria in categorias) {
        const boton = document.createElement("button");
        boton.innerText = categoria;
        boton.onclick = () => mostrarVideos(categoria);
        categoriasDiv.appendChild(boton);
    }

    mostrarVista("categoriesView");
}

// Mostrar videos de una categoría
function mostrarVideos(categoria) {
    const videosDiv = document.getElementById("videos");
    videosDiv.innerHTML = `<h3>Videos de ${categoria}:</h3>`;

    players = [];

    categorias[categoria].forEach((video, index) => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "video-container";

        const playerDiv = document.createElement("div");
        playerDiv.id = `player-${index}`;
        videoContainer.appendChild(playerDiv);

        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "progress-bar-container";

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        progressBar.style.width = `${video.porcentaje}%`;
        progressBar.innerText = `${video.porcentaje}%`;
        progressBarContainer.appendChild(progressBar);

        videoContainer.appendChild(progressBarContainer);
        videosDiv.appendChild(videoContainer);

        const player = new YT.Player(`player-${index}`, {
            videoId: video.videoId,
            events: {
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        actualizarProgreso(event.target, video, progressBar);
                    }
                }
            }
        });

        players.push(player);
    });

    mostrarVista("categoriesView");
}

// Actualizar progreso del video
function actualizarProgreso(player, video, progressBar) {
    const interval = setInterval(() => {
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
            clearInterval(interval);
            return;
        }

        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const progreso = ((currentTime / duration) * 100).toFixed(2);
        video.porcentaje = parseFloat(progreso);
        progressBar.style.width = `${progreso}%`;
        progressBar.innerText = `${progreso}%`;
        actualizarGraficos();
    }, 1000);
}

// Mostrar gráficos dinámicos
function mostrarGraficos() {
    if (graficoBarra) graficoBarra.destroy();
    if (graficoPastel) graficoPastel.destroy();

    const barraContext = document.getElementById("graficoBarra").getContext("2d");
    const pastelContext = document.getElementById("graficoPastel").getContext("2d");

    // Datos para el gráfico de barras
    const videosNombres = [];
    const videosProgreso = [];
    const categoriasColores = [];

    Object.keys(categorias).forEach((categoria, categoriaIndex) => {
        const videos = categorias[categoria];
        videos.forEach((video) => {
            videosNombres.push(`${categoria}: ${video.titulo}`);
            videosProgreso.push(video.porcentaje);

            // Generar colores para cada categoría
            const colores = [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)"
            ];
            categoriasColores.push(colores[categoriaIndex % colores.length]);
        });
    });

    // Datos para el gráfico de pastel
    const categoriasNombres = Object.keys(categorias);
    const categoriasProgreso = categoriasNombres.map((categoria) => {
        const videos = categorias[categoria];
        const totalProgreso = videos.reduce((acc, video) => acc + video.porcentaje, 0);
        return (totalProgreso / videos.length) || 0;
    });

    // Crear gráfico de barras
    graficoBarra = new Chart(barraContext, {
        type: "bar",
        data: {
            labels: videosNombres,
            datasets: [
                {
                    label: "Progreso por Video",
                    data: videosProgreso,
                    backgroundColor: categoriasColores
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: { title: { display: true, text: "Videos" } },
                y: { beginAtZero: true, title: { display: true, text: "Progreso (%)" } }
            }
        }
    });

    // Crear gráfico de pastel
    graficoPastel = new Chart(pastelContext, {
        type: "pie",
        data: {
            labels: categoriasNombres,
            datasets: [
                {
                    label: "Distribución de Progreso por Categoría",
                    data: categoriasProgreso,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)"
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw.toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });

    mostrarVista("chartsView");
}

// Función para salir del sistema y volver a la vista de registro
function salir() {
    // Restablecer los datos del usuario
    usuario = {};

    // Limpiar los datos mostrados en la vista de usuario registrado
    document.getElementById("userName").innerText = "";
    document.getElementById("userEmail").innerText = "";
    document.getElementById("userAge").innerText = "";

    // Cambiar a la vista de registro
    mostrarVista("registroView");
}


// Inicializar eventos
document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("formRegistro");
    formRegistro.addEventListener("submit", procesarRegistro);

    mostrarVista("registroView");
});
