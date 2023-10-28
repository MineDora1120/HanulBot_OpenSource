
const { Client, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.GuildIntegrations, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], partials: [Partials.Channel, Partials.Message ]});
client.commands = new Collection();

const token = ""; //이곳에 토큰을 입력해주세요.

const queue = new Map();
process.on('uncaughtException', error => {
  return console.error(error);
})

process.on('unhandledRejection', error => {
    return console.error(error);
})

client.on('ready', () => {
    require('./scripts/RegisterCommand').collection(client, client.commands, token)

    console.log(`📶| ${client.user.tag}로 봇이 시작되었어요!`)
    client.user.setActivity("Github_Mado", { type: ActivityType.Watching });
})

client.on('interactionCreate', (interaction) => {
    if (!client.commands.has(interaction.commandName)) return;
    try {
        interaction.deferReply().then(() => {
            if(String(client.commands.get(interaction.commandName)).includes("music")) return require(client.commands.get(interaction.commandName)).execute(client , interaction, queue)
            else return require(client.commands.get(interaction.commandName)).execute(client , interaction)
        })
    } catch (error) {
      interaction.editReply("문제가 발생했어요! 나중에 다시 시도해주세요!");
      return console.error(error)
    }
})
client.login(token);
