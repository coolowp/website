// =============================================
// WINDOWS XP MOVIE COMPUTER
// =============================================

const desktop = document.getElementById("desktop");
const windowArea = document.getElementById("window-area");

const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const contextMenu = document.getElementById("context-menu");
const taskbarWindows = document.getElementById("taskbar-windows");

let windowCounter = 0;
let highestZ = 100;

const openWindows = new Map();


// =============================================
// BOOT SCREEN
// =============================================

window.addEventListener("load", () => {

    const bootScreen = document.getElementById("boot-screen");

    if (!bootScreen) {
        return;
    }

    setTimeout(() => {

        bootScreen.classList.add("boot-fade");

        setTimeout(() => {
            bootScreen.remove();
        }, 1000);

    }, 3200);

});


// =============================================
// CLOCK
// =============================================

function updateClock() {

    const clock = document.getElementById("clock");

    if (!clock) {
        return;
    }

    const now = new Date();

    clock.textContent =
        now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

}

updateClock();

setInterval(updateClock, 1000);


// =============================================
// START MENU
// =============================================

startButton.addEventListener("click", event => {

    event.stopPropagation();

    startMenu.classList.toggle("hidden");

});


document.addEventListener("click", event => {

    if (
        !startMenu.contains(event.target) &&
        event.target !== startButton
    ) {

        startMenu.classList.add("hidden");

    }

});


// =============================================
// DESKTOP ICONS
// =============================================

document
    .querySelectorAll(".desktop-icon")
    .forEach(icon => {

        icon.addEventListener("dblclick", () => {

            handleAction(icon.dataset.action);

        });

    });


// =============================================
// ACTION BUTTONS
// =============================================

document
    .querySelectorAll("[data-action]")
    .forEach(element => {

        element.addEventListener("click", event => {

            const action =
                event.currentTarget.dataset.action;

            if (!action) {
                return;
            }

            startMenu.classList.add("hidden");

            handleAction(action);

        });

    });


// =============================================
// ACTION HANDLER
// =============================================

function handleAction(action) {

    switch (action) {

        case "my-movies":
            openMovieExplorer();
            break;

        case "my-computer":
            openMyComputer();
            break;

        case "site":
            confirmLeaveSite();
            break;

        case "recycle":
            openRecycleBin();
            break;

    }

}


// =============================================
// LEAVING THE XP COMPUTER
// =============================================

function confirmLeaveSite() {

    const confirmed = confirm(
        "Windows is about to terminate this session.\n\n" +
        "Any unsaved changes will be lost.\n\n" +
        "Do you want to continue?"
    );

    if (!confirmed) {
        return;
    }

    window.location.href = "../";

}


// =============================================
// CREATE WINDOW
// =============================================

function createWindow(
    title,
    icon = "📁",
    width = 750,
    height = 500
) {

    windowCounter++;

    const id =
        `window-${windowCounter}`;


    const win =
        document.createElement("section");

    win.className = "xp-window";

    win.id = id;

    win.style.width =
        `${width}px`;

    win.style.height =
        `${height}px`;

    win.style.left =
        `${Math.max(
            20,
            (window.innerWidth - width) / 2
        )}px`;

    win.style.top =
        `${Math.max(
            20,
            (window.innerHeight - height) / 2 - 30
        )}px`;

    win.style.zIndex =
        ++highestZ;


    win.innerHTML = `

        <div class="window-titlebar">

            <div class="window-title">

                <span>
                    ${icon}
                </span>

                <span class="window-title-text">
                    ${escapeHTML(title)}
                </span>

            </div>


            <div class="window-controls">

                <button
                    class="window-button minimize"
                    title="Minimize"
                >
                    _
                </button>

                <button
                    class="window-button maximize"
                    title="Maximize"
                >
                    □
                </button>

                <button
                    class="window-button close"
                    title="Close"
                >
                    ×
                </button>

            </div>

        </div>


        <div class="window-body"></div>

    `;


    windowArea.appendChild(win);


    const body =
        win.querySelector(".window-body");


    win.querySelector(".close")
        .addEventListener(
            "click",
            () => closeWindow(id)
        );


    win.querySelector(".minimize")
        .addEventListener(
            "click",
            () => minimizeWindow(id)
        );


    win.querySelector(".maximize")
        .addEventListener(
            "click",
            () => maximizeWindow(id)
        );


    win.addEventListener("mousedown", () => {

        win.style.zIndex =
            ++highestZ;

    });


    makeDraggable(win);


    openWindows.set(id, {
        element: win,
        title,
        minimized: false
    });


    createTaskbarButton(
        id,
        title,
        icon
    );


    return {
        id,
        element: win,
        body
    };

}


// =============================================
// DRAGGING
// =============================================

function makeDraggable(win) {

    const titlebar =
        win.querySelector(".window-titlebar");

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    titlebar.addEventListener("mousedown", event => {

        if (
            event.target.closest(".window-controls")
        ) {
            return;
        }


        dragging = true;

        offsetX =
            event.clientX -
            win.offsetLeft;

        offsetY =
            event.clientY -
            win.offsetTop;


        win.style.zIndex =
            ++highestZ;

    });


    document.addEventListener("mousemove", event => {

        if (!dragging) {
            return;
        }


        const maxX =
            window.innerWidth -
            win.offsetWidth;


        const maxY =
            window.innerHeight -
            win.offsetHeight -
            32;


        let x =
            event.clientX -
            offsetX;

        let y =
            event.clientY -
            offsetY;


        x =
            Math.max(
                0,
                Math.min(x, maxX)
            );


        y =
            Math.max(
                0,
                Math.min(y, maxY)
            );


        win.style.left =
            `${x}px`;

        win.style.top =
            `${y}px`;

    });


    document.addEventListener("mouseup", () => {

        dragging = false;

    });

}


// =============================================
// MINIMIZE
// =============================================

function minimizeWindow(id) {

    const data =
        openWindows.get(id);

    if (!data) {
        return;
    }


    data.element.classList.add(
        "window-minimized"
    );

    data.minimized = true;

}


// =============================================
// CLOSE
// =============================================

function closeWindow(id) {

    const data =
        openWindows.get(id);

    if (!data) {
        return;
    }


    data.element.remove();

    openWindows.delete(id);


    const taskButton =
        document.querySelector(
            `[data-window-id="${id}"]`
        );


    if (taskButton) {
        taskButton.remove();
    }

}


// =============================================
// MAXIMIZE
// =============================================

function maximizeWindow(id) {

    const data =
        openWindows.get(id);

    if (!data) {
        return;
    }


    data.element.classList.toggle(
        "window-maximized"
    );

}


// =============================================
// TASKBAR BUTTON
// =============================================

function createTaskbarButton(
    id,
    title,
    icon
) {

    const button =
        document.createElement("button");

    button.className =
        "taskbar-window";

    button.dataset.windowId =
        id;


    button.innerHTML = `
        ${icon}
        <span>
            ${escapeHTML(title)}
        </span>
    `;


    button.addEventListener("click", () => {

        const data =
            openWindows.get(id);

        if (!data) {
            return;
        }


        if (data.minimized) {

            data.element.classList.remove(
                "window-minimized"
            );

            data.minimized = false;

        }


        data.element.style.zIndex =
            ++highestZ;

    });


    taskbarWindows.appendChild(button);

}


// =============================================
// MOVIE EXPLORER
// =============================================

function openMovieExplorer() {

    const win =
        createWindow(
            "My Movies",
            "📁",
            900,
            620
        );


    win.history = ["My Movies"];
    win.historyIndex = 0;


    renderExplorer(
        win,
        "My Movies"
    );

}


// =============================================
// EXPLORER NAVIGATION
// =============================================

function navigateExplorer(
    win,
    folder,
    addToHistory = true
) {

    if (addToHistory) {

        win.history =
            win.history.slice(
                0,
                win.historyIndex + 1
            );

        win.history.push(folder);

        win.historyIndex++;

    }


    renderExplorer(
        win,
        folder
    );

}


// =============================================
// EXPLORER
// =============================================

function renderExplorer(
    win,
    currentFolder
) {

    const container =
        win.body;


    const canGoBack =
        win.historyIndex > 0;


    const canGoForward =
        win.historyIndex <
        win.history.length - 1;


    const isRoot =
        currentFolder === "My Movies";


    container.innerHTML = `

        <div class="explorer-toolbar">

            <button
                class="toolbar-button nav-button"
                data-nav="back"
                ${canGoBack ? "" : "disabled"}
                title="Back"
            >
                ◀
            </button>

            <button
                class="toolbar-button nav-button"
                data-nav="forward"
                ${canGoForward ? "" : "disabled"}
                title="Forward"
            >
                ▶
            </button>

            <button
                class="toolbar-button nav-button"
                data-nav="up"
                ${isRoot ? "disabled" : ""}
                title="Up"
            >
                ▲
            </button>


            <button
                class="toolbar-button"
                data-nav="refresh"
                title="Refresh"
            >
                ↻
            </button>


            <div class="address-bar">

                <span>📁</span>

                <span>
                    My Movies\\${escapeHTML(currentFolder)}
                </span>

            </div>

        </div>


        <div class="explorer-main">

            <aside class="explorer-sidebar">

                <div class="sidebar-section">

                    <div class="sidebar-title">
                        Movie Tasks
                    </div>

                    <button
                        data-side-action="folders"
                    >
                        📁 View movie folders
                    </button>

                    <button
                        data-side-action="search"
                    >
                        🔍 Search movies
                    </button>

                </div>


                <hr>


                <div class="sidebar-section">

                    <div class="sidebar-title">
                        Other Places
                    </div>

                    <button
                        data-side-action="computer"
                    >
                        🖥️ My Computer
                    </button>

                    <button
                        data-side-action="corner"
                    >
                        🌐 My Corner
                    </button>

                </div>


                <hr>


                <div class="sidebar-section">

                    <div class="sidebar-title">
                        Details
                    </div>

                    <div class="sidebar-details">

                        <strong>
                            ${escapeHTML(currentFolder)}
                        </strong>

                        <span>
                            ${getFolderStatus(currentFolder)}
                        </span>

                    </div>

                </div>

            </aside>


            <div
                class="explorer-content"
            ></div>

        </div>


        <div class="explorer-status">

            ${getFolderStatus(currentFolder)}

        </div>

    `;


    // =====================================
    // NAVIGATION BUTTONS
    // =====================================

    container
        .querySelector('[data-nav="back"]')
        .addEventListener("click", () => {

            if (!canGoBack) {
                return;
            }

            win.historyIndex--;

            renderExplorer(
                win,
                win.history[
                    win.historyIndex
                ]
            );

        });


    container
        .querySelector('[data-nav="forward"]')
        .addEventListener("click", () => {

            if (!canGoForward) {
                return;
            }

            win.historyIndex++;

            renderExplorer(
                win,
                win.history[
                    win.historyIndex
                ]
            );

        });


    container
        .querySelector('[data-nav="up"]')
        .addEventListener("click", () => {

            if (isRoot) {
                return;
            }

            navigateExplorer(
                win,
                "My Movies"
            );

        });


    container
        .querySelector('[data-nav="refresh"]')
        .addEventListener("click", () => {

            renderExplorer(
                win,
                currentFolder
            );

        });


    // =====================================
    // SIDEBAR
    // =====================================

    container
        .querySelector(
            '[data-side-action="folders"]'
        )
        .addEventListener("click", () => {

            navigateExplorer(
                win,
                "My Movies"
            );

        });


    container
        .querySelector(
            '[data-side-action="search"]'
        )
        .addEventListener("click", () => {

            showMovieSearch(
                win
            );

        });


    container
        .querySelector(
            '[data-side-action="computer"]'
        )
        .addEventListener("click", () => {

            openMyComputer();

        });


    container
        .querySelector(
            '[data-side-action="corner"]'
        )
        .addEventListener("click", () => {

            confirmLeaveSite();

        });


    // =====================================
    // CONTENT
    // =====================================

    const content =
        container.querySelector(
            ".explorer-content"
        );


    if (isRoot) {

        renderFolders(
            content,
            win
        );

    }
    else {

        renderMovies(
            content,
            currentFolder
        );

    }

}


// =============================================
// FOLDERS
// =============================================

function renderFolders(
    container,
    win
) {

    const folders =
        Object.keys(movieDatabase);


    if (folders.length === 0) {

        container.innerHTML = `
            <div class="empty-folder">
                No movie folders found.
            </div>
        `;

        return;

    }


    const folderGrid =
        document.createElement("div");

    folderGrid.className =
        "folder-grid";


    folders.forEach(folderName => {

        const folder =
            document.createElement("div");

        folder.className =
            "explorer-folder";


        folder.innerHTML = `

            <div class="folder-icon">
                📁
            </div>

            <div class="folder-name">
                ${escapeHTML(folderName)}
            </div>

            <div class="folder-count">
                ${
                    movieDatabase[
                        folderName
                    ].length
                } movies
            </div>

        `;


        folder.addEventListener(
            "dblclick",
            () => {

                navigateExplorer(
                    win,
                    folderName
                );

            }
        );


        folderGrid.appendChild(folder);

    });


    container.appendChild(
        folderGrid
    );

}


// =============================================
// MOVIES
// =============================================

function renderMovies(
    container,
    folderName
) {

    const movies =
        movieDatabase[folderName] || [];


    if (movies.length === 0) {

        container.innerHTML = `
            <div class="empty-folder">

                <div style="font-size:50px;">
                    📂
                </div>

                <div>
                    This folder is empty.
                </div>

            </div>
        `;

        return;

    }


    const movieGrid =
        document.createElement("div");

    movieGrid.className =
        "movie-grid";


    movies.forEach(movie => {

        const card =
            document.createElement("div");

        card.className =
            "movie-card";


        card.innerHTML = `

            <div class="movie-poster">

                <img
                    src="${escapeHTML(movie.poster)}"
                    alt="${escapeHTML(movie.title)}"
                    onerror="this.parentElement.classList.add('poster-missing')"
                >

            </div>

            <div class="movie-name">
                ${escapeHTML(movie.title)}
            </div>

            <div class="movie-year">
                ${escapeHTML(movie.releaseDate)}
            </div>

        `;


        card.addEventListener(
            "dblclick",
            () => {

                openMovieDetails(
                    movie
                );

            }
        );


        movieGrid.appendChild(card);

    });


    container.appendChild(
        movieGrid
    );

}


// =============================================
// SEARCH
// =============================================

function showMovieSearch(win) {

    const content =
        win.body.querySelector(
            ".explorer-content"
        );


    content.innerHTML = `

        <div class="movie-search">

            <div class="search-heading">

                <span class="search-big-icon">
                    🔍
                </span>

                <div>

                    <h2>
                        Search for movies
                    </h2>

                    <p>
                        Search your entire movie collection.
                    </p>

                </div>

            </div>


            <div class="search-box-row">

                <input
                    type="text"
                    id="movie-search-input"
                    placeholder="Type a movie name..."
                    autocomplete="off"
                >

                <button
                    class="xp-button"
                    id="movie-search-button"
                >
                    Search
                </button>

            </div>


            <div
                id="movie-search-results"
                class="movie-search-results"
            >

                <div class="search-placeholder">
                    Type something above to search.
                </div>

            </div>

        </div>

    `;


    const input =
        content.querySelector(
            "#movie-search-input"
        );


    const button =
        content.querySelector(
            "#movie-search-button"
        );


    const results =
        content.querySelector(
            "#movie-search-results"
        );


    function performSearch() {

        const query =
            input.value
                .trim()
                .toLowerCase();


        if (!query) {

            results.innerHTML = `
                <div class="search-placeholder">
                    Type something above to search.
                </div>
            `;

            return;

        }


        const matches = [];


        Object.entries(
            movieDatabase
        ).forEach(
            ([category, movies]) => {

                movies.forEach(movie => {

                    if (
                        movie.title
                            .toLowerCase()
                            .includes(query)
                    ) {

                        matches.push({
                            movie,
                            category
                        });

                    }

                });

            }
        );


        if (matches.length === 0) {

            results.innerHTML = `

                <div class="search-placeholder">

                    <div style="font-size:40px;">
                        😢
                    </div>

                    No movies found matching
                    "<strong>${escapeHTML(input.value)}</strong>".

                </div>

            `;

            return;

        }


        results.innerHTML = `

            <div class="search-result-count">

                ${matches.length}
                result${matches.length === 1 ? "" : "s"}

            </div>

        `;


        matches.forEach(
            ({ movie, category }) => {

                const result =
                    document.createElement("div");

                result.className =
                    "search-result";


                result.innerHTML = `

                    <div class="search-result-poster">

                        <img
                            src="${escapeHTML(movie.poster)}"
                            alt=""
                        >

                    </div>


                    <div class="search-result-info">

                        <strong>
                            ${escapeHTML(movie.title)}
                        </strong>

                        <span>
                            ${escapeHTML(movie.releaseDate)}
                        </span>

                        <small>
                            📁 ${escapeHTML(category)}
                        </small>

                    </div>

                `;


                result.addEventListener(
                    "dblclick",
                    () => {

                        openMovieDetails(
                            movie
                        );

                    }
                );


                results.appendChild(
                    result
                );

            }
        );

    }


    button.addEventListener(
        "click",
        performSearch
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                performSearch();

            }

        }
    );


    setTimeout(
        () => input.focus(),
        50
    );

}


// =============================================
// MOVIE DETAILS
// =============================================

function openMovieDetails(movie) {

    const win =
        createWindow(
            movie.title,
            "🎬",
            520,
            450
        );


    win.body.innerHTML = `

        <div class="movie-details">

            <div class="details-poster">

                <img
                    src="${escapeHTML(movie.poster)}"
                    alt="${escapeHTML(movie.title)}"
                    onerror="this.parentElement.classList.add('poster-missing')"
                >

            </div>


            <div class="details-info">

                <h2>
                    ${escapeHTML(movie.title)}
                </h2>


                <div class="details-row">

                    <strong>
                        Release Date:
                    </strong>

                    <span>
                        ${escapeHTML(movie.releaseDate)}
                    </span>

                </div>


                <div class="details-row">

                    <strong>
                        Genre:
                    </strong>

                    <span>
                        ${escapeHTML(movie.genre)}
                    </span>

                </div>


                <div class="details-row">

                    <strong>
                        Format:
                    </strong>

                    <span>
                        ${escapeHTML(movie.format)}
                    </span>

                </div>


                <div class="details-row">

                    <strong>
                        Playtime:
                    </strong>

                    <span>
                        ${escapeHTML(movie.playtime)}
                    </span>

                </div>
                
                
                <div class="details-row">

                    <strong>
                        Type:
                    </strong>

                    <span>
                        ${escapeHTML(movie.type)}
                    </span>

                </div>                


                <br>


                <button
                    class="xp-button"
                    id="movie-details-ok"
                >
                    OK
                </button>

            </div>

        </div>

    `;


    win.body
        .querySelector("#movie-details-ok")
        .addEventListener("click", () => {

            closeWindow(
                win.id
            );

        });

}


// =============================================
// MY COMPUTER
// =============================================

function openMyComputer() {

    const win =
        createWindow(
            "My Computer",
            "🖥️",
            700,
            450
        );


    win.body.innerHTML = `

        <div class="computer-view">

            <h2>
                My Computer
            </h2>


            <div class="computer-items">

                <div
                    class="computer-item"
                    id="open-my-movies"
                >

                    <div>📁</div>

                    <span>
                        My Movies
                    </span>

                </div>


                <div class="computer-item">

                    <div>💾</div>

                    <span>
                        Local Disk (C:)
                    </span>

                </div>


                <div class="computer-item">

                    <div>💿</div>

                    <span>
                        CD Drive (D:)
                    </span>

                </div>


                <div class="computer-item">

                    <div>🌐</div>

                    <span>
                        Network
                    </span>

                </div>

            </div>

        </div>

    `;


    win.body
        .querySelector("#open-my-movies")
        .addEventListener(
            "dblclick",
            () => {

                closeWindow(win.id);

                openMovieExplorer();

            }
        );

}


// =============================================
// RECYCLE BIN
// =============================================

function openRecycleBin() {

    const win =
        createWindow(
            "Recycle Bin",
            "🗑️",
            600,
            400
        );


    win.body.innerHTML = `

        <div class="empty-bin">

            <div class="big-bin">
                🗑️
            </div>

            <h2>
                Recycle Bin is empty
            </h2>

            <p>
                There is absolutely nothing here.
                You calling my dvd's trash?!?!
            </p>

        </div>

    `;

}


// =============================================
// STATUS
// =============================================

function getFolderStatus(folder) {

    if (
        folder === "My Movies"
    ) {

        const count =
            Object.values(movieDatabase)
                .reduce(
                    (total, movies) =>
                        total + movies.length,
                    0
                );


        return `${count} movies`;

    }


    return `${
        movieDatabase[folder]?.length || 0
    } movies`;

}


// =============================================
// RIGHT CLICK
// =============================================

desktop.addEventListener(
    "contextmenu",
    event => {

        if (
            event.target.closest(
                ".xp-window, .taskbar, .start-menu"
            )
        ) {

            return;

        }


        event.preventDefault();


        contextMenu.style.left =
            `${event.clientX}px`;

        contextMenu.style.top =
            `${event.clientY}px`;


        contextMenu.classList.remove(
            "hidden"
        );

    }
);


document.addEventListener(
    "click",
    () => {

        contextMenu.classList.add(
            "hidden"
        );

    }
);


// =============================================
// ESCAPE HTML
// =============================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

