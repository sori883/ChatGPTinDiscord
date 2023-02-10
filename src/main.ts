import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration: Configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client: Client<boolean> = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages
] });

client.once('ready', async () => {  
  // 開始ログ出力する
  console.log('ready!!');
});

client.on('messageCreate', async (message) => {
  // botの発言はスルー
  if (message.author.bot) return;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${message.content}`,
      max_tokens: 1024,
      stop: null,
      n: 1,
      temperature: 0.5,
    });

    if (completion.data.choices[0].text === undefined) throw new Error();
    await message.channel.send(completion.data.choices[0].text);
  } catch (err) {
    console.log(err);
  };
});

client.login(process.env.TOKEN);