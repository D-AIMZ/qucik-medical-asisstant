async function fetchDoctors() {
    try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
            throw new Error("Failed to fetch doctors");
        }
        const doctors = await response.json();
        displayDoctors(doctors);
    } catch (error) {
        console.error(error);
    }
}
function displayDoctors(doctors) {
    const doctorList = document.getElementById("doctor-list");
    doctorList.innerHTML = "";
    doctors.forEach(doctor => {
        const card = document.createElement("div");
        card.className = "doctor-card";
        card.innerHTML = `
            <h3>${doctor.name}</h3>
            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
            <p><strong>Hospital:</strong> ${doctor.hospital}</p>
            <p><strong>Consultation Price:</strong> $${doctor.price}</p>
        `;
        doctorList.appendChild(card);
    });
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation not supported.");
    }
}
function showPosition(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    console.log("User Location:", userLat, userLng);
    fetchDoctors();
}
let lastScrollTop = 0;
const header = document.querySelector("header");
window.addEventListener("scroll", function () {
    let scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

    // SHOW HEADER WHEN SCROLLING UP
    if (scrollTop < lastScrollTop) {
        header.classList.add("show");
    }
    // HIDE HEADER WHEN SCROLLING DOWN
    else {
        header.classList.remove("show");
    }
    lastScrollTop = scrollTop;
});
function getLocation(){
if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(
(position)=>{
const lat = position.coords.latitude;
const lng = position.coords.longitude;
window.open(
`https://www.google.com/maps/search/doctors/@${lat},${lng},15z`
);
});
}else{
alert("Geolocation not supported");
}
}
fetchDoctors();
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;
function changeSlide(){
    slides[currentSlide].classList.remove("active");
    currentSlide++;
    if(currentSlide >= slides.length){
        currentSlide = 0;
    }
    slides[currentSlide].classList.add("active");
}
setInterval(changeSlide, 4000);
/* lociation*/
async function getUserLocation() {
    const locationElement = document.getElementById("location");
    if (!navigator.geolocation) {
        locationElement.textContent = "Geolocation not supported";
        return;
    }
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "Unknown Area";
                const country = data.address.country || "";
                locationElement.textContent = `${city}, ${country}`;
            } catch (error) {
                locationElement.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
        },
        (error) => {
            locationElement.textContent = "Location permission denied";
        }
    );
}
getUserLocation();
/* navigate location*/
navigator.geolocation.watchPosition(
    async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        document.getElementById("location").textContent =
            `${data.address.city || data.address.town || data.address.village}, ${data.address.country}`;
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0
    }
);