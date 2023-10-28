const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { firstQueueDelete } = require('../../scripts/queue');
const { musicEmbed } = require('../../function/embed');

module.exports = {
    name : "구간재생",
    slash : new SlashCommandBuilder().setName("구간재생").setDescription("입력된 숫자 구간부터 음악을 시작해요.").addNumberOption(option => option.setName('번호').setDescription('재생할 대기열의 번호를 입력해주세요').setRequired(true)),
    async execute(client, interaction, queue) {
        let userInput = interaction.options.getNumber("번호"), analyzeQueue = queue.get(interaction.guild.id);
        if(analyzeQueue) {
            for(var i = 1; i < userInput; i++) {
                firstQueueDelete(analyzeQueue);
            }
            analyzeQueue.player.stop();
            musicEmbed(`**:track_next: ${analyzeQueue.name[1]}**`, `${analyzeQueue.thumbnail[1]}`, `${analyzeQueue.url[1]}`, interaction, client);

        } else if(analyzeQueue.name.length <= userInput) return interaction.editReply("**:warning: __숫자를 잘못 입력하셨어요!__**");
        else return interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**");
    }
}