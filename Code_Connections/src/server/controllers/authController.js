const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

require('dotenv').config(); // Ensure .env is loaded

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } = process.env;

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

console.log("DISCORD_CLIENT_ID:", DISCORD_CLIENT_ID); // Debugging
console.log("DISCORD_REDIRECT_URI:", DISCORD_REDIRECT_URI); // Debugging


exports.discordLogin = (req, res) => {
    const redirectUri = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email`;
    res.redirect(redirectUri);
};

exports.discordCallback = async (req, res) => {
    const code = req.query.code;

    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: DISCORD_REDIRECT_URI,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // Step 2: Get user info from Discord
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const discordUser = userResponse.data;

        // Step 3: Create Firebase Custom Token
        const firebaseToken = await admin.auth().createCustomToken(discordUser.id, {
            email: discordUser.email,
            username: discordUser.username,
        });

        // Step 4: Redirect to frontend with Firebase token
        res.redirect(`http://localhost:5173/login?token=${firebaseToken}`);
    } catch (error) {
        console.error('Discord OAuth Error:', error);
        res.status(500).send('Authentication Failed');
    }
};
