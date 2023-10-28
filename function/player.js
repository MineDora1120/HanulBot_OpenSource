const ytdl = require("ytdl-core");
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { GetVideoDetails } = require('youtube-search-api');
const { addQueue, firstQueueDelete } = require("../scripts/queue");


exports.playing = function(url, connection, interaction, client, queue) {
    let analyzeQueue = queue.get(interaction.guild.id)
    player_play(analyzeQueue, interaction, url)

    analyzeQueue.player.on('error', (error) => {
        console.error(error);
        interaction.channel.send("**❗재생 오류가 발생했어요.**");
        if(analyzeQueue.name.length == 1) queue.delete(interaction.guild.id) 
        else player.stop()
    })

    analyzeQueue.player.on(AudioPlayerStatus.Idle, async () => {
        if(!analyzeQueue) return;

        if(analyzeQueue.repeat == "on") addQueue(analyzeQueue, analyzeQueue.url[0], analyzeQueue.name[0], analyzeQueue.thumbnail[0])
        
        if(analyzeQueue.name.length > 1) {

            firstQueueDelete(analyzeQueue)
            return player_play(analyzeQueue, interaction, analyzeQueue.url[0])

        } 

        if(analyzeQueue.Mixing == "on") {
            try {

                firstQueueDelete(analyzeQueue);                    
                await Mix(analyzeQueue);
                return player_play(analyzeQueue, interaction, analyzeQueue.url[0])

            } catch(error) {

                interaction.channel.send("**⏹ __믹스 생성중 오류가 발생했어요. 나중에 다시 시도해주세요.__**")
                analyzeQueue.Mixing = "off";
                if(analyzeQueue.length <= 1) connection.destroy();
                return queue.delete(interaction.guild.id)
            }
        } 
        interaction.channel.send("**⏹️ __재생이 완료되었어요!__**")
        connection.destroy();
        queue.delete(interaction.guild.id)
    })
}

function player_play(queue, interaction, url) {
    const resource = createAudioResource(ytdl(url, {filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), {highWaterMark: 1})
    queue.player.play(resource)
}


async function Mix(queue) {
    const userData = await GetVideoDetails(queue.id[0])
    Object.values(userData.suggestion).forEach(database => {
        addQueue(queue, "https://www.youtube.com/watch?v="+ database.id, database.title, `https://img.youtube.com/vi/${database.id}/maxresdefault.jpg`)
    });
}