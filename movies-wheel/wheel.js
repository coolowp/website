// =========================================
// MOVIE WHEEL
// =========================================

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinButton = document.getElementById("spin-button");
const resultMovie = document.getElementById("result-movie");
const wheelTitle = document.getElementById("wheel-title");
const movieCount = document.getElementById("movie-count");


// =========================================
// GET MOVIE LIST FROM URL
// =========================================

const params = new URLSearchParams(window.location.search);

const listFile = params.get("list");


// =========================================
// CONFIGURATION
// =========================================

let movies = [];

let rotation = 0;
let spinning = false;

let animationStart = null;
let startRotation = 0;
let targetRotation = 0;
let spinDuration = 5000;


// =========================================
// LOAD MOVIES
// =========================================

async function loadMovies() {

    if (!listFile) {

        showError("No movie list was selected.");

        return;
    }


    try {

        const response = await fetch(`movies/${listFile}`);

        if (!response.ok) {

            throw new Error(
                `Could not load ${listFile}`
            );

        }


        const text = await response.text();


        movies = text
            .split(/\r?\n/)
            .map(movie => movie.trim())
            .filter(movie => movie.length > 0);


        if (movies.length === 0) {

            showError("This movie list is empty.");

            return;
        }


        // Page title
        wheelTitle.textContent =
            formatListName(listFile);


        movieCount.textContent =
            `${movies.length} movies loaded`;


        drawWheel();

    }

    catch (error) {

        console.error("Movie wheel error:", error);

        showError(
            "Could not load the movie list. Check the file path."
        );

    }

}


// =========================================
// FORMAT CATEGORY NAME
// =========================================

function formatListName(filename) {

    return filename
        .replace(".txt", "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


// =========================================
// ERROR DISPLAY
// =========================================

function showError(message) {

    wheelTitle.textContent = "ERROR";

    movieCount.textContent = message;

    spinButton.disabled = true;

    console.error(message);

}


// =========================================
// DRAW WHEEL
// =========================================

function drawWheel() {

    const width = canvas.width;
    const height = canvas.height;

    const centerX = width / 2;
    const centerY = height / 2;

    const radius = Math.min(width, height) / 2 - 20;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    if (movies.length === 0) {
        return;
    }


    const sliceAngle =
        (Math.PI * 2) / movies.length;


    ctx.save();

    ctx.translate(centerX, centerY);

    ctx.rotate(rotation);


    // -------------------------------------
    // SLICES
    // -------------------------------------

    for (let i = 0; i < movies.length; i++) {

        const startAngle =
            i * sliceAngle;

        const endAngle =
            startAngle + sliceAngle;


        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(
            0,
            0,
            radius,
            startAngle,
            endAngle
        );

        ctx.closePath();


        // Alternating shades
        ctx.fillStyle =
            i % 2 === 0
                ? "#17171d"
                : "#24242c";

        ctx.fill();


        // Border
        ctx.strokeStyle = "#ff315f";
        ctx.lineWidth = 1;

        ctx.stroke();


        // ---------------------------------
        // TEXT
        // ---------------------------------

        drawMovieText(
            movies[i],
            startAngle,
            sliceAngle,
            radius
        );

    }


    ctx.restore();


    // -------------------------------------
    // CENTER CIRCLE
    // -------------------------------------

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        65,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#09090b";

    ctx.fill();


    ctx.strokeStyle = "#ff315f";

    ctx.lineWidth = 4;

    ctx.stroke();


    // Center text

    ctx.fillStyle = "#eeeeee";

    ctx.font =
        "bold 16px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        "SPIN",
        centerX,
        centerY
    );

}


// =========================================
// MOVIE TEXT
// =========================================

function drawMovieText(
    movie,
    startAngle,
    sliceAngle,
    radius
) {

    const centerAngle =
        startAngle + sliceAngle / 2;


    ctx.save();


    ctx.rotate(centerAngle);


    ctx.translate(
        radius * 0.62,
        0
    );


    // Flip text if it would be upside down

    if (
        centerAngle > Math.PI / 2 &&
        centerAngle < Math.PI * 1.5
    ) {

        ctx.rotate(Math.PI);

    }


    // Font size adapts to amount of movies

    let fontSize = 18;

    if (movies.length > 20) {
        fontSize = 13;
    }

    if (movies.length > 40) {
        fontSize = 10;
    }

    if (movies.length > 70) {
        fontSize = 8;
    }


    ctx.font =
        `bold ${fontSize}px Arial`;


    ctx.fillStyle = "#eeeeee";


    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    // Don't render enormous names

    let displayName = movie;

    const maxCharacters =
        movies.length > 40 ? 16 : 25;


    if (displayName.length > maxCharacters) {

        displayName =
            displayName.substring(
                0,
                maxCharacters - 3
            ) + "...";

    }


    ctx.fillText(
        displayName,
        0,
        0
    );


    ctx.restore();

}


// =========================================
// SPIN
// =========================================

function spinWheel() {

    if (spinning || movies.length === 0) {
        return;
    }


    spinning = true;

    spinButton.disabled = true;


    resultMovie.textContent =
        "CHOOSING...";


    // -------------------------------------
    // RANDOM WINNER
    // -------------------------------------

    const winnerIndex =
        Math.floor(
            Math.random() * movies.length
        );


    const sliceAngle =
        (Math.PI * 2) / movies.length;


    // We want the winning slice to
    // end underneath the pointer.


    const winnerCenter =
        winnerIndex * sliceAngle +
        sliceAngle / 2;


    const pointerAngle =
        -Math.PI / 2;


    const desiredRotation =
        pointerAngle -
        winnerCenter;


    // Add several complete rotations

    const fullSpins =
        6 + Math.floor(Math.random() * 4);


    startRotation = rotation;


    targetRotation =
        rotation +
        fullSpins * Math.PI * 2;


    // Normalize toward winner

    const currentMod =
        targetRotation % (Math.PI * 2);


    targetRotation +=
        desiredRotation -
        currentMod;


    // Duration

    spinDuration =
        4500 +
        Math.random() * 2000;


    animationStart =
        performance.now();


    requestAnimationFrame(
        animateSpin
    );

}


// =========================================
// ANIMATE
// =========================================

function animateSpin(timestamp) {

    const elapsed =
        timestamp - animationStart;


    const progress =
        Math.min(
            elapsed / spinDuration,
            1
        );


    // Ease out cubic

    const eased =
        1 - Math.pow(
            1 - progress,
            4
        );


    rotation =
        startRotation +
        (
            targetRotation -
            startRotation
        ) * eased;


    drawWheel();


    if (progress < 1) {

        requestAnimationFrame(
            animateSpin
        );

        return;

    }


    // -------------------------------------
    // FINISHED
    // -------------------------------------

    rotation =
        targetRotation;


    drawWheel();


    spinning = false;

    spinButton.disabled = false;


    const winnerIndex =
        getWinnerIndex();


    resultMovie.textContent =
        movies[winnerIndex];

}


// =========================================
// DETERMINE WINNER
// =========================================

function getWinnerIndex() {

    const sliceAngle =
        (Math.PI * 2) / movies.length;


    // Pointer is at the top.

    const pointerAngle =
        -Math.PI / 2;


    // Convert pointer angle
    // into wheel-local coordinates.

    let angle =
        pointerAngle - rotation;


    angle =
        ((angle % (Math.PI * 2)) +
            Math.PI * 2) %
        (Math.PI * 2);


    const index =
        Math.floor(
            angle / sliceAngle
        );


    return index;

}


// =========================================
// BUTTON
// =========================================

spinButton.addEventListener(
    "click",
    spinWheel
);


// =========================================
// START
// =========================================

loadMovies();