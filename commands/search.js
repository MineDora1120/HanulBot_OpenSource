const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const PlaylistSummary = require('youtube-playlist-summary');
const yts = require('yt-search');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = {
    GOOGLE_API_KEY: 'AIzaSyCNnMvLcoWfHhnsIXF2LtIBHYpJylhv7iY', // require
    PLAYLIST_ITEM_KEY: ['title', 'videoUrl'], // option
  }
const ps = new PlaylistSummary(config)

module.exports = {
    name : "재생",
    slash : new SlashCommandBuilder().setName("재생").setDescription("검색된 음악을 음성채널에 재생해요.").addStringOption(option => option.setName('검색어').setDescription('검색할 내용을 입력해주세요!').setRequired(true)),
    async execute(client, interaction, queue) {
        interaction.deferReply()
        sleep(1000);
        let userInput = interaction.options.getString("검색어")
        if(!interaction.member.voice.channel) {
            const embed = new EmbedBuilder()
            .setColor("#d9534f")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setDescription("먼저, 음성 채널에 입장해 주세요!")
            .setTimestamp();
    
            return interaction.editReply({ embeds : [embed] });
        }
        if(String(userInput).includes('https://youtube.com/playlist?list')) {
            ps.getPlaylistItems(String(userInput).replace('https://youtube.com/playlist?list=','')).then((result) => {
                const play = new EmbedBuilder()
                play.setURL(`${encodeURI(userInput)}`)
                play.setTitle("**"+result?.playlistTitle+"**")
                play.setColor("#13ad65")
                play.setImage(`https://img.youtube.com/vi/${result.items[0].videoId}/mqdefault.jpg`)
                play.addFields(
                   { name:'**제작**',value:`[${result?.channelTitle}](${result?.channelUrl})`,inline:true},
                   { name:'**수록된 곡**',value:`${result?.total}`, inline:true}
               )
                play.setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
                play.setTimestamp()    
            if(!queue.get(interaction.guild.id)) {
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                    });
                    var songqueue = {
                        url : [],
                        name : [],
                        thumbnail : [],
                        repeat : ["off"],
                        player : createAudioPlayer(),
                        connection : connection
                    }
                    connection.subscribe(songqueue.player)
                    queue.set(interaction.guild.id, songqueue)
                    require("../index.js").playing(result.items[0].videoUrl, connection, interaction); //여기에 데이터 삽입
                    play.setDescription("재셍목록을 재생할게요!")
                } else {
                    var songqueue = queue.get(interaction.guild.id);
                    play.setDescription("재생목록을 대기열에 추가했어요!")
                }
                for(var database of Object.values(result.items)) {
                    songqueue.url.push(database.videoUrl)
                    songqueue.name.push(database.title)
                    songqueue.thumbnail.push(`https://img.youtube.com/vi/${database.videoId}/mqdefault.jpg`) 
                    }
                interaction.editReply({ embeds : [play] });

        }).catch((error) => {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setTitle("문제가 발생했어요.")
            .setDescription("알 수 없는 문제가 발생하여 추가할 수 없었어요. 다른 링크로 시도해주세요!")
            .setTimestamp();

            console.error(error)
            return interaction.editReply({ embeds : [embed] });
          })
        } else {
            const search = await yts(userInput)
            if(String(search.all[0]).length <= 3) {
                const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle("검색 실패")
                .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
                .setDescription("검색에 실패했어요. 다음에 다시 시도해주세요!")
                .setTimestamp();
        
                return interaction.editReply({ embeds : [embed] });
            } else {
                const videos = search.videos.slice( 0, 1 )
                    videos.forEach(async function(v){
                        const views = String(v.views).padStart(10, '')
                        const play = new EmbedBuilder()
                        play.setTitle("**"+v.title+"**")
                        play.setColor("#13ad65")
                        play.setImage(v.thumbnail)
                        play.addFields(
                        {name:'**업로더**',value:`[${v.author.name}](${v.author.url})`,inline:true},
                        {name:'**길이**',value:v.timestamp, inline:true},
                        {name:'**조회수**',value:views, inline:true}
                        )
                        play.setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
                        play.setTimestamp()                     
                        if(!queue.get(interaction.guild.id)) {
                            const connection = joinVoiceChannel({
                                channelId: interaction.member.voice.channel.id,
                                guildId: interaction.guild.id,
                                adapterCreator: interaction.guild.voiceAdapterCreator
                                });
                            var songqueue = {
                                url : [],
                                name : [],
                                thumbnail : [],
                                repeat : ["off"],
                                player : createAudioPlayer(),
                                connection : connection
                            }
                            queue.set(interaction.guild.id, songqueue)
                            connection.subscribe(songqueue.player)
                            require("../index.js").playing(v.url, connection, interaction);
                            play.setDescription("음악을 재생할게요!")
                        } else {
                            var songqueue = queue.get(interaction.guild.id);
                            play.setDescription("음악을 대기열에 추가했어요!")
                        }

                        songqueue.url.push(v.url)
                        songqueue.name.push(v.title)
                        songqueue.thumbnail.push(v.thumbnail)

                        return interaction.editReply({ embeds : [play] });
                    })
                }
            }
    }
}

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }