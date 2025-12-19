const { EmbedBuilder } = require('discord.js')

exports.CreateMusicQueueEmbed = async function(queue, number, symbol, interaction, client)
{
    CreateEmbed(`**${symbol} ${queue.name[number]}**`, `${queue.thumbnail[number]}`, `${queue.url[number]}`, interaction, client);
}

exports.CreateMusicEmbed = CreateEmbed;


async function CreateEmbed(title, thumbnail, url, interaction, client) 
{
    const play = new EmbedBuilder()
    play.setTitle(title)
    play.setColor('Aqua')
    play.setURL(encodeURI(url))
    play.setThumbnail(thumbnail)
    play.setAuthor({ name : client.user.tag, iconURL : client.user.displayAvatarURL()})
    play.setTimestamp()   
    await interaction.editReply({ embeds : [play] });
}