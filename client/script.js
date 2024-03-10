window.addEventListener('DOMContentLoaded', async () => {
    const playlistNameElement = document.getElementById('playlistName');
    const genreDropdown = document.getElementById('genreDropdown');
    const extraInstructionInput = document.getElementById('extraInstruction');
    const generateButton = document.getElementById('generateButton');
    const chatHistoryElement = document.getElementById('chatHistory'); // Voeg de chatgeschiedenis div toe

    generateButton.addEventListener('click', async () => {
        try {
            // Deactiveer de generatieknop om meerdere aanvragen te voorkomen
            generateButton.disabled = true;
            generateButton.textContent = 'Laden...'; // Verander de tekst van de knop naar 'Laden'

            const genreName = getGenreNameById(genreDropdown.value);
            const extraInstruction = extraInstructionInput.value;
            console.log('Geselecteerd genre:', genreName);
            console.log('Extra instructie:', extraInstruction);
            const response = await fetch(`/playlistname?genre=${encodeURIComponent(genreName)}&instruction=${encodeURIComponent(extraInstruction)}`);
            const data = await response.json();
            const playlistName = data.playlistName;
            playlistNameElement.textContent = `Playlist naam: ${playlistName}`;

            // Voeg de gegenereerde playlistnaam toe aan de chatgeschiedenis
            addToChatHistory(`Playlist naam: ${playlistName}`);
        } catch (error) {
            console.error('Er is een fout opgetreden bij het genereren van de playlistnaam:', error);
        } finally {
            // Activeer de generatieknop na het ontvangen van het antwoord van de server
            generateButton.disabled = false;
            generateButton.textContent = 'Genereer playlistnaam'; // Verander de tekst van de knop terug naar 'Genereer playlistnaam'
        }
    });

    function getGenreNameById(genreId) {
        const genres = genreDropdown.options;
        for (let i = 0; i < genres.length; i++) {
            if (genres[i].value === genreId) {
                return genres[i].textContent;
            }
        }
        return null;
    }

    // Functie om de chatgeschiedenis op te halen uit localStorage
    function getChatHistory() {
        const chatHistory = localStorage.getItem('chatHistory');
        return chatHistory ? JSON.parse(chatHistory) : []; // Zorg ervoor dat er altijd een array wordt geretourneerd
    }

    // Functie om de chatgeschiedenis weer te geven in het chatgeschiedenis element
    function displayChatHistory() {
        const chatHistory = getChatHistory();
        chatHistoryElement.innerHTML = ''; // Clear existing content

        if (Array.isArray(chatHistory)) { // Controleer of het een array is voordat we forEach gebruiken
            chatHistory.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.textContent = message;
                chatHistoryElement.appendChild(messageElement);
            });
        }
    }

    // Functie om een bericht toe te voegen aan de chatgeschiedenis en deze op te slaan in localStorage
    function addToChatHistory(message) {
        let chatHistory = getChatHistory(); // Haal de chatgeschiedenis op

        if (!Array.isArray(chatHistory)) { // Controleer of de chatgeschiedenis een array is
            chatHistory = []; // Als het geen array is, maak dan een nieuwe array
        }

        chatHistory.push(message); // Voeg het bericht toe aan de chatgeschiedenis
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory)); // Sla de chatgeschiedenis op in localStorage
        displayChatHistory(); // Update de weergave van de chatgeschiedenis
    }

    // Roep de functie aan om de chatgeschiedenis weer te geven wanneer de pagina geladen is
    displayChatHistory();

    // Event listener voor de knop om de chatgeschiedenis te verwijderen
    const clearHistoryButton = document.getElementById('clearHistoryButton');

    clearHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('chatHistory'); // Verwijder de chatgeschiedenis uit de lokale opslag
        displayChatHistory(); // Leeg de chatgeschiedenis op de pagina
    });
});



window.addEventListener('DOMContentLoaded', async () => {
    // Functie om de access token uit de cookie te halen
    function getAccessToken() {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'accessToken') {
                return value;
            }
        }
        return null;
    }

    // Functie om genres op te halen van de Spotify API
    async function fetchGenres() {
        const accessToken = getAccessToken();
        if (!accessToken) {
            console.error('Access token not found in cookie.');
            return;
        }

        try {
            const response = await fetch('https://api.spotify.com/v1/browse/categories', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            return data.categories.items;
        } catch (error) {
            console.error('Error fetching genres:', error);
            return null;
        }
    }

    // Functie om de dropdown op te bouwen met de opgehaalde genres
    async function buildDropdown() {
        const genres = await fetchGenres();
        if (!genres) {
            console.error('Failed to fetch genres.');
            return;
        }

        const dropdown = document.getElementById('genreDropdown');
        dropdown.innerHTML = ''; // Clear existing options

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            dropdown.appendChild(option);
        });
    }

    // Roep de functie aan om de dropdown op te bouwen wanneer de pagina geladen is
    buildDropdown();

    // Sla de geselecteerde genre op in een globale variabele
    let selectedGenre = '';

    // Event listener voor veranderingen in de dropdown
    const dropdown = document.getElementById('genreDropdown');
    dropdown.addEventListener('change', function() {
        selectedGenre = dropdown.value;
        console.log('Geselecteerd genre:', selectedGenre);
    });

    // Wijs de variabele toe aan het window object zodat het toegankelijk is buiten deze scope
    window.selectedGenre = selectedGenre;
});