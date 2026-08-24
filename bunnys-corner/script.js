/* =========================================
   GLOBAL STATE
========================================= */

let currentCollection = null;

let currentMode = null;

let currentCategory = null;

let currentPage = 0;

let currentPages = [];

let navigationHistory = [];


/* =========================================
   DOM
========================================= */

const homeScreen =
    document.getElementById("home");

const bookScreen =
    document.getElementById("bookScreen");

const book =
    document.getElementById("book");

const leftPage =
    document.getElementById("leftPage");

const rightPage =
    document.getElementById("rightPage");

const leftContent =
    leftPage.querySelector(".page-content");

const rightContent =
    rightPage.querySelector(".page-content");

const pageIndicator =
    document.getElementById("pageIndicator");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");


/* =========================================
   OPEN COLLECTION
========================================= */

function openCollection(collection) {

    currentCollection = collection;

    currentMode = "index";

    currentCategory = null;

    currentPage = 0;

    navigationHistory = [];

    if (collection === "lps") {

        currentPages =
            buildLPSIndex();

    }

    else {

        currentPages =
            buildMHIndex();

    }

    homeScreen.classList.remove("active");

    bookScreen.classList.add("active");

    renderPages();
}


/* =========================================
   BACK
========================================= */

function goBack() {

    if (navigationHistory.length > 0) {

        const previous =
            navigationHistory.pop();

        currentMode =
            previous.mode;

        currentCategory =
            previous.category;

        currentPage =
            previous.page;

        if (currentCollection === "lps") {

            if (currentMode === "index") {

                currentPages =
                    buildLPSIndex();

            }

            else {

                currentPages =
                    buildLPSCollection(
                        currentCategory
                    );

            }

        }

        else {

            if (currentMode === "index") {

                currentPages =
                    buildMHIndex();

            }

            else {

                currentPages =
                    buildMHCollection(
                        currentCategory
                    );

            }

        }

        renderPages();

        return;
    }


    bookScreen.classList.remove("active");

    homeScreen.classList.add("active");
}


/* =========================================
   SAVE NAVIGATION STATE
========================================= */

function saveState() {

    navigationHistory.push({

        mode: currentMode,

        category: currentCategory,

        page: currentPage

    });

}


/* =========================================
   LPS INDEX
========================================= */

function buildLPSIndex() {

    const pages = [];

    const molds =
        Object.keys(lpsCollection);

    const entriesPerPage = 7;

    for (
        let i = 0;
        i < molds.length;
        i += entriesPerPage
    ) {

        const chunk =
            molds.slice(
                i,
                i + entriesPerPage
            );

        pages.push({

            type: "index",

            title: "Mold Catalogue",

            entries: chunk.map(
                mold => ({

                    name: mold,

                    count:
                        countLPSMold(mold),

                    action:
                        () =>
                            openLPSMold(mold)

                })
            )

        });

    }

    return pages;
}


/* =========================================
   COUNT LPS
========================================= */

function countLPSMold(mold) {

    let count = 0;

    const species =
        lpsCollection[mold];

    for (const speciesName in species) {

        count +=
            species[speciesName].length;

    }

    return count;
}


/* =========================================
   OPEN LPS MOLD
========================================= */

function openLPSMold(mold) {

    saveState();

    currentMode = "species";

    currentCategory = mold;

    currentPage = 0;

    const species =
        Object.keys(
            lpsCollection[mold]
        );

    currentPages =
        [];

    const entriesPerPage = 7;

    for (
        let i = 0;
        i < species.length;
        i += entriesPerPage
    ) {

        const chunk =
            species.slice(
                i,
                i + entriesPerPage
            );

        currentPages.push({

            type: "species",

            title: mold,

            subtitle:
                "Species within this mold",

            entries:
                chunk.map(
                    speciesName => ({

                        name: speciesName,

                        count:
                            lpsCollection[
                                mold
                            ][
                                speciesName
                            ].length,

                        action:
                            () =>
                                openLPSSpecies(
                                    mold,
                                    speciesName
                                )

                    })
                )

        });

    }

    jumpToPages();

}


/* =========================================
   OPEN LPS SPECIES
========================================= */

function openLPSSpecies(
    mold,
    species
) {

    saveState();

    currentMode = "collection";

    currentCategory = {

        mold: mold,

        species: species

    };

    currentPage = 0;

    currentPages =
        buildLPSCollection(
            currentCategory
        );

    jumpToPages();

}


/* =========================================
   LPS COLLECTION PAGES
   MAX 4 PETS / PAGE
========================================= */

function buildLPSCollection(category) {

    const pets =
        lpsCollection[
            category.mold
        ][
            category.species
        ];

    const pages = [];

    const petsPerPage = 4;


    for (
        let i = 0;
        i < pets.length;
        i += petsPerPage
    ) {

        pages.push({

            type: "lps",

            title:
                category.species,

            pets:
                pets.slice(
                    i,
                    i + petsPerPage
                )

        });

    }


    /*
        Empty collection.
    */

    if (pages.length === 0) {

        pages.push({

            type: "empty",

            title:
                category.species

        });

    }


    return pages;

}


/* =========================================
   MONSTER HIGH INDEX
========================================= */

function buildMHIndex() {

    const pages = [];

    const characters =
        Object.keys(
            monsterHighCollection
        );

    const entriesPerPage = 7;

    for (
        let i = 0;
        i < characters.length;
        i += entriesPerPage
    ) {

        const chunk =
            characters.slice(
                i,
                i + entriesPerPage
            );

        pages.push({

            type: "index",

            title:
                "Monster High",

            subtitle:
                "Character Catalogue",

            entries:
                chunk.map(
                    character => ({

                        name:
                            character,

                        count:
                            monsterHighCollection[
                                character
                            ].length,

                        action:
                            () =>
                                openMHCharacter(
                                    character
                                )

                    })
                )

        });

    }

    return pages;
}


/* =========================================
   OPEN MH CHARACTER
========================================= */

function openMHCharacter(character) {

    saveState();

    currentMode = "collection";

    currentCategory =
        character;

    currentPage = 0;

    currentPages =
        buildMHCollection(
            character
        );

    jumpToPages();

}


/* =========================================
   MONSTER HIGH COLLECTION
========================================= */

function buildMHCollection(character) {

    const dolls =
        monsterHighCollection[
            character
        ];

    return dolls.map(doll => ({

        type: "mh",

        character:
            character,

        doll:
            doll

    }));

}


/* =========================================
   RENDER PAGES
========================================= */

function renderPages() {

    /*
        Clear old content
    */

    leftContent.innerHTML = "";

    rightContent.innerHTML = "";


    /*
        Find current physical pages
    */

    const leftIndex =
        currentPage;

    const rightIndex =
        currentPage + 1;


    const left =
        currentPages[leftIndex];

    const right =
        currentPages[rightIndex];


    /*
        Render them
    */

    if (left) {

        renderPage(
            leftContent,
            left,
            leftIndex
        );

    }

    else {

        renderBlankPage(
            leftContent
        );

    }


    if (right) {

        renderPage(
            rightContent,
            right,
            rightIndex
        );

    }

    else {

        renderBlankPage(
            rightContent
        );

    }


    /*
        Page controls
    */

    updateControls();

}


/* =========================================
   RENDER SINGLE PAGE
========================================= */

function renderPage(
    container,
    page,
    pageIndex
) {

    container.innerHTML = "";


    /* INDEX */

    if (
        page.type === "index" ||
        page.type === "species"
    ) {

        const title =
            document.createElement("h1");

        title.className =
            "page-title";

        title.textContent =
            page.title;

        container.appendChild(title);


        if (page.subtitle) {

            const subtitle =
                document.createElement("p");

            subtitle.className =
                "page-subtitle";

            subtitle.textContent =
                page.subtitle;

            container.appendChild(
                subtitle
            );

        }


        const list =
            document.createElement("div");

        list.className =
            "index-list";


        page.entries.forEach(
            entry => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "index-entry";

                button.innerHTML = `

                    <span>
                        ${escapeHTML(entry.name)}
                    </span>

                    <span class="count">
                        ${entry.count}
                    </span>

                `;

                button.addEventListener(
                    "click",
                    entry.action
                );

                list.appendChild(
                    button
                );

            }
        );


        container.appendChild(
            list
        );

        addPageNumber(
            container,
            pageIndex
        );

        return;
    }


    /* LPS */

    if (page.type === "lps") {

        const title =
            document.createElement("h1");

        title.className =
            "page-title";

        title.textContent =
            page.title;

        container.appendChild(
            title
        );


        const subtitle =
            document.createElement("p");

        subtitle.className =
            "page-subtitle";

        subtitle.textContent =
            page.mold;

        container.appendChild(
            subtitle
        );


        const grid =
            document.createElement("div");

        grid.className =
            "lps-grid";

        grid.dataset.count =
            page.pets.length;


        page.pets.forEach(
            pet => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "pet-card";


                const image =
                    document.createElement(
                        "img"
                    );

                image.className =
                    "pet-image";

                image.src =
                    pet.image;

                image.alt =
                    `LPS ${pet.number}`;


                image.onerror =
                    function () {

                        this.src =
                            "https://placehold.co/600x600?text=Image+Unavailable";

                    };


                card.appendChild(
                    image
                );


                const info =
                    document.createElement(
                        "div"
                    );

                info.className =
                    "pet-info";


                info.innerHTML = `

                    <strong>
                        #${escapeHTML(pet.number)}
                    </strong>

                    <br>

                    <strong>Set:</strong>
                    ${escapeHTML(pet.set)}

                    <br>

                    <strong>Obtained:</strong>
                    ${escapeHTML(pet.obtained)}

                    <br>

                    <strong>Name:</strong>
                    ${escapeHTML(pet.customName)}

                    <br>

                    <strong>Condition:</strong>
                    ${escapeHTML(pet.condition)}

                    <br>

                    <strong>Lore:</strong>
                    ${escapeHTML(pet.Lore)}

                `;


                card.appendChild(
                    info
                );

                grid.appendChild(
                    card
                );

            }
        );


        container.appendChild(
            grid
        );

        addPageNumber(
            container,
            pageIndex
        );

        return;
    }


    /* MONSTER HIGH */

    if (page.type === "mh") {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "mh-doll";


        const image =
            document.createElement(
                "img"
            );

        image.className =
            "mh-image";

        image.src =
            page.doll.image;

        image.alt =
            page.character;


        image.onerror =
            function () {

                this.src =
                    "https://placehold.co/600x900?text=Image+Unavailable";

            };


        wrapper.appendChild(
            image
        );


        const details =
            document.createElement(
                "div"
            );

        details.className =
            "mh-details";


        details.innerHTML = `

            <h2>
                ${escapeHTML(page.character)}
            </h2>

            <p>
                <strong>Set:</strong>
                ${escapeHTML(page.doll.set)}
            </p>

            <p>
                <strong>Release Date:</strong>
                ${escapeHTML(page.doll.releaseDate)}
            </p>

            <p>
                <strong>Obtained Via:</strong>
                ${escapeHTML(page.doll.obtainedVia)}
            </p>

            <p>
                <strong>Wave:</strong>
                ${escapeHTML(page.doll.wave)}
            </p>

            <p>
                <strong>Condition:</strong>
                ${escapeHTML(page.doll.condition)}
            </p>

            <div class="extra-info">

                <strong>
                    Extra Info
                </strong>

                <br>

                ${escapeHTML(
                    page.doll.extraInfo
                )}

            </div>

        `;


        wrapper.appendChild(
            details
        );

        container.appendChild(
            wrapper
        );


        addPageNumber(
            container,
            pageIndex
        );

        return;
    }


    /* EMPTY */

    renderBlankPage(
        container
    );

}


/* =========================================
   BLANK PAGE
========================================= */

function renderBlankPage(
    container
) {

    container.innerHTML = `

        <div class="empty-page">

            <p>
                ✦
            </p>

        </div>

    `;

}


/* =========================================
   PAGE NUMBERS
========================================= */

function addPageNumber(
    container,
    pageIndex
) {

    const number =
        document.createElement(
            "span"
        );

    number.className =
        "page-number";

    number.textContent =
        pageIndex + 1;

    container.appendChild(
        number
    );

}


/* =========================================
   NEXT PAGE
========================================= */

function nextPage() {

    if (
        currentPage + 2 >= currentPages.length
    ) {
        return;
    }

    previousButton.disabled = true;
    nextButton.disabled = true;

    const flipPage =
        document.createElement("div");

    flipPage.className =
        "flip-page";

    book.appendChild(
        flipPage
    );

    void flipPage.offsetWidth;

    flipPage.classList.add(
        "flip-page-active"
    );

    setTimeout(() => {

        flipPage.remove();

        currentPage += 2;

        renderPages();

    }, 700);

}

/* =========================================
   PREVIOUS PAGE
========================================= */

function previousPage() {

    if (
        currentPage <= 0
    ) {
        return;
    }

    previousButton.disabled = true;
    nextButton.disabled = true;

    const flipPage =
        document.createElement("div");

    flipPage.className =
        "flip-page backward-flip";

    book.appendChild(
        flipPage
    );

    void flipPage.offsetWidth;

    flipPage.classList.add(
        "backward-flip-active"
    );

    setTimeout(() => {

        flipPage.remove();

        currentPage -= 2;

        renderPages();

    }, 700);

}


/* =========================================
   PAGE TURN ANIMATION
========================================= */

function animateTurn(
    direction
) {

    book.classList.remove(
        "turning",
        "turning-back"
    );




    void book.offsetWidth;


    if (
        direction === "forward"
    ) {

        book.classList.add(
            "turning"
        );

    }

    else {

        book.classList.add(
            "turning-back"
        );

    }


    setTimeout(
        () => {

            book.classList.remove(
                "turning",
                "turning-back"
            );

        },
        800
    );

}


/* =========================================
   SECTION JUMP PAGE FLIP
========================================= */

function jumpToPages() {

    previousButton.disabled = true;
    nextButton.disabled = true;



    const totalFlips = 1;

    let currentFlip = 0;



    book.classList.add("jumping");



    leftPage.classList.add("during-jump");
    rightPage.classList.add("during-jump");


    function flipNextPage() {



        const flipPage =
            document.createElement("div");

        flipPage.className =
            "flip-page";



        book.appendChild(flipPage);

        void flipPage.offsetWidth;

        flipPage.classList.add(
            "flip-page-active"
        );



        setTimeout(() => {

            flipPage.remove();

            currentFlip++;


            /*
                More pages to flip?
            */

            if (
                currentFlip < totalFlips
            ) {

                /*
                    Small pause between
                    individual page flips.
                */

                setTimeout(() => {

                    flipNextPage();

                }, 80);

                return;
            }


            leftPage.classList.remove(
                "during-jump"
            );

            rightPage.classList.remove(
                "during-jump"
            );

            book.classList.remove(
                "jumping"
            );


            renderPages();

            updateControls();


        }, 750);

    }



    flipNextPage();

}


/* =========================================
   CONTROLS
========================================= */

function updateControls() {

    previousButton.disabled =
        currentPage <= 0;


    nextButton.disabled =
        currentPage + 2 >=
        currentPages.length;




    const totalSpreads =
        Math.ceil(
            currentPages.length / 2
        );

    const currentSpread =
        Math.floor(
            currentPage / 2
        ) + 1;


    pageIndicator.textContent =
        `Spread ${currentSpread} / ${totalSpreads}`;

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !bookScreen.classList.contains(
                "active"
            )
        ) {

            return;

        }


        if (
            event.key === "ArrowRight"
        ) {

            nextPage();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            previousPage();

        }


        if (
            event.key === "Escape"
        ) {

            goBack();

        }

    }
);