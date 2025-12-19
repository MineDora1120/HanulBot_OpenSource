const { GetListByKeyword, GetPlaylistData, GetVideoDetails } = require('youtube-search-api')
const { QueueDataAdd } = require('./queue')

exports.IsNameSearching = async function(name, queue, interaction, isUrl) {

    try 
    {
        var search, analyzed;

        if(isUrl) 
        {
            var videoId = String(name).match(/\/([A-Za-z0-9_-]{11})\?/)[1];
            search = await GetVideoDetails(videoId);

            analyzed = {    
                name : search.title,
                url : name,
                thumbnail : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                id : videoId
            }
        } 
        else 
        {
            search = await GetListByKeyword(name, false, 1);

            analyzed = {    
                name : search.items[0].title,   
                url : "https://www.youtube.com/watch?v="+ search.items[0].id,
                thumbnail : `https://img.youtube.com/vi/${search.items[0].id}/maxresdefault.jpg`, //search.items[0].thumbnail.thumbnails[0].url,
                id : search.items[0].id
            }
        }

        if(analyzed.name == undefined || String(analyzed)?.length <= 5) return false;

        return await QueueDataAdd(analyzed, queue, interaction);

    } 
    catch(error) 
    {
        return false;
    }
}

exports.IsPlaylistSearch = async function(id, queue, interaction) {
    try 
    {
        const search = await GetPlaylistData(id)

        if(search?.items[0] == undefined || String(search)?.length <= 5) 
        {
            return false;
        } 
        else 
        {
            Object.values(search.items).forEach(database => 
            {
                var analyzed = {    
                    name : database.title,
                    url : "https://www.youtube.com/watch?v="+ database.id,
                    thumbnail : `https://img.youtube.com/vi/${database.id}/maxresdefault.jpg`,
                    id : database.id
                }

                QueueDataAdd(analyzed, queue,interaction);
                return;
            });
        }

        queue.set(interaction.guild.id + "playlist", {"title": search.metadata.playlistMetadataRenderer.title, "thumbnail": `https://img.youtube.com/vi/${search.items[0].id}/maxresdefault.jpg`, 'len': search.items.length});
        return true;
        
    } 
    catch(error) 
    {
        console.log(error)
        return false;
    }

}