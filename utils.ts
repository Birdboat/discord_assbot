import { RichEmbed } from "discord.js";
import { client } from "./bot";

export class Utils {
    static defaultRichEmbed() : RichEmbed {
        var embed = new RichEmbed();
        embed.setAuthor("assbot");
        embed.setThumbnail(client.user.avatarURL);
        return embed;
    }
}