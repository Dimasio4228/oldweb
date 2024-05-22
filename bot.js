const { Telegraf } = require("telegraf");
const express = require('express');
const TOKEN = "6780346772:AAFAytjxoo7HA9kAKWeSMIggqP8g6xv6KaA";
const bot = new Telegraf(TOKEN);

const web_link =  "https://melodious-elf-1865fd.netlify.app/";
const app = express();
const PORT = process.env.PORT || 3001;


bot.start((ctx) =>
  ctx.reply("Welcome :)))))", {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
    },
  })

);
let chatId;
let username;
let userid;
bot.on('message', async msg => {

      chatId = msg.chat.id;
        username=msg.from.username;
       userid=msg.from.id;})
app.post('/notify-bot', (req, res) => {
    bot.telegram.sendMessage(chatId, 'Button clicked on the web app!');
    res.json({ message: 'Notification sent.' });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
bot.launch();
