const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("URL manquante.");

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        let html = await response.text();

        // Supprime les headers de sécurité dans le HTML
        html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');
        html = html.replace(/x-frame-options[^;\n]*/gi, '');
        html = html.replace(/content-security-policy[^;\n]*/gi, '');

        res.send(html);
    } catch (e) {
        res.status(500).send(`Erreur lors du chargement : ${e.message}`);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy lancé sur le port ${port}`));
