import { RichEmbed } from "discord.js";
import { client } from "./bot";
import { Command, CommandMessage } from "discord.js-commando";

/**
 * useful stuff
 * 
 * @export
 * @class Utils
 */
export class Utils {

    /**
     * default rich embed for the bot
     * 
     * @static
     * @returns {RichEmbed} 
     * @memberof Utils
     */
    static defaultRichEmbed(): RichEmbed {
        var embed = new RichEmbed();
        embed.setAuthor("assbot");
        embed.setThumbnail(client.user.avatarURL);
        return embed;
    }

    /**
     * creates help message for command or commandmessage
     * 
     * @static
     * @param {(Command | CommandMessage)} cmd 
     * @returns {string} 
     * @memberof Utils
     */
    static commandUsage(cmd: Command | CommandMessage): string {
        var format = cmd instanceof Command ? cmd.format : cmd.command.format;
        return cmd.usage(format ? format : null).replace(/`/g, "");
    }
}