const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueueShift: firstQueueDelete } = require('../../scripts/queue');
const { CreateMusicQueueEmbed, CreateMusicEmbed: musicEmbed } = require('../../function/embed');

module.exports = {
    name : "구간재생",
    slash : new SlashCommandBuilder().setName("구간재생").setDescription("입력된 숫자 구간부터 음악을 시작해요.").addNumberOption(option => option.setName('번호').setDescription('재생할 대기열의 번호를 입력해주세요').setRequired(true)),
    
    async execute(client, interaction, queue) 
    {
        var userInput = interaction.options.getNumber("번호");
        const guildQueue = queue.get(interaction.guild.id);

        if(guildQueue.name.length < userInput || guildQueue.name.length == 1) 
        {
            interaction.editReply("**:warning: __숫자를 잘못 입력하셨어요!__**");
            return;
        }

        CreateMusicQueueEmbed(queue, userInput-1, ":track_next:");
        
        if(guildQueue) 
        {
            for(var i = 1; i < userInput-1; i++) 
            {
                firstQueueDelete(guildQueue);
            }

            guildQueue.player.stop();
        } 
        else 
        {
            interaction.editReply("**:warning: __음악이 재생중이지 않아요.__**");
            return;
        }
    }
}