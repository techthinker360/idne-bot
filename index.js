const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');

// Find chrome wherever it is
let chromePath = '/opt/render/project/src/.cache/chrome/linux-127.0.6533.88/chrome-linux64/chrome';
if (fs.existsSync('/opt/render/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome')) {
    chromePath = '/opt/render/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome';
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || chromePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
    }
});

const WELCOME_MESSAGE = `*WELCOME TO I DID NOT EVOLVE APOLOGETICS!* 💜
We're glad to have you as part of the team!🎯

Please read the group description and make sure you follow up on all our engagements.😇

Thank you for joining us!🎯

* Admin, Relations Department | I.D.N.E Apologetics.`;

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('QR RECEIVED - Scan it!');
});

client.on('ready', () => {
    console.log('IDNE Bot is READY and connected!');
});

client.on('group_join', async (notification) => {
    try {
        const chat = await notification.getChat();
        if (chat.isGroup) {
            setTimeout(async () => {
                await chat.sendMessage(WELCOME_MESSAGE);
            }, 2000);
        }
    } catch (e) {
        console.log('Welcome error:', e.message);
    }
});

client.initialize();