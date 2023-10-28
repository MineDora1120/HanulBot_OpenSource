exports.setQueue = async function(db, queue, interaction) {

    queue.get(interaction.guild.id).name.push(db.name);
    queue.get(interaction.guild.id).url.push(db.url);
    queue.get(interaction.guild.id).id.push(db.id);
    queue.get(interaction.guild.id).thumbnail.push(db.thumbnail);

    return true;
} //not analyze Queue

exports.addQueue = function(queue, url, name, thumbnail) {
    queue.url.push(url)
    queue.name.push(name)
    queue.id.push(db.id);
    queue.thumbnail.push(thumbnail)

    return true;
}

exports.firstQueueDelete = function(queue) {
    queue.url.shift()
    queue.name.shift()
    queue.thumbnail.shift()  
    queue.id.shift()

    return true;
}