import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import axios from 'axios'; // Importeer de axios module voor het maken van HTTP-verzoeken
import querystring from 'querystring'; // Importeer de querystring module om queryparameters te formatteren
import { ChatOpenAI } from "@langchain/openai";


const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());

// Endpoint om de chatgeschiedenis van de client op te halen
app.get('/chathistory', (req, res) => {
    try {
        const chatHistory = req.query.chatHistory;
        res.json({ chatHistory });
    } catch (error) {
        console.error("Er is een fout opgetreden:", error);
        res.status(500).json({ error: "Er is een fout opgetreden bij het ophalen van de chatgeschiedenis." });
    }
});

// Endpoint voor het ophalen van een playlistnaam
app.get('/playlistname', async (req, res) => {
    try {
        const genre = req.query.genre; // Haal het geselecteerde genre op uit de query parameters
        const extraInstruction = req.query.instruction || ""; // Haal de extra instructie op uit de query parameters, standaard leeg als niet opgegeven
        const chatHistory = req.query.chatHistory || []; // Haal de chatgeschiedenis op uit de query parameters, standaard leeg als niet opgegeven

        const playlistName = await model.invoke(
            `Je bent een robot met als enige taak een naam te verzinnen voor een playlist. De playlist heeft het genre: ${genre}.
            Extra instructies: zorg ervoor dat je niets meer dan alleen de naam verteld en maar een antwoord per keer. 
            De naam van het genre hoeft niet verplicht in de naam van de playlist te zitten. Ook wil ik dat je niet twee keer hetzelfde genereerd. 
            Een instructie die de gebruiker invoert (Dit moet direct of indirect verwerkt zijn in de naam): ${extraInstruction}. 
            Voorbeeld antwoord voor een pop playlist: "pop heaven"`);

        console.log(playlistName.content);
        res.json({ playlistName: playlistName.content, chatHistory }); // Stuur de playlistnaam en chatgeschiedenis als JSON-object terug
    } catch (error) {
        console.error("Er is een fout opgetreden:", error);
        res.status(500).json({ error: "Er is een fout opgetreden bij het ophalen van de playlistnaam." });
    }
});



// Autorisatie endpoint
app.get('/login', (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(`https://${req.headers.host}/callback`);
    const scope = 'user-read-private user-read-email'; // Voeg hier de gewenste scopes toe
    const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    res.redirect(authorizationUrl);
});

// Definieer een variabele om de access token op te slaan
let accessToken = '';

// Endpoint voor de callback
app.get('/callback', (req, res) => {
    const { code } = req.query;
    const redirect_uri = `https://${req.headers.host}/callback`;

    if (!code) {
        res.status(400).json({ error: 'Authorization code is missing.' });
        return;
    }

    // Verwerk de ontvangen autorisatiecode
    // Maak een POST-verzoek om de autorisatiecode in te wisselen voor een toegangstoken
    axios.post('https://accounts.spotify.com/api/token',
        querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            }
        }
    )
        .then(response => {
            // Verwerk de succesvolle respons van het inwisselen van de autorisatiecode
            const accessToken = response.data.access_token;

            // Sla de access token op in een cookie of localStorage
            res.cookie('accessToken', accessToken); // Of gebruik localStorage.setItem('accessToken', accessToken);

            // Stuur de gebruiker terug naar de startpagina van de applicatie
            res.redirect('/');
        })
        .catch(error => {
            // Verwerk eventuele fouten bij het inwisselen van de autorisatiecode
            console.error("Er is een fout opgetreden bij het inwisselen van de autorisatiecode:", error.response.data);
            res.status(500).json({ error: "Er is een fout opgetreden bij het inwisselen van de autorisatiecode." });
        });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is gestart op poort ${PORT}`);
});

