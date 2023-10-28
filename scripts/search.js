const { GetListByKeyword, GetPlaylistData, GetVideoDetails } = require('youtube-search-api')
const { setQueue } = require('./queue')

exports.NameSearch = async function(name, queue, interaction) {

    try {
        const search = await GetListByKeyword(name, false, 1)

        if(search?.items[0] == undefined || String(search)?.length <= 5) return false;

        var analyzed = {    
            name : search.items[0].title,
            url : "https://www.youtube.com/watch?v="+ search.items[0].id,
            thumbnail : `https://img.youtube.com/vi/${search.items[0].id}/maxresdefault.jpg`,
            id : search.items[0].id
        }
        return await setQueue(analyzed, queue,interaction) 

    } catch(error) {
        
        return false;

    }
}

exports.UrlAnalyze = async function (url) {

    try {
        return (await GetVideoDetails(String(url).match(/\/([A-Za-z0-9_-]{11})\?/)[1])).title

    } catch(error) {
    
        return false;

    }
    
}

exports.PlaylistAnalyze = async function(id, queue, interaction) {
    try {

        const search = await GetPlaylistData(id)
        if(search?.items[0] == undefined || String(search)?.length <= 5) return false;
        else {
            Object.values(search.items).forEach(database => {
                var analyzed = {    
                    name : database.title,
                    url : "https://www.youtube.com/watch?v="+ database.id,
                    thumbnail : `https://img.youtube.com/vi/${database.id}/maxresdefault.jpg`,
                    id : database.id
                }
                return setQueue(analyzed, queue,interaction) 
            })
        }
        queue.set(interaction.guild.id + "playlist", {"title": search.metadata.playlistMetadataRenderer.title, "thumbnail": `https://img.youtube.com/vi/${search.items[0].id}/maxresdefault.jpg`, 'len': search.items.length});
        return true;
        
    } catch(error) {

        console.log(error)
        return false;

    }

}