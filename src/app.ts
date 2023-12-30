import type { Event, Filter, FilterQuery } from "./event.ts";

const filter: FilterQuery[] = [
    "message",
    "callback_query",
    "edited_message",
];

type Middleware<C extends Event> = (ctx: C) => unknown | Promise<unknown>;
class Composer<C extends Event> {
    use(...middleware: Array<Middleware<C>>): Composer<C> {
        console.log("Adding", middleware.length, "generic handlers");
        return this;
    }
    on<Q extends FilterQuery>(
        filter: Q | Q[],
        ...middleware: Array<Middleware<Filter<C, Q>>>
    ): Composer<Filter<C, Q>> {
        console.log("Adding", middleware.length, "handlers for", filter);
        return new Composer<Filter<C, Q>>();
    }
}

const bot = new Composer();

const c = bot.on(["message", "channel_post"]).on("message");
c.use(() => {});

bot.on(["message", "channel_post"], (ctx) => {});
bot.on(filter);
bot.on(filter, (ctx) => {});
bot.on(filter, async (ctx) => {});

bot.on("message", async (ctx) => {});

bot.on("chat_join_request", (ctx) => ctx.chatJoinRequest);

bot.on<"message" | "channel_post">("message", async (ctx) => {
    await 0;
});

const x = bot.on(["message", "channel_post"], () => {});
x.use(() => {});

bot.on("message", (ctx) => Promise.resolve());
bot.on("message_reaction", (ctx) => Promise.resolve());

bot.on("removed_chat_boost", (ctx) => {});
