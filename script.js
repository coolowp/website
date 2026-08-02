document.addEventListener("DOMContentLoaded", async () => {

    const projectsContainer =
        document.getElementById("projectsContainer");

    const projectCount =
        document.getElementById("projectCount");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const year =
        document.getElementById("year");


    // Set current year
    if (year) {
        year.textContent = new Date().getFullYear();
    }


    try {

        console.log("Loading projects.json...");

        const response = await fetch("./projects.json");

        console.log("Response:", response);


        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
            );
        }


        const projects = await response.json();

        console.log("Projects loaded:", projects);


        // Make sure the JSON contains an array
        if (!Array.isArray(projects)) {
            throw new Error(
                "projects.json must contain an array of projects."
            );
        }


        // Update project count
        if (projectCount) {
            projectCount.textContent = projects.length;
        }


        // No projects
        if (projects.length === 0) {

            if (emptyMessage) {
                emptyMessage.hidden = false;
                emptyMessage.innerHTML = `
                    <p>
                        No projects have been added yet.
                    </p>
                `;
            }

            return;
        }


        // Create project cards
        projects.forEach((project, index) => {

            const card =
                document.createElement("a");


            card.className = "project-card";


            // Project URL
            card.href = project.url;


            // Make sure the link works normally
            card.target = "_self";


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
                        ${project.name || "Unnamed Project"}
                    </h3>

                    <p>
                        ${project.description || ""}
                    </p>

                </div>

                <div class="project-arrow">
                    →
                </div>

            `;


            projectsContainer.appendChild(card);

        });


        console.log(
            `Successfully loaded ${projects.length} projects.`
        );

    }


    catch (error) {

        console.error(
            "PROJECT DIRECTORY ERROR:",
            error
        );


        if (emptyMessage) {

            emptyMessage.hidden = false;

            emptyMessage.innerHTML = `

                <p>
                    Couldn't load the project directory.
                </p>

                <small>
                    Check the browser console for details.
                </small>

            `;

        }

    }

});