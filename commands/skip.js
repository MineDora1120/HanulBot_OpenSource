const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name : "스킵",
    slash : new SlashCommandBuilder().setName("스킵").setDescription("현재 재생중인 음악을 스킵해요."),
    async execute(client, interaction, queue) {
        if(queue.get(interaction.guild.id)) {
         if(queue.get(interaction.guild.id).name.length <= 1) {
            const player = queue.get(interaction.guild.id).player;
            const connection = queue.get(interaction.guild.id).connection;
            player.stop()
            connection.destroy()
            queue.delete(interaction.guild.id);
            const embed = new EmbedBuilder()
            .setColor("#13ad65")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setTitle("스킵 성공")
            .setDescription("음악이 중지되고 대기열이 초기화 되었어요.")
            .setTimestamp();

            return interaction.reply({ embeds : [embed] });
         } else {
            const player = queue.get(interaction.guild.id).player;
            player.stop();
            const embed = new EmbedBuilder()
            .setColor("#13ad65")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setTitle("스킵 성공")
            .setImage(`${queue.get(interaction.guild.id).thumbnail[0]}`)
            .setDescription(`**${queue.get(interaction.guild.id).name[0]}** (을)를 재생할게요.`)
            .setTimestamp();

            return interaction.reply({ embeds : [embed] });
         }
        } else {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setTitle("스킵 불가")
            .setDescription("음악이 재생중이 아니에요.")
            .setTimestamp();

            return interaction.reply({ embeds : [embed] });
        }
    }
}