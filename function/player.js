const ffmpegPath = require("ffmpeg-static");
const path = require("path");

const ytdlpPath = path.join(
  __dirname,
  "..",
  "local_modules",
  "yt-dlp.exe"
);

const { spawn } = require('child_process');
const { createAudioResource, StreamType, AudioPlayerStatus } = require("@discordjs/voice");
const { GetVideoDetails } = require('youtube-search-api');
const { QueueAdd, QueueShift } = require("../scripts/queue");


exports.StartPlayer = function(url, connection, interaction, client, queue) 
{
    let analyzeQueue = queue.get(interaction.guild.id)
    MusicPlaying(analyzeQueue, interaction, url);

    analyzeQueue.player.on(AudioPlayerStatus.Idle, async () => 
    {
        analyzeQueue.Stop(false);

        if(!analyzeQueue) return;
        if(analyzeQueue.repeat == "on") 
        {
            QueueAdd(analyzeQueue, analyzeQueue.url[0], analyzeQueue.name[0], analyzeQueue.thumbnail[0])
        } 

        if(analyzeQueue.name.length > 1 || analyzeQueue.repeat == "on") 
        {
            QueueShift(analyzeQueue)
            MusicPlaying(analyzeQueue, interaction, analyzeQueue.url[0])
            return;
        }

        if(analyzeQueue.Mixing == "on") 
        {
            try 
            {
                await QueueMixing(analyzeQueue);
                QueueShift(analyzeQueue);       
                MusicPlaying(analyzeQueue, interaction, analyzeQueue.url[0]);

                return;
            } 
            catch(error)
            {
                interaction.channel.send("**⏹ __믹스 생성중 오류가 발생했어요. 나중에 다시 시도해주세요.__**")
                analyzeQueue.Mixing = "off";

                if(analyzeQueue.length <= 1) 
                {
                    queue.delete(interaction.guild.id);
                    connection.destroy();

                    return;
                }
                
                MusicPlaying(analyzeQueue, interaction, analyzeQueue.url[0]);
                return;
            }
        } 

        if(analyzeQueue.name.length == 1 && analyzeQueue.repeat == "off" && analyzeQueue.Mixing == "off")
        {
            interaction.channel.send("**⏹️ __재생이 완료되었어요!__**")

            analyzeQueue.Stop(true);
        }
    })

    analyzeQueue.player.on('error', (error) => 
    {
        console.error(error);
        interaction.channel.send("**❗재생 오류가 발생했어요.**");

        if(analyzeQueue.name.length <= 1)
        {
            queue.delete(interaction.guild.id) 
            return;
        }

        analyzeQueue.player.stop();
        return;
    })
}

function MusicPlaying(queue, interaction, url) 
{
  const ytdlp = spawn(ytdlpPath, [
    "-f", "bestaudio",
    "--js-runtime", "node",
    "-o", "-",
    url
  ], { stdio: ["ignore", "pipe", "pipe"] });

  const ffmpeg = spawn(ffmpegPath, [
    "-loglevel", "0",
    "-i", "pipe:0",
    "-map_metadata", "-1",
    "-f", "opus",
    "-ac", "2",
    "-ar", "48000",
    "-b:a", "128k",
    "pipe:1"
  ], { stdio: ["pipe", "pipe", "ignore"] });

  ytdlp.stdout.pipe(ffmpeg.stdin);
  queue.modules = { ytdlp: ytdlp, ffmpeg: ffmpeg };   

  const resource = createAudioResource(ffmpeg.stdout, {
    inputType: StreamType.OggOpus
  });

  queue.player.play(resource);
}



async function QueueMixing(queue) {
    const userData = await GetVideoDetails(queue.id[0])
    Object.values(userData.suggestion).forEach(database => {
        QueueAdd(queue, "https://www.youtube.com/watch?v="+ database.id, database.title, `https://img.youtube.com/vi/${database.id}/maxresdefault.jpg`)
    });
}