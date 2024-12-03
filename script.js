// Objeto global para almacenar datos del usuario
let usuario = {};

// Pila para rastrear la navegación entre vistas
let vistaStack = [];

// Objeto con las categorías de videos y su progreso
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

// Array para almacenar reproductores de YouTube
let players = [];

// Referencias a los gráficos creados con Chart.js
let graficoBarra = null;
let graficoPastel = null;

// Función para cambiar la vista activa
function mostrarVista(vistaId) {
    const vistaActual = document.querySelector(".view:not(.hidden)")?.id;
    if (vistaActual && vistaActual !== vistaId) {
        vistaStack.push(vistaActual); // Guarda la vista actual en la pila
    }

    // Oculta todas las vistas
    document.querySelectorAll(".view").forEach((view) => {
        view.classList.add("hidden");
    });

    // Muestra la vista seleccionada
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
        const vistaAnterior = vistaStack.pop(); // Recupera la última vista guardada
        mostrarVista(vistaAnterior);
    } else {
        console.error("No hay una vista anterior registrada.");
    }
}

// Procesa los datos del formulario de registro
function procesarRegistro(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const edad = document.getElementById("edad").value.trim();

    if (!nombre || !correo || !edad) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Almacena los datos del usuario
    usuario = { nombre, correo, edad };

    // Actualiza los datos en la vista de usuario registrado
    document.getElementById("userName").innerText = usuario.nombre;
    document.getElementById("userEmail").innerText = usuario.correo;
    document.getElementById("userAge").innerText = usuario.edad;

    // Cambia a la vista de usuario registrado
    mostrarVista("userView");
}

// Muestra las categorías disponibles
function mostrarCategorias() {
    const categoriasDiv = document.getElementById("categorias");
    categoriasDiv.innerHTML = ""; // Limpia el contenido anterior

    for (const categoria in categorias) {
        const boton = document.createElement("button"); // Crea un botón para cada categoría
        boton.innerText = categoria;
        boton.onclick = () => mostrarVideos(categoria); // Asocia la función de mostrar videos
        categoriasDiv.appendChild(boton);
    }

    // Cambia a la vista de categorías
    mostrarVista("categoriesView");
}

// Muestra los videos de una categoría seleccionada
function mostrarVideos(categoria) {
    const videosDiv = document.getElementById("videos");
    videosDiv.innerHTML = `<h3>Videos de ${categoria}:</h3>`; // Título de la categoría

    players = []; // Reinicia la lista de reproductores

    categorias[categoria].forEach((video, index) => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "video-container";

        // Contenedor para el reproductor de YouTube
        const playerDiv = document.createElement("div");
        playerDiv.id = `player-${index}`;
        videoContainer.appendChild(playerDiv);

        // Contenedor para la barra de progreso
        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "progress-bar-container";

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        progressBar.style.width = `${video.porcentaje}%`; // Configura el progreso inicial
        progressBar.innerText = `${video.porcentaje}%`;
        progressBarContainer.appendChild(progressBar);

        videoContainer.appendChild(progressBarContainer);
        videosDiv.appendChild(videoContainer);

        // Inicializa el reproductor de YouTube
        const player = new YT.Player(`player-${index}`, {
            videoId: video.videoId,
            events: {
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        actualizarProgreso(event.target, video, progressBar); // Actualiza el progreso
                    }
                }
            }
        });

        players.push(player);
    });

    // Cambia a la vista de videos
    mostrarVista("categoriesView");
}

// Actualiza el progreso de un video mientras se reproduce
function actualizarProgreso(player, video, progressBar) {
    const interval = setInterval(() => {
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
            clearInterval(interval); // Detiene la actualización si el video no se está reproduciendo
            return;
        }

        // Calcula el porcentaje de progreso
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const progreso = ((currentTime / duration) * 100).toFixed(2);
        video.porcentaje = parseFloat(progreso);

        // Actualiza la barra de progreso visualmente
        progressBar.style.width = `${progreso}%`;
        progressBar.innerText = `${progreso}%`;

        // Actualiza los gráficos dinámicos
        actualizarGraficos();
    }, 1000); // Actualización cada segundo
}

// Muestra los gráficos dinámicos de progreso
function mostrarGraficos() {
    if (graficoBarra) graficoBarra.destroy(); // Elimina el gráfico anterior si existe
    if (graficoPastel) graficoPastel.destroy(); // Elimina el gráfico anterior si existe

    const barraContext = document.getElementById("graficoBarra").getContext("2d");
    const pastelContext = document.getElementById("graficoPastel").getContext("2d");

    // Datos para el gráfico de barras
    const videosNombres = [];
    const videosProgreso = [];
    const categoriasColores = [];

    // Itera sobre las categorías para obtener datos de los gráficos
    Object.keys(categorias).forEach((categoria, categoriaIndex) => {
        const videos = categorias[categoria];
        videos.forEach((video) => {
            videosNombres.push(`${categoria}: ${video.titulo}`);
            videosProgreso.push(video.porcentaje);

            // Genera colores para cada categoría
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

    // Crea el gráfico de barras
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
                legend: { display: false },
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

    // Crea el gráfico de pastel
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
                legend: { position: "top" },
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

    // Cambia a la vista de gráficos
    mostrarVista("chartsView");
}

// Función para cerrar sesión
function salir() {
    usuario = {}; // Restablece los datos del usuario

    // Limpia los datos de la vista de usuario registrado
    document.getElementById("userName").innerText = "";
    document.getElementById("userEmail").innerText = "";
    document.getElementById("userAge").innerText = "";

    // Cambia a la vista de registro
    mostrarVista("registroView");
}

// Inicializa eventos cuando se carga el DOM
document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("formRegistro");
    formRegistro.addEventListener("submit", procesarRegistro); // Asocia el evento al formulario

    mostrarVista("registroView"); // Muestra la vista inicial de registro
});
