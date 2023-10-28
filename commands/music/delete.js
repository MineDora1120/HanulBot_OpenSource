const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { musicEmbed } = require('../../function/embed');

module.exports = {
    name : "제거",
    slash : new SlashCommandBuilder().setName("제거").setDescription("입력된 대기얼을 제거해요.").addNumberOption(option => option.setName('번호').setDescription('삭제할 대기열의 번호를 입력해주세요').setRequired(true)),
    execute(client, interaction, queue) {
        let userInput = interaction.options.getNumber("번호"), analyzeQueue = queue.get(interaction.guild.id)

        if(analyzeQueue && analyzeQueue?.name[userInput-1]) {
            if(analyzeQueue.name.length <= 1) {

                analyzeQueue.connection.destroy()
                queue.delete(interaction.guild.id);
                return interaction.editReply("**:stop_button: __음악을 중지했어요.__ **")
            }

            musicEmbed(`**:wastebasket: [${userInput}번] ${analyzeQueue.name[userInput-1]}**`, `${analyzeQueue.thumbnail[userInput-1]}`, `${analyzeQueue.url[userInput-1]}`, interaction, client);

            if(userInput == 1) return analyzeQueue.player.stop();

            analyzeQueue.name.splice(userInput-1, 1)
            analyzeQueue.thumbnail.splice(userInput-1, 1)
            analyzeQueue.url.splice(userInput-1, 1)
            analyzeQueue.id.splice(userInput-1, 1)

        } else return interaction.editReply("**:warning: __대기열이 없거나 숫자를 잘못 입력하셨어요!__**");
    }
}