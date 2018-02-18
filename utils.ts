import { RichEmbed } from "discord.js";
import { client } from "./bot";
import { Command, CommandMessage } from "discord.js-commando";

export class Utils {
    static defaultRichEmbed(): RichEmbed {
        var embed = new RichEmbed();
        embed.setAuthor("assbot");
        embed.setThumbnail(client.user.avatarURL);
        return embed;
    }

    static commandUsage(cmd: Command | CommandMessage): string {
        var format = cmd instanceof Command ? cmd.format : cmd.command.format;
        return cmd.usage(format ? format : null).replace(/`/g, "");
    }
}