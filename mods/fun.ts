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

export class RateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rate",
            group: "fun",
            memberName: "rate",
            description: "rate stuff",
            guildOnly: true,
            args: [
                {
                    key: "thing",
                    prompt: "",
                    type: "string"
                }
            ]
        });
    }

    async run(msg:CommandMessage, { thing }) : Promise<Message | Message[]> {
        var str = thing as string;
        return msg.say("dab");
    }
}