const form = document.querySelector("#form");
const inputText = document.querySelector("#nombre-input");
const ipParrafo = document.querySelector(".info-seccion:nth-child(1) .texto");
const locationParrafo = document.querySelector(".info-seccion:nth-child(2) .texto");
const timezoneParrafo = document.querySelector(".info-seccion:nth-child(3) .texto");
const ispParrafo = document.querySelector(".info-seccion:nth-child(4) .texto");

let mapa;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const respuesta = await fetch('https://api.ipify.org?format=json');
        const ipObj = await respuesta.json(); 
        consultarApi(ipObj.ip);  
    } catch (error) {
        console.log(error);
    }

})

form.addEventListener("submit", e => {
    e.preventDefault();

    if(inputText.value.trim() === "") {
        mostrarError("it cannot be empty!");
        return;
    } 

    eliminarErrorPrevio();
    consultarApi(inputText.value);
});

function mostrarError(mensaje) {
    eliminarErrorPrevio();

    const pError = document.createElement("p");
    pError.textContent = mensaje;
    pError.classList.add("error-mensaje");
    inputText.parentElement.parentElement.appendChild(pError);
}

function eliminarErrorPrevio() {
    if(document.querySelector(".error-mensaje")) {
        document.querySelector(".error-mensaje").remove();
    }
}

async function consultarApi(buscar) {

    if(document.querySelector("#mapa")) {
        document.querySelector("#mapa").remove();
    }

    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_JDx9jQwA8x5ZcceoK1czGo3K5ndc8&ipAddress=${buscar}`;
   
    try {
        const respuesta = await fetch(url);

        if(!respuesta.ok) { // Si la consulta es false
            mostrarError("Invalid Ip, try again");
            ipParrafo.textContent = "Empty!";
            locationParrafo.textContent = "Empty!";
            timezoneParrafo.textContent = "Empty!";
            ispParrafo.textContent = "Empty!";
            return;
        }

        const datos = await respuesta.json();
        // console.log(datos);
        mostrarInfo(datos);
    } catch (error) {
        console.log(error);
    }
    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(datos => console.log(datos))
}


function mostrarInfo({ip, isp, location: {city, region, timezone, lat, lng}}) {
    inputText.value = ip;

    ipParrafo.textContent = ip;
    locationParrafo.textContent = `${city}, ${region}`;
    timezoneParrafo.textContent = `UTC ${timezone}`
    ispParrafo.textContent = isp;

    mostrarMapa(lat, lng);  // latitud / longitud
}   

function mostrarMapa(lat, lng) {
    const mapaContenedor = document.createElement("section");
    mapaContenedor.id = "mapa";
    document.body.appendChild(mapaContenedor);

    mapa = L.map("mapa").setView([lat, lng], 17);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);
    
    const iconoMarcador = L.icon({
        iconUrl: '../img/icon-location.svg',
        iconSize: [46, 56],
        iconAnchor: [22, 94],
    });

    const marcador = L.marker([lat, lng], {icon: iconoMarcador}).addTo(mapa);


}