let map;

let score = 0;
let currentQuestion = 0;
let answered = false;
let startTime;
let timerInterval;

const locations = [
    {
        name: "Sierra Hall",
        bounds: {
            north: 34.23875,
            south: 34.23800,
            east: -118.53000,
            west: -118.53150
        }
    },

    {
        name: "University Library",
        bounds: {
            north: 34.24060,
            south: 34.23950,
            east: -118.52850,
            west: -118.53025
        }
    },

    {
        name: "The Soraya",
        bounds: {
            north: 34.23665,
            south: 34.23560,
            east: -118.52740,
            west: -118.52900
        }
    },

    {
        name: "Student Recreation Center",
        bounds: {
            north: 34.24050,
            south: 34.23925,
            east: -118.52450,
            west: -118.52550
        }
    },

    {
        name: "Botanic Garden",
        bounds: {
            north: 34.23925,
            south: 34.23850,
            east: -118.52600,
            west: -118.52725
        }
    }


];

function triggerConfetti() {

    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
    });

}

function initMap() {

    const csun = {
        lat: 34.2382,
        lng: -118.5290
    };

    map = new google.maps.Map(document.getElementById("map"), {

        center: csun,
        zoom: 17,

        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        zoomControl: false,
        keyboardShortcuts: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,

        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    showQuestion();
    startTime = Date.now();
    timerInterval = setInterval(() => {
        let seconds = Math.floor((Date.now() - startTime) / 1000);

        document.getElementById("timer").innerHTML =
            "Time: " + seconds + "s";

    }, 1000);
    // Double click listener
    map.addListener("dblclick", function(event) {

        if (answered) {
            return;
        }

        answered = true;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        checkAnswer(lat, lng);

    });

}

function showQuestion() {

    const statusEl = document.getElementById("status");
    if (currentQuestion >= locations.length) {
        clearInterval(timerInterval);
        statusEl.innerHTML =
            "Game Over!\n\n" +
            "Final Score: " +
            score +
            " / " +
            locations.length;

        return;
    }

    const locationName = locations[currentQuestion].name;

    document.getElementById("question").innerHTML =
        "Double click on: <b>" + locationName + "</b>";

}

function checkAnswer(lat, lng) {

    const currentLocation = locations[currentQuestion];
    const bounds = currentLocation.bounds;

    const correct = isCorrect(lat, lng, bounds);

    const statusEl = document.getElementById("status");

    if (correct) {
        score++;
        statusEl.innerHTML = "Correct!";
        drawRectangle(bounds, "#00FF00");
        triggerConfetti();
    } else {
        statusEl.innerHTML = "Wrong!";
        drawRectangle(bounds, "#FF0000");
    }

    currentQuestion++;
    answered = true;

    setTimeout(() => {

        if (currentQuestion < locations.length) {
            statusEl.innerHTML = "";
        }

        showQuestion();
        answered = false;

    }, 1200);
}


function isCorrect(lat, lng, area) {

    return (

        lat <= area.north &&
        lat >= area.south &&
        lng <= area.east &&
        lng >= area.west

    );

}


function drawRectangle(bounds, color) {

    new google.maps.Rectangle({

        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 2,

        fillColor: color,
        fillOpacity: 0.35,

        map: map,

        bounds: bounds

    });

}