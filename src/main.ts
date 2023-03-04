import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { character } from 'roleplay/character';

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
  console.log('ready!!');
});

client.on('messageCreate', async (message) => {
  // botの発言はスルー
  if (message.author.bot) return;
  
  // メンション以外はスルー
  if (!message.mentions.users.has(client.user?.id || '')) {
    return
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages:[
        {'role': 'system', 'content': character},
        {'role': 'user', 'content': message.content.trim()},
      ],
      max_tokens: 1024,
      n: 1,
      temperature: 0.5,
    });

    if (completion.data.choices[0].message?.content === undefined) throw new Error();
    await message.reply(completion.data.choices[0].message?.content);
  } catch (err) {
    console.log(err);
  };
});

client.login(process.env.TOKEN);