const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { NameSearch, UrlAnalyze, PlaylistAnalyze } = require('../../scripts/search');
const { musicEmbed } = require('../../function/embed');

module.exports = {
    name : "재생",
    slash : new SlashCommandBuilder().setName("재생").setDescription("검색된 음악을 음성채널에 재생해요.").addStringOption(option => option.setName('검색어').setDescription('검색할 내용을 입력해주세요!').setRequired(true)),
    async execute(client, interaction, queue) {
        let userSeachInput = interaction.options.getString("검색어")
        if(!interaction.member.voice.channel) return interaction.editReply({ content : "**🎵 음성채널에 입장해주세요!**"});
        
        if(!queue.get(interaction.guild.id)) {
            var songqueue = {
                    url : [],
                    name : [],
                    thumbnail : [],
                    id : [],
                    repeat : "off",
                    Mixing : "off",
                    stop : false,
                    player : createAudioPlayer(),
                    connection : joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator
                    })
                }
            queue.set(interaction.guild.id, songqueue)
            queue.get(interaction.guild.id).connection.subscribe(songqueue.player)
        }
            if(String(userSeachInput).includes('https://youtube.com/playlist?list')) {

                if(!await PlaylistAnalyze(String(userSeachInput).replace('https://youtube.com/playlist?list=',''), queue, interaction)) {

                    interaction.editReply("**❌ __검색에 실패했어요.__**");
                    if(!queue.get(interaction.guild.id)) return;
                    queue.get(interaction.guild.id).connection.destroy();
                    return queue.delete(interaction.guild.id);

                }

                var songqueue = queue.get(interaction.guild.id), len = songqueue.name.length-1, playlistDB = queue.get(interaction.guild.id + "playlist");

                await musicEmbed(":musical_note: [𝓹𝓵𝓪𝔂𝓵𝓲𝓼𝓽] **"+ playlistDB.title +"**", playlistDB.thumbnail, userSeachInput, interaction, client)
                if(len == playlistDB.len-1) require("../../function/player").playing(songqueue.url[0], songqueue.connection, interaction, client, queue); //여기에 데이터 삽입

            } else {
                if(String(userSeachInput).includes("https://")) if(await UrlAnalyze(userSeachInput) != false) userSeachInput = await UrlAnalyze(userSeachInput)
                
                if(!await NameSearch(userSeachInput, queue, interaction)) {
                    interaction.editReply("**❌ __검색에 실패했어요.__**");
                    if(!queue.get(interaction.guild.id)) return;
                    queue.get(interaction.guild.id).connection.destroy();
                    return queue.delete(interaction.guild.id);
                }

                var songqueue = queue.get(interaction.guild.id), len = songqueue.name.length-1;

                await musicEmbed("** :musical_note: "+ songqueue.name[len] +"**", songqueue.thumbnail[len] , songqueue.url[len], interaction, client)
                if(len == 0) require("../../function/player").playing(songqueue.url[0], songqueue.connection, interaction, client, queue);    
            }

            // interaction.editReply("**⚠️ __기술 문제가 발생했어요. 나중에 다시 시도해주세요.__**")
            // console.log(error);
            // if(!queue.get(interaction.guild.id)) return;
            // queue.get(interaction.guild.id).connection.destroy();
            // return queue.delete(interaction.guild.id);
        
    }
}

