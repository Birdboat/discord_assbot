import { Message } from 'discord.js';
import { Command, CommandMessage } from 'discord.js-commando';

export class KillCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kill",
            group: "fun",
            memberName: "kill",
            description: "kills",
            guildOnly: true,
        });
    }

    async run(msg:CommandMessage) : Promise<Message | Message[]> {
        return msg.say("oh yeah baby");
    }
}