const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name : "일시중지",
    slash : new SlashCommandBuilder().setName("일시중지").setDescription("현재 재생중인 음악을 일시중지 해요."),
    execute(client, interaction, queue)
    {
        if(!queue.get(interaction.guild.id))
        {
            interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**")
            return;
        }

        const guildQueue = queue.get(interaction.guild.id);

        if(guildQueue.stop == true) 
        {
            guildQueue.player.unpause();
            guildQueue.stop = false;
            interaction.editReply("**:arrow_forward: __음악을 다시 재생할게요!__**")

            return;
        } 

        guildQueue.stop = true;
        guildQueue.player.pause()
        interaction.editReply("** :pause_button: __음악이 일시 중지 되었어요.__**")

        return;     
    }
}