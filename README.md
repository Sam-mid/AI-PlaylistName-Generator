Playlist Name Generator
Dit is een webapplicatie waarmee je automatisch namen voor afspeellijsten kunt genereren op basis van verschillende genres. Het maakt gebruik van kunstmatige intelligentie (AI) om playlist te bedenken.

Inhoudsopgave
Installatie
Gebruik
Bijdragen
Licentie
Installatie
Kloon deze repository naar je lokale machine:
bash
Copy code
git clone https://github.com/jouw-gebruikersnaam/playlist-name-generator.git
Navigeer naar de projectmap:
bash
Copy code
cd playlist-name-generator
Installeer de benodigde afhankelijkheden met behulp van npm:
Copy code
npm install
Maak een .env-bestand aan in de hoofdmap van het project en voeg de volgende variabelen toe:
makefile
Copy code
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
OPENAI_API_VERSION=your_openai_api_version
INSTANCE_NAME=your_instance_name
ENGINE_NAME=your_engine_name
PORT=3000
Gebruik
Start de server met het volgende commando:
sql
Copy code
npm start
Open een webbrowser en ga naar http://localhost:3000 om de applicatie te gebruiken.

Selecteer een genre voor de afspeellijst en klik op "Generate" om een afspeellijstnaam te genereren.

Bijdragen
Bijdragen aan dit project zijn welkom! Als je een bug vindt of een verbetering wilt voorstellen, kun je een issue aanmaken of een pull-verzoek indienen.

Licentie
Dit project is gelicentieerd onder de MIT-licentie.
