import { Command, CommandMessage, CommandGroup } from 'discord.js-commando'
import { EmojiGroup, client } from '../bot'
import { Message, RichEmbed, User, Guild, ReactionCollector } from 'discord.js';
import { Utils } from '../utils';

export class HelpCommand extends Command {

    public HelpMessageCollectors:Map<Guild, ReactionCollector>;

    constructor(client) {
        super(client, {
            name: "help",
            group: "core",
            memberName: "help",
            description: "displays help",
            guildOnly: true,
        });

        this.HelpMessageCollectors = new Map();
    }

    generateRichEmbedForGroup(group:CommandGroup) {
        var embed = Utils.defaultRichEmbed();
        embed.setTitle("group: " + group.id);
        embed.setDescription(group.name);
        embed.addBlankField(true);
        group.commands.forEach((v) => {
            embed.addField(v.name, v.description);
            embed.addField("usage: ", "```" + v.usage().replace(/`/g, "") + "```");
            embed.addBlankField(true);
        });
        embed.setFooter("bot stops collecting in 5 minutes");

        return embed;
    }

    async run(msg:CommandMessage) : Promise<Message | Message[]> {
        const embed = this.generateRichEmbedForGroup(client.registry.groups.first());
        const embedmsg = await msg.embed(embed) as Message; // make sure yo stuff async n cast
        client.registry.groups.forEach(async (g:EmojiGroup) => { // assuming every group is an EmojiGroup, will throw error if not
            await embedmsg.react(g.emoji);
        });

        if (this.HelpMessageCollectors.has(msg.guild)) {
            var c = this.HelpMessageCollectors.get(msg.guild);
            this.HelpMessageCollectors.delete(msg.guild);
            c.stop();
        }

        const collector = embedmsg.createReactionCollector((reaction, user:User) => !user.bot, { time: 300000 }); // time is in miliseconds (1000 = 1 sec)
        collector.on("collect", async (reaction) => 
        {
            var foundgroup = client.registry.groups.find((g:EmojiGroup) => g.emoji == reaction.emoji);
            if (foundgroup != null) embedmsg.edit(this.generateRichEmbedForGroup(foundgroup));
        });

        collector.on("end", () => {
            if (this.HelpMessageCollectors.has(msg.guild)) {
                var c = this.HelpMessageCollectors.get(msg.guild);
                c.stop();
            }
        });

        this.HelpMessageCollectors.set(msg.guild, collector);
        return null;
    }
}