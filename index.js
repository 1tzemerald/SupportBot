//  ____                               _   ____        _   
// / ___| _   _ _ __  _ __   ___  _ __| |_| __ )  ___ | |_ 
// \___ \| | | | '_ \| '_ \ / _ \| '__| __|  _ \ / _ \| __|
//  ___) | |_| | |_) | |_) | (_) | |  | |_| |_) | (_) | |_ 
// |____/ \__,_| .__/| .__/ \___/|_|   \__|____/ \___/ \__|
//             |_|   |_|                                   
//              © 2020 Created by Emerald Services
//              Licnese: MIT
//              SupportBot v5.2

const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();

bot.commands = new Discord.Collection();

const yaml = require('js-yaml');
const supportbot = yaml.load(fs.readFileSync('./supportbot-config.yml', 'utf8'));

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

String.prototype.toProperCase = function () {
    return this.replace(
        /([^\W_]+[^\s-]*) */g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

const init = async () => {
    const evtFiles = await readdir("./events/");
    
    evtFiles.forEach((file, i) => {
        const eventName = file.split(".")[0];
        const event = require(`./events/${file}`);
        
        console.info(`\u001b[37m`, `[${supportbot.Bot_Name}]:`, `\u001b[31m`, `#${i + 1} Event Loaded: ${eventName.toProperCase()} `);
        
        bot.on(eventName, event.bind(null, bot));
        delete require.cache[require.resolve(`./events/${file}`)];
    });

    console.info(`\u001b[37m`, `[${supportbot.Bot_Name}]:`, `\u001b[32m`, `Successfully loaded ${evtFiles.length} events.`);
    console.info(`\u001b[37m`, "-----------------------------------------------------------------------------");
};

init();

fs.readdir("./commands/", (err, files) => {
    if (err) console.info(err, "error");
    
    let jsfiles = files.filter((f) => f.split(".").pop() === "js");

    if (jsfiles.length <= 0) {
        console.log(`[${supportbot.Bot_Name}]: No commands found. Try to Re-download the resource`);
        return;
    }
  
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.info(`\u001b[37m`, `[${supportbot.Bot_Name}]:`, `\u001b[31m`, `#${i + 1} Command Loaded: ${props.name.toProperCase()}`);
        bot.commands.set(props.name, props);
    });

    console.info(`\u001b[37m`, `[${supportbot.Bot_Name}]:`, `\u001b[32m`, `Loaded ${jsfiles.length} commands!`);
    console.info(`\u001b[37m`, "-----------------------------------------------------------------------------");
});

fs.readdir("./commands/", (err, files) => {
    if (err) console.info(err, "error");
    
    let jsfiles = files.filter((f) => f.split(".").pop() === "js");

    if (jsfiles.length <= 0) {
        console.log(`[${supportbot.Bot_Name}]: No addons found. You can download addons from https://emeraldservices.xyz`);
        return;
    }
  
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.info(`\u001b[37m`, `[${supportbot.Bot_Name}]:`, `\u001b[31m`, `#${i + 1} Command Loaded: ${props.name.toProperCase()}`);
        bot.commands.set(props.name, props);
    });

    console.info(`\u001b[37m`, `[${supportbot.Bot_Name}]:`, `\u001b[32m`, `Loaded ${jsfiles.length} commands!`);
    console.info(`\u001b[37m`, "-----------------------------------------------------------------------------");
});

bot.login(supportbot.Token);