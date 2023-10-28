const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { musicEmbed } = require('../../function/embed');

module.exports = {
    name : "스킵",
    slash : new SlashCommandBuilder().setName("스킵").setDescription("현재 재생중인 음악을 스킵해요."),
    async execute(client, interaction, queue) {
        
        const player = queue.get(interaction.guild.id).player;
        const connection = queue.get(interaction.guild.id).connection;
        
        if(queue.get(interaction.guild.id)) {
            if(queue.get(interaction.guild.id).name.length <= 1) { await interaction.deleteReply(); player.stop(); } 
            else {
                musicEmbed(`**:track_next: ${queue.get(interaction.guild.id).name[1]}**`, `${queue.get(interaction.guild.id).thumbnail[1]}`, `${queue.get(interaction.guild.id).url[1]}`, interaction, client);
                player.stop()
            }
        } else interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**")
        
    }
}