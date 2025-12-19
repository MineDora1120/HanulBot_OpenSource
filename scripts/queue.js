const { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus } = require('@discordjs/voice');

exports.QueueDataAdd = async function(db, queue, interaction) {

    queue.get(interaction.guild.id).name.push(db.name);
    queue.get(interaction.guild.id).url.push(db.url);
    queue.get(interaction.guild.id).id.push(db.id);
    queue.get(interaction.guild.id).thumbnail.push(db.thumbnail);

    return true;
} //not analyze Queue

exports.QueueAdd = function(queue, url, name, thumbnail) {
    queue.url.push(url)
    queue.name.push(name)
    queue.id.push(queue.id);
    queue.thumbnail.push(thumbnail)

    return true;
}

exports.QueueShift = function(queue) {
    queue.url.shift()
    queue.name.shift()
    queue.thumbnail.shift()  
    queue.id.shift()

    return true;
}

exports.SetQueue = function(queue, interaction, client)
{
    var songqueue = {
        url : [],
        name : [],
        thumbnail : [],
        id : [],
        repeat : "off",
        Mixing : "off",
        stop : false,
        disconnect: false,
        player : createAudioPlayer(),
        connection : joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        }),
        modules: {ffmpeg: null, ytdlp: null},

        async Stop(force) 
        {
            if(this.disconnect) return;

            const { ytdlp, ffmpeg } = this.modules;

            ytdlp.kill("SIGKILL");
            ffmpeg.kill("SIGKILL");

            if(!force) return;

            this.disconnect = true;
            this.player.stop();
            this.connection.destroy();

            queue.delete(interaction.guild.id);
        }
    }

    songqueue.connection.subscribe(songqueue.player)
    songqueue.connection.on("stateChange", (oldState, newState) => 
    {
        if (newState.status === VoiceConnectionStatus.Disconnected) 
        {
            const { ytdlp, ffmpeg } = this.modules;

            if(ytdlp == null || ffmpeg == null) return;

            ytdlp.kill("SIGKILL");
            ffmpeg.kill("SIGKILL");

            interaction.send.message("**⏹ __음성채널에서 나가졌어요. 재생을 중지할게요.__**");
            queue.delete(interaction.guild.id);
        }
    });

    client.on("voiceStateUpdate", (oldState, newState) => 
    {
        if (!oldState.channel || oldState.channel.id !== songqueue.connection.joinConfig.channelId) return;

        const channel = oldState.channel;
        const nonBots = channel.members.filter(m => !m.user.bot);

        if (nonBots.size === 0) 
        {
            songqueue.stop(true);
            interaction.send.message("**⏹ __모든 유저가 음성채널에서 나갔어요. 재생을 중지할게요.__**");
        }
    });

    queue.set(interaction.guild.id, songqueue);    
}