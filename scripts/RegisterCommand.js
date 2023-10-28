const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js')

exports.collection = async function(client,CommandList, token) {
     var slashData = [];
     (await require('../function/madoFS').registerFs('./commands')).forEach((jsDirectory) => {
        try {
            const command = require(`.${jsDirectory}`);
            CommandList.set(command.name, `${jsDirectory}`);
            slashData.push(command.slash)
            console.log(`${jsDirectory} - ✅`)
          } catch (error) {
              console.log(error);
              console.log(`${jsDirectory} - ❌`)
          }
     })
     const rest = new REST({ version: '10' }).setToken(token);
        
    (async () => {
         try {
            console.log("❗| 커맨드 등록이 진행중이에요.")
    
           if(client.user.tag == 'MD BOT Dev#0490') {
                await rest.put(
                    Routes.applicationGuildCommands('680034864333848593', '937707674471133265'),
                    { body: slashData },
                );
            } else {
              await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: slashData },
              );
            }
            console.log('🔨| '+ slashData.length + '개의 커맨드가 등록되었어요!')
            
            } catch (error) {
                console.log("❎| 커맨드 등록에 실패했어요.")
                console.error(error);
            }
    })();
}
