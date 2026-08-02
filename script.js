document.addEventListener("DOMContentLoaded", () => {

    const projectsContainer =
        document.getElementById("projectsContainer");

    const projectCount =
        document.getElementById("projectCount");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const year =
        document.getElementById("year");


    // Current year

    year.textContent =
        new Date().getFullYear();


    // Load projects

    fetch("projects.json")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Could not load projects.json"
                );
            }

            return response.json();

        })

        .then(projects => {

            projectCount.textContent =
                projects.length;


            if (projects.length === 0) {

                emptyMessage.hidden = false;

                return;
            }


            projects.forEach((project, index) => {

                const card =
                    document.createElement("a");

                card.classList.add("project-card");

                card.href = project.url;


                card.innerHTML = `

                    <div>

                        <div class="project-number">
                            ${String(index + 1).padStart(2, "0")}
                            // ${project.category || "PROJECT"}
                        </div>

                        <div class="project-icon">
                            ${project.icon || "✦"}
                        </div>

                        <h3>
                            ${project.name}
                        </h3>

                        <p>
                            ${project.description}
                        </p>

                    </div>

                    <div class="project-arrow">
                        →
                    </div>

                `;


                projectsContainer.appendChild(card);

            });

        })

        .catch(error => {

            console.error(error);

            emptyMessage.hidden = false;

            emptyMessage.innerHTML = `
                <p>
                    Couldn't load the project directory.
                </p>
            `;

        });

});