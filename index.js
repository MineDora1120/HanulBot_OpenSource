const { createAudioResource, AudioPlayerError, AudioPlayerStatus } = require('@discordjs/voice');
const { Routes, Client, GatewayIntentBits, Collection, EmbedBuilder, ActivityType, Partials } = require('discord.js');
const { REST } = require('@discordjs/rest');
const client = new Client({ intents: [GatewayIntentBits.GuildIntegrations, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], partials: [Partials.Channel, Partials.Message ]});
client.commands = new Collection();
const token = "";
const ytdl = require("ytdl-core");
const queue = new Map();
const fs = require("fs");

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(line) {
    if(line == "queue") return console.log(queue);
    if(line == "exit") return process.exit(0);
})


 process.on('uncaughtException', error => {
   if(client.user.tag  == "MD BOT Dev#0490") return console.error(error);
   console.log(`오류가 발생했어요.\n ${error}`)
 })

 process.on('unhandledRejection', error => {
   if(client.user.tag == "MD BOT Dev#0490") return console.error(error);
   console.log(`오류가 발생했어요.\n ${error}`)
 })
client.on('ready', () => {

    const slashData = [];
    const commandFiles = fs.readdirSync('./commands')
    
    for (const file of commandFiles) { 
        try {
          const command = require(`./commands/${file}`);
          client.commands.set(command.name, `./commands/${file}`);
          slashData.push(command.slash)
          console.log(`${file} - ✅`)
        } catch (error) {
            console.log(`${file} - ❌`)
        }
    }
    
    const rest = new REST({ version: '10' }).setToken(token);
    
    (async () => {
        try {
        console.log("❗| 커맨드 등록이 진행중이에요.")
    
        if(client.user.tag == 'MD BOT Dev#0490') {
            await rest.put(
                Routes.applicationGuildCommands('680034864333848593', '937707674471133265'),
                { body: slashData },
            );
        } else {
          await rest.put(
            Routes.applicationCommands('952195219003174922'),
            { body: slashData },
          );
        }
        console.log('🔨| '+ slashData.length + '개의 커맨드가 등록되었어요!')
      //  require('./commands/made').MDload('code')
        
        } catch (error) {
            console.log("❎| 커맨드 등록에 실패했어요.")
            console.error(error);
        }
    })();

    console.log(`📶| ${client.user.tag}로 봇이 시작되었어요!`)
    if(client.user.tag == 'MD BOT Dev#0490') console.log("⚠️ | 디버그 모드가 활성화 되었어요. 오류 발생시 ReStarter(이)가 실행되지 않도록 변경되었어요.")
    client.user.setActivity("안녕하세요!", { type: ActivityType.Streaming });
})

client.on('interactionCreate', async (interaction) => {
    if (!client.commands.has(interaction.commandName)) return;
    try {
        return require(client.commands.get(interaction.commandName)).execute(client , interaction, queue)
    } catch (error) {
      if(client.user.tag == "MD BOT Dev#0490") return console.error(error);
        console.log(`오류가 발생했어요.\n ${error}`)
        }
})
client.login(token);

exports.playing = function(url, connection, interaction) {
    //console.log(queue.get(interaction.guild.id))
    const resource = createAudioResource(ytdl(url, {filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), {highWaterMark: 1})
    const player = queue.get(interaction.guild.id).player
    player.play(resource)
    player.on('error', (error) => {
        console.error(error);
        const err = new EmbedBuilder() 
        err.setColor("#d9534f")
        err.setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
        err.setTitle("재생 오류")
        if(queue.get(interaction.guild.id).name.length == 1) {
            err.setDescription("재생 오류가 발생하여 음악이 중지됬어요.")
            queue.delete()
        } else {
            err.setDescription("재생 오류가 발생하여 다음 노래를 재생할게요.")
            player.stop()
            require('./index').playing(queue.get(interaction.guild.id).url[0], connection, interaction)
        }
        err.setTimestamp()
  
        interaction.channel.send({ embeds : [err] })
    })
    player.on(AudioPlayerStatus.Idle, () => {
        if(queue.get(interaction.guild.id).repeat[0] == "off") {
            queue.get(interaction.guild.id).url.shift()
            queue.get(interaction.guild.id).name.shift()
            queue.get(interaction.guild.id).thumbnail.shift()
        } else {
            queue.get(interaction.guild.id).url.push(queue.get(interaction.guild.id).url[0])
            queue.get(interaction.guild.id).name.push(queue.get(interaction.guild.id).name[0])
            queue.get(interaction.guild.id).thumbnail.push(queue.get(interaction.guild.id).thumbnail[0])

            queue.get(interaction.guild.id).url.shift()
            queue.get(interaction.guild.id).name.shift()
            queue.get(interaction.guild.id).thumbnail.shift()
        }
        if(queue.get(interaction.guild.id).name.length > 1) {
            return require('./index').playing(queue.get(interaction.guild.id).url[0], connection, interaction)
        } else {
            const end = new EmbedBuilder()
            .setColor("#13ad65")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setDescription("모든 음악의 재생이 멈췄어요.")
            .setTimestamp()

            interaction.channel.send({ embeds : [end] })
            queue.delete(interaction.guild.id)
            player.stop()
            return connection.destroy();
        }
    })
}
