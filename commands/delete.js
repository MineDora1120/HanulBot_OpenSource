const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name : "제거",
    slash : new SlashCommandBuilder().setName("제거").setDescription("입력된 대기얼을 제거해요.").addNumberOption(option => option.setName('번호').setDescription('삭제할 대기열의 번호를 입력해주세요').setRequired(true)),
    execute(client, interaction, queue) {
        let userInput = interaction.options.getNumber("번호")
        if(queue.get(interaction.guild.id)) {
            const player = queue.get(interaction.guild.id).player;
            const connection = queue.get(interaction.guild.id).connection;
            if(userInput == 1) {
                if(queue.get(interaction.guild.id).name.length <= 1) {
                    player.stop()
                    connection.destroy()
                    queue.delete(interaction.guild.id);

                    const embed = new EmbedBuilder()
                    .setColor("#13ad65")
                    .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
                    .setTitle("스킵 성공")
                    .setDescription("음악이 중지되고 대기열이 초기화 되었어요.")
                    .setTimestamp();
        
                    return interaction.reply({ embeds : [embed] });
                 } else {
                    player.stop();  
                    const embed = new EmbedBuilder()
                    .setColor("#13ad65")
                    .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
                    .setTitle("제거 성공")
                    .setImage(`${queue.get(interaction.guild.id).thumbnail[0]}`)
                    .setDescription(`**${queue.get(interaction.guild.id).name[0]}** (을)를 재생할게요.`)
                    .setTimestamp();        
                    return interaction.reply({ embeds : [embed] });
                 }
            } else {
                queue.get(interaction.guild.id).name.splice(userInput-1, 1)
                queue.get(interaction.guild.id).thumbnail.splice(userInput-1, 1)
                queue.get(interaction.guild.id).url.splice(userInput-1, 1)
                
                const embed = new EmbedBuilder()
                .setColor("#13ad65")
                .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
                .setTitle("제거 성공")
                .setImage(`${queue.get(interaction.guild.id).thumbnail[0]}`)
                .setDescription(`**대기열 번호 ${userInput}번** 이였던 **${queue.get(interaction.guild.id).name[0]}** (을)를 제거했어요.`)
                .setTimestamp();
    
                return interaction.reply({ embeds : [embed] });
            }
        } else {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
            .setTitle("대기열 없음")
            .setDescription("대기열이 없어 제거할 수 없었어요.")
            .setTimestamp();

            return interaction.reply({ embeds : [embed] });
        }
    }
}