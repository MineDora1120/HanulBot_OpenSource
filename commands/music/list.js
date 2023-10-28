const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name : "대기열",
    slash : new SlashCommandBuilder().setName("대기열").setDescription("현재 재생 대기중인 음악들을 표시해요."),
    execute(client, interaction, queue) {
        var temp = new Map();
        
        if (!queue.get(interaction.guild.id)) return interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**");

        const embed = new EmbedBuilder();

        embed.setColor("#13ad65")
        embed.setTitle(`**🎵 현재 재생중 : ** ${queue.get(interaction.guild.id).name[0]}`)
        embed.setThumbnail(`${queue.get(interaction.guild.id).thumbnail[0]}`)
        embed.setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
        embed.setTimestamp()

        temp.set(interaction.guild.id, { 'number': [0], text: ""})

        queue.get(interaction.guild.id).name.forEach(db => {
            temp.get(interaction.guild.id).number.push(temp.get(interaction.guild.id).number[0]+1);
            temp.get(interaction.guild.id).number.shift();
            temp.set(interaction.guild.id, { 'number': [temp.get(interaction.guild.id).number[0]], text: `${temp.get(interaction.guild.id).text}${temp.get(interaction.guild.id).number[0]}. ${db}\n`})
        });
            
        embed.setDescription(`${temp.get(interaction.guild.id).text}`)
        temp.delete(interaction.guild.id)

        return interaction.editReply({ embeds : [embed] });
    }
}