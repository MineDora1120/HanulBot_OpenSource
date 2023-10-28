const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    name : "중지",
    slash : new SlashCommandBuilder().setName("중지").setDescription("음악을 중지해요."),
    async execute(client, interaction, queue) {
        const embed = new EmbedBuilder()
        
        if(queue.get(interaction.guild.id)) {
            const connection = queue.get(interaction.guild.id).connection;

            connection.destroy()
            queue.delete(interaction.guild.id);
            return interaction.editReply("**:stop_button: __음악을 중지했어요.__ **")

        } else return interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**");
    }
}