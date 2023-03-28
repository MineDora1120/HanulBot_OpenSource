const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name : "반복",
    slash : new SlashCommandBuilder().setName("반복").setDescription("현재 음악을 반복해요."),
    async execute(client, interaction, queue) {
    if(queue.get(interaction.guild.id).repeat[0] == "off") {
        const embed = new EmbedBuilder()
        .setColor("#13ad65")
        .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
        .setTitle("반복이 **``활성화``** 되었어요.")
        .setTimestamp();
        interaction.reply({ embeds : [embed] });
        update("on", queue, interaction.guild.id)
    } else {
        const embed = new EmbedBuilder()
        .setColor("#13ad65")
        .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
        .setTitle("반복이 **``비활성화``** 되었어요.")
        .setTimestamp();
        interaction.reply({ embeds : [embed] });
        update("off", queue, interaction.guild.id)
    }
 }
}

function update(text, queue, id) {
    queue.get(id).repeat.shift()
    queue.get(id).repeat.push(text)
}