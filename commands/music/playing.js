const { SlashCommandBuilder } = require('discord.js');
const { IsNameSearching, UrlAnalyze, IsPlaylistSearch } = require('../../scripts/search');
const { CreateMusicEmbed } = require('../../function/embed');
const { StartPlayer } = require("../../function/player");
const { SetQueue } = require('../../scripts/queue');

module.exports = {
    name : "재생",
    slash : new SlashCommandBuilder().setName("재생").setDescription("검색된 음악을 음성채널에 재생해요.").addStringOption(option => option.setName('검색어').setDescription('검색할 내용을 입력해주세요!').setRequired(true)),
    async execute(client, interaction, queue) 
    {
        let userSeachInput = interaction.options.getString("검색어")
        if(!interaction.member.voice.channel) 
        {
            interaction.editReply({ content : "**🎵 음성채널에 입장해주세요!**"});
            return;
        }
        
        if(!queue.get(interaction.guild.id)) 
        {
            SetQueue(queue, interaction, client); 
        }

        //플레이리스트
        if(String(userSeachInput).includes('https://youtube.com/playlist?list'))
        {
            var playlistId = String(userSeachInput).replace('https://youtube.com/playlist?list=','');

            if(!await IsPlaylistSearch(playlistId, queue, interaction))
            {
                OnFailSearch(interaction, queue);
                return;
            }

            var songqueue = queue.get(interaction.guild.id), len = songqueue.name.length-1, playlistDB = queue.get(interaction.guild.id + "playlist");
            await CreateMusicEmbed(":musical_note: [𝓹𝓵𝓪𝔂𝓵𝓲𝓼𝓽] **"+ playlistDB.title +"**", playlistDB.thumbnail, userSeachInput, interaction, client)
            
            if(len == playlistDB.len-1)
            {
                StartPlayer(songqueue.url[0], songqueue.connection, interaction, client, queue); //여기에 데이터 삽입
            }

            return;
        } 
   
        //일반 영상 검색
        var isUrl = false;
        if(String(userSeachInput).includes("https://")) isUrl = true;
                
        if(!await IsNameSearching(userSeachInput, queue, interaction, isUrl)) 
        {
            OnFailSearch(interaction, queue);
            return;
        }

        var songqueue = queue.get(interaction.guild.id), len = songqueue.name.length-1;

        await CreateMusicEmbed("** :musical_note: "+ songqueue.name[len] +"**", songqueue.thumbnail[len] , songqueue.url[len], interaction, client)
        if(len == 0) 
        {
            StartPlayer(songqueue.url[0], songqueue.connection, interaction, client, queue);    
        }

        return;
    }
}

function OnFailSearch(interaction, queue) 
{
    interaction.editReply("**❌ __검색에 실패했어요.__**");

    if(!queue.get(interaction.guild.id)) return;

    queue.get(interaction.guild.id).connection.destroy();
    queue.delete(interaction.guild.id);
    return;
}

