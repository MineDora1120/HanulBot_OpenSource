const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { CreateMusicQueueEmbed } = require('../../function/embed');

module.exports = {
    name : "제거",
    slash : new SlashCommandBuilder().setName("제거").setDescription("입력된 대기얼을 제거해요.").addNumberOption(option => option.setName('번호').setDescription('삭제할 대기열의 번호를 입력해주세요').setRequired(true)),
    execute(client, interaction, queue) {
        let userInput = interaction.options.getNumber("번호");
        const guildQueue = queue.get(interaction.guild.id);

        if(guildQueue && guildQueue?.name[userInput-1]) 
        {
            if(guildQueue.name.length <= 1) {

                guildQueue.connection.destroy()
                queue.delete(interaction.guild.id);
                return interaction.editReply("**:stop_button: __음악을 중지했어요.__ **")
            }

            CreateMusicQueueEmbed(queue, userInput-1, `:wastebasket: [${userInput}번]`);

            if(userInput == 1) 
            {
                guildQueue.player.stop();
                return 
            }

            guildQueue.name.splice(userInput-1, 1)
            guildQueue.thumbnail.splice(userInput-1, 1)
            guildQueue.url.splice(userInput-1, 1)
            guildQueue.id.splice(userInput-1, 1)
        } 
        else 
        {
            interaction.editReply("**:warning: __대기열이 없거나 숫자를 잘못 입력하셨어요!__**");
            return;
        } 
    }
}