const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name : "반복",
    slash : new SlashCommandBuilder().setName("반복").setDescription("현재 음악을 반복해요."),
    execute(client, interaction, queue) {
        if(!queue.get(interaction.guild.id)) return interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**")
        
        if(queue.get(interaction.guild.id).repeat == "off") {
            queue.get(interaction.guild.id).repeat = "on"
            return interaction.editReply("**"+ ":leftwards_arrow_with_hook:" + " __반복을 ``활성화``했어요.__**")
        }
        else {
            queue.get(interaction.guild.id).repeat = "off"
            return interaction.editReply("**" + ":arrow_right:" +"__반복을 ``비활성화``했어요.__ **")
        }
    }
}