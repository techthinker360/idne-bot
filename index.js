const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('SCAN THIS QR WITH YOUR WHATSAPP');
});

client.on('ready', () => {
    console.log('IDNE Bot is READY and connected!');
});

client.on('group_join', async (notification) => {
    try {
        const chat = await notification.getChat();
        if (!chat.isGroup) return;

        for (let memberId of notification.recipientIds) {
            try {
                const contact = await client.getContactById(memberId);
                const welcomeText = `Welcome @${contact.id.user} to *I DID NOT EVOLVE APOLOGETICS (I.D.N.E.)* 🎯\n\nWe defend the Christian faith using science, logic, and Scripture.\n\n📌 Please read our Group Rules in the description and follow with all our engagements.\n\nThank you for joining us!`;

                await chat.sendMessage(welcomeText, { mentions: [contact] });
                console.log('Welcomed:', contact.id.user);
            } catch (err) {
                console.log('Error welcoming one user:', err.message);
            }
        }
    } catch (e) {
        console.log('group_join error:', e.message);
    }
});

client.initialize().catch(err => {
    console.log('Initialize error:', err.message);
});