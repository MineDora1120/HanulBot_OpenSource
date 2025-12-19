const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name : "믹스",
    slash : new SlashCommandBuilder().setName("믹스").setDescription("지금 듣고있는 음악에 대한 라디오를 시작해요."),
    execute(client, interaction, queue) 
    {
        if(!queue.get(interaction.guild.id)) 
        {
            interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**")
            return 
        }

        const guildQueue = queue.get(interaction.guild.id);

        if(guildQueue.Mixing == "off") 
        {
            guildQueue.Mixing = "on"
            interaction.editReply("**"+ ":leftwards_arrow_with_hook:" + " __믹스를 ``활성화``했어요.__**")
            return;
        }

        guildQueue.Mixing = "off"
        interaction.editReply("**" + ":arrow_right:" +"__믹스를 ``비활성화``했어요.__ **")
        return;
    }
}
