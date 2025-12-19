const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    name : "중지",
    slash : new SlashCommandBuilder().setName("중지").setDescription("음악을 중지해요."),
    async execute(client, interaction, queue)
    {
        if(!queue.get(interaction.guild.id)) 
        {
            interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**");
            return;
        }

        const analyzeQueue = queue.get(interaction.guild.id)

        analyzeQueue.Stop(true);
        interaction.editReply("**:stop_button: __음악을 중지했어요.__ **");
        return;
    }
}