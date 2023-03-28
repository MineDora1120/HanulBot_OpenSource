const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name : "중지",
    slash : new SlashCommandBuilder().setName("중지").setDescription("음악을 중지해요."),
   async execute(client, interaction, queue) {
        if(queue.get(interaction.guild.id)) {
            const player = queue.get(interaction.guild.id).player;
            const connection = queue.get(interaction.guild.id).connection;
            player.stop()
            connection.destroy()
            queue.delete(interaction.guild.id);
            const embed = new EmbedBuilder()
            .setColor("#13ad65")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setTitle("중지 성공")
            .setDescription("음악이 중지되고 대기열이 초기화 되었어요.")
            .setTimestamp();

            return interaction.reply({ embeds : [embed] });
        } else {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setTitle("중지 불가")
            .setDescription("이미 음악이 중지되었어요!")
            .setTimestamp();

            return interaction.reply({ embeds : [embed] });
        }
    }
}