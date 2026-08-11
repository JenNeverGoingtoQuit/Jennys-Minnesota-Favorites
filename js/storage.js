/*
    Module 04 Web Storage Functionality
    Jenny's Minnesota Favorites
    Jennifer Overvold

    This file supports:

    1. The Module 3 Plan a Visit form.
    2. The Module 4 My Favorites form and saved list.

    jQuery Mobile pagecreate events are used so the scripts run
    after each page and its controls have been initialized.
*/

/* =========================================================
   MODULE 3: PLAN A VISIT WEB STORAGE
========================================================= */

$(document).on("pagecreate", "#planner-page", function () {

    const tripForm = document.getElementById("trip-planner-form");
    const savedResults = document.getElementById("saved-results");
    const storageMessage = document.getElementById("storage-message");
    const clearButton = document.getElementById("clear-storage");

    if (!tripForm || !savedResults || !storageMessage || !clearButton) {
        return;
    }

    /*
        Converts entered values into safe text before displaying them.
    */
    function escapeTripHTML(value) {
        const temporaryElement = document.createElement("div");
        temporaryElement.textContent = value || "Not provided";
        return temporaryElement.innerHTML;
    }

    /*
        Reads and displays the saved trip plan.
    */
    function displaySavedPlan() {
        const savedPlanText =
            localStorage.getItem("minnesotaTripPlan");

        if (!savedPlanText) {
            savedResults.innerHTML =
                "<p>No trip-planning information has been saved yet.</p>";
            return;
        }

        try {
            const savedPlan = JSON.parse(savedPlanText);

            const savedInterests =
                savedPlan.interests &&
                savedPlan.interests.length > 0
                    ? savedPlan.interests.join(", ")
                    : "None selected";

            savedResults.innerHTML = `
                <p>
                    <strong>Name:</strong>
                    ${escapeTripHTML(savedPlan.name)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeTripHTML(savedPlan.email)}
                </p>

                <p>
                    <strong>Favorite Place:</strong>
                    ${escapeTripHTML(savedPlan.place)}
                </p>

                <p>
                    <strong>Preferred Activity:</strong>
                    ${escapeTripHTML(savedPlan.activity)}
                </p>

                <p>
                    <strong>Preferred Date:</strong>
                    ${escapeTripHTML(savedPlan.visitDate)}
                </p>

                <p>
                    <strong>Interests:</strong>
                    ${escapeTripHTML(savedInterests)}
                </p>

                <p>
                    <strong>Additional Notes:</strong>
                    ${escapeTripHTML(savedPlan.notes)}
                </p>
            `;
        } catch (error) {
            savedResults.innerHTML =
                "<p>The saved information could not be displayed.</p>";
        }
    }

    /*
        Saves the completed trip-planning form.
    */
    tripForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(tripForm);

        const tripPlan = {
            name: formData.get("visitorName") || "",
            email: formData.get("visitorEmail") || "",
            place: formData.get("favoritePlace") || "",
            activity: formData.get("preferredActivity") || "",
            visitDate: formData.get("visitDate") || "",
            interests: formData.getAll("interests"),
            notes: formData.get("additionalNotes") || ""
        };

        localStorage.setItem(
            "minnesotaTripPlan",
            JSON.stringify(tripPlan)
        );

        storageMessage.textContent =
            "Your Minnesota trip information was saved in Web Storage.";

        displaySavedPlan();
    });

    /*
        Removes the saved trip plan.
    */
    clearButton.addEventListener("click", function () {
        localStorage.removeItem("minnesotaTripPlan");

        tripForm.reset();

        storageMessage.textContent =
            "The saved trip information was removed.";

        displaySavedPlan();
    });

    displaySavedPlan();
});


/* =========================================================
   MODULE 4: FAVORITES LIST WEB STORAGE
========================================================= */

$(document).on("pagecreate", "#favorites-page", function () {

    const favoriteForm =
        document.getElementById("favorite-item-form");

    const favoritesList =
        document.getElementById("favorites-list");

    const favoriteMessage =
        document.getElementById("favorite-storage-message");

    const clearFavoritesButton =
        document.getElementById("clear-favorites");

    if (
        !favoriteForm ||
        !favoritesList ||
        !favoriteMessage ||
        !clearFavoritesButton
    ) {
        return;
    }

    /*
        Returns the saved favorites array.

        If no favorites exist, an empty array is returned.
    */
    function getFavorites() {
        const savedFavorites =
            localStorage.getItem("minnesotaFavorites");

        if (!savedFavorites) {
            return [];
        }

        try {
            const parsedFavorites = JSON.parse(savedFavorites);

            return Array.isArray(parsedFavorites)
                ? parsedFavorites
                : [];
        } catch (error) {
            return [];
        }
    }

    /*
        Saves the complete array of favorites in localStorage.
    */
    function saveFavorites(favorites) {
        localStorage.setItem(
            "minnesotaFavorites",
            JSON.stringify(favorites)
        );
    }

    /*
        Protects entered text before it is displayed on the page.
    */
    function escapeFavoriteHTML(value) {
        const temporaryElement =
            document.createElement("div");

        temporaryElement.textContent =
            value || "Not provided";

        return temporaryElement.innerHTML;
    }

    /*
        Refreshes the jQuery Mobile list only after the listview
        has been initialized.
    */
    function refreshFavoritesList() {
        const listElement = $("#favorites-list");

        if (listElement.hasClass("ui-listview")) {
            listElement.listview("refresh");
        } else {
            listElement.listview();
        }
    }

    /*
        Displays all favorites saved in localStorage.
    */
    function displayFavorites() {
        const favorites = getFavorites();

        favoritesList.innerHTML = "";

        if (favorites.length === 0) {
            const emptyItem = document.createElement("li");

            emptyItem.textContent =
                "No favorite items have been saved yet.";

            favoritesList.appendChild(emptyItem);

            refreshFavoritesList();
            return;
        }

        favorites.forEach(function (favorite, index) {

            const listItem = document.createElement("li");

            listItem.innerHTML = `
                <div class="favorite-item-content">

                    <h2>
                        ${escapeFavoriteHTML(favorite.name)}
                    </h2>

                    <p>
                        <strong>Category:</strong>
                        ${escapeFavoriteHTML(favorite.category)}
                    </p>

                    <p>
                        ${escapeFavoriteHTML(favorite.description)}
                    </p>

                </div>

                <a href="#"
                   class="remove-favorite"
                   data-index="${index}"
                   data-icon="delete">
                    Remove
                </a>
            `;

            favoritesList.appendChild(listItem);
        });

        refreshFavoritesList();
    }

    /*
        Saves a new favorite when the form is submitted.
    */
    favoriteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const favoriteName =
            document.getElementById("favorite-name").value.trim();

        const favoriteCategory =
            document.getElementById("favorite-category").value;

        const favoriteDescription =
            document.getElementById(
                "favorite-description"
            ).value.trim();

        if (
            favoriteName === "" ||
            favoriteCategory === "" ||
            favoriteDescription === ""
        ) {
            favoriteMessage.textContent =
                "Please complete every favorite item field.";

            return;
        }

        const favorites = getFavorites();

        const newFavorite = {
            name: favoriteName,
            category: favoriteCategory,
            description: favoriteDescription
        };

        favorites.push(newFavorite);

        saveFavorites(favorites);

        favoriteForm.reset();

        /*
            Refreshes the jQuery Mobile select menu after reset.
        */
        $("#favorite-category").selectmenu("refresh");

        favoriteMessage.textContent =
            "Your favorite item was saved in Web Storage.";

        displayFavorites();
    });

    /*
        Removes one favorite from the saved array.
    */
    favoritesList.addEventListener("click", function (event) {

        const removeLink =
            event.target.closest(".remove-favorite");

        if (!removeLink) {
            return;
        }

        event.preventDefault();

        const favoriteIndex =
            Number(removeLink.getAttribute("data-index"));

        const favorites = getFavorites();

        if (
            Number.isInteger(favoriteIndex) &&
            favoriteIndex >= 0 &&
            favoriteIndex < favorites.length
        ) {
            favorites.splice(favoriteIndex, 1);

            saveFavorites(favorites);

            favoriteMessage.textContent =
                "The selected favorite item was removed.";

            displayFavorites();
        }
    });

    /*
        Clears the complete favorites list.
    */
    clearFavoritesButton.addEventListener("click", function () {

        localStorage.removeItem("minnesotaFavorites");

        favoriteMessage.textContent =
            "All favorite items were removed.";

        displayFavorites();
    });

    /*
        Displays previously saved favorites when the page opens.
    */
    displayFavorites();
});