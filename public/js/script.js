document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".task-container");
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

    document.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("task")) {
            e.target.classList.add("dragging");
        }
    });

    document.addEventListener("dragend", (e) => {
        if (e.target.classList.contains("task")) {
            e.target.classList.remove("dragging");
        }
    });

    containers.forEach((container) => {
        container.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        container.addEventListener("drop", async (e) => {
            e.preventDefault();
            
            const dragged = document.querySelector(".dragging");
            if (!dragged) return;

            const newStatus = container.getAttribute("data-status"); // Get new status
            const taskId = dragged.getAttribute("data-id");

            // Move the dragged task to the new column
            container.appendChild(dragged);

            console.log(`Task ${taskId} dropped in ${newStatus}`);

            // Update the task status in the database
            try {
                const response = await fetch("/update", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "CSRF-Token": csrfToken // ✅ Include CSRF token
                    },
                    body: JSON.stringify({ id: taskId, status: newStatus }),
                });

                if (!response.ok) {
                    console.error("Failed to update task in the database");
                } else {
                    console.log(`Task ${taskId} successfully updated in DB`);
                }
            } catch (error) {
                console.error("Error updating task:", error);
            }
        });
    });
});
