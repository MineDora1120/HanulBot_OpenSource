const { EmbedBuilder } = require('discord.js')

exports.musicEmbed = async function(title, thumbnail, url, interaction, client) {
    const play = new EmbedBuilder()
    play.setTitle(title)
    play.setColor('Aqua')
    play.setURL(encodeURI(url))
    play.setThumbnail(thumbnail)
    play.setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
    play.setTimestamp()   
    await interaction.editReply({ embeds : [play] });
}