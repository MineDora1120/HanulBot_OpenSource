const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name : "대기열",
    slash : new SlashCommandBuilder().setName("대기열").setDescription("현재 재생 대기중인 음악들을 표시해요."),
    async execute(client, interaction, queue) {
        if (!queue.get(interaction.guild.id)) {
            const embed = new EmbedBuilder()
            .setColor("#ec9f19")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setDescription("아직 노래가 재생중이지 않아요.")
            .setTimestamp();

            return interaction.reply({ embeds : [embed] });
        }
        let embed = new EmbedBuilder();
        embed.setColor("#13ad65")
        embed.setTitle(`**🎵 현재 재생중 : ** ${queue.get(interaction.guild.id).name[0]}`)
        embed.setThumbnail(`${queue.get(interaction.guild.id).thumbnail[0]}`)
        embed.setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
        var temp = new Map();
        temp.set(interaction.guild.id, { 'number': [0], text: ""})
        for(var db of queue.get(interaction.guild.id).name) {
            temp.get(interaction.guild.id).number.push(temp.get(interaction.guild.id).number[0]+1);
            temp.get(interaction.guild.id).number.shift();
            temp.set(interaction.guild.id, { 'number': [temp.get(interaction.guild.id).number[0]], text: `${temp.get(interaction.guild.id).text}${temp.get(interaction.guild.id).number[0]}. ${db}\n`})
        }
        embed.setDescription(`${temp.get(interaction.guild.id).text}`)
        embed.setTimestamp();
        return interaction.reply({ embeds : [embed] });
    }
}