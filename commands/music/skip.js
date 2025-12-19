const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { CreateMusicQueueEmbed } = require('../../function/embed');

module.exports = {
    name : "스킵",
    slash : new SlashCommandBuilder().setName("스킵").setDescription("현재 재생중인 음악을 스킵해요."),
    async execute(client, interaction, queue)
    {
        
        if(!queue.get(interaction.guild.id)) 
        {
            interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**")
            return;
        }

        const guildQueue = queue.get(interaction.guild.id);
        const player = guildQueue.player;
        

        if(guildQueue.name.length <= 1) 
        { 
            await interaction.deleteReply(); 
            player.stop(); 

            return;
        } 

        CreateMusicQueueEmbed(queue, 1, ":track_next:");
        player.stop();
        return;
    }
}