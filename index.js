import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('IDNE Bot is running! Scan QR in logs.'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const WELCOME_MESSAGE = `*WELCOME TO THE IDNE FAMILY!* 💜

I'm so happy to have you here!

*WHAT WE DO:*
We are a community of bold believers learning to hear God and grow in faith. 🙏

*QUICK START:*
1️⃣  Tell us your name and where you're from
2️⃣  What are you trusting God for this season?
3️⃣  Stay active - we have prayers, teachings and prophetic moments daily!

*HOUSE RULES:*
Be kind, no spam, no DM without permission, respect everyone.

Again, WELCOME HOME! Your journey just started. 🚀
We love you! 💜

- Admin, I.D.N.E Community`;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if(qr) {
            console.log('---- SCAN THIS QR WITH WHATSAPP ----');
            qrcode.generate(qr, { small: true });
        }

        if(connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if(shouldReconnect) startBot();
        } else if(connection === 'open') {
            console.log('IDNE Bot is READY and connected!');
        }
    });

    sock.ev.on('group-participants.update', async (update) => {
        if(update.action === 'add') {
            await new Promise(r => setTimeout(r, 2000));
            await sock.sendMessage(update.id, { text: WELCOME_MESSAGE });
            console.log('Welcomed new members');
        }
    });
}

startBot();