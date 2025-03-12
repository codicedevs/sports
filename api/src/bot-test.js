const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'local-auth'
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async (message) => {
    console.log(message.body);
});

client.on('message_create', message => {
    if (message.body === '!ping') {
        client.sendMessage(message.from, 'pong');
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message', async (msg) => {
    if (msg.hasMedia) {
        await msg.downloadMedia();
    }
});

client.initialize();