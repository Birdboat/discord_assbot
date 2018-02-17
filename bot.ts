/// <reference path='node_modules/discord.js-commando/typings/index.d.ts'/> 

import { RichEmbed, Message, Emoji, ReactionEmoji } from 'discord.js';
import { CommandoClient, Command, CommandMessage, CommandGroup, CommandInfo } from "discord.js-commando";
import * as fs from 'fs';
import * as path from 'path'
import { Emojis } from './exports';

const config:any = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
export const client = new CommandoClient(
    {
        owner/*(s)*/: [
            '174662985036333058', // Jarod - epic beast guy
            '194001380984225794'  // Max - fuckin retard
        ],
        unknownCommandResponse: false,
        commandPrefix: config.prefix as string
    }
);

export class EmojiGroup extends CommandGroup {
    public constructor(client: CommandoClient, emoji:string | Emoji | ReactionEmoji, id: string, name?: string, guarded?: boolean, commands?: Command[]){
        super(client, id, name, guarded, commands);
        this.emoji = emoji;
    }

    public emoji: string | Emoji | ReactionEmoji;
}

class AboutCommand extends Command {
    constructor(client:CommandoClient) {
        super(client, {
            name: "about",
            group: "core",
            guildOnly: true,
            memberName: "about",
            description: "displays info"
        });
    }

    public hasPermission(message:CommandMessage) {
        return true;
    }

    public run(message:CommandMessage) {
        return message.say("```assbot......```");
    }
}

client
    .on("error", console.error)
    .on("warn", console.warn)
    .on("ready", () => {
        console.log("ass is reeking");
    })
    .on("commandError", (cmd, error) => {
        console.log("```error......." + error.name + "......." + error.message + "......fuk............" +"```");
    })
    .on("unknownCommand", (msg) => {
        console.log("Unknown command: " + msg.content);
    })
    .on("message", (msg) => {
        if (msg.author.bot) return;
    });

client.registry
    .registerDefaultTypes()
    .registerGroups([
        new EmojiGroup(client, Emojis.red_heart, "core", "Core functionality"),
        new EmojiGroup(client, Emojis.video_game, "fun", "Fun stuff")
    ])
    .registerCommand(AboutCommand)
    .registerCommandsIn(path.join(__dirname, "mods"));

client.login(config.token as string);