const { Telegraf } = require("telegraf");
const TOKEN = "6780346772:AAFAytjxoo7HA9kAKWeSMIggqP8g6xv6KaA";
const bot = new Telegraf(TOKEN);

const web_link = "https://celebrated-torte-184681.netlify.app/";

bot.start((ctx) =>
  ctx.reply("Welcome :)))))", {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
    },
  })
);

bot.launch();
