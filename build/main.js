"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
dotenv_1.default.config();
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const client = new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMessages
    ] });
client.once('ready', async () => {
    // 開始ログ出力する
    console.log('ready!!');
});
client.on('messageCreate', async (message) => {
    // botの発言はスルー
    if (message.author.bot)
        return;
    try {
        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${message.content}`,
            max_tokens: 1024,
            stop: null,
            n: 1,
            temperature: 0.5,
        });
        if (completion.data.choices[0].text === undefined)
            throw new Error();
        await message.channel.send(completion.data.choices[0].text);
    }
    catch (err) {
        console.log(err);
    }
    ;
});
client.login(process.env.TOKEN);
