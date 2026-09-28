const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

const WELCOME_MESSAGE = `*WELCOME TO THE IDNE Apologetics!* 💜
We're glad to have you as part of the team!🎯

Please read through the group description and ensure you follow up with all our engagements.😇

Thank you for joining us!🎯- Admin, I.D.N.E Apologetics Media Team.`;

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
                console.log(`Welcomed in group: ${chat.name}`);
            }, 2000);
        }
    } catch (e) {
        console.log('Welcome error:', e.message);
    }
});

client.initialize();