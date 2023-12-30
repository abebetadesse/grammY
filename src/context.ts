// deno-lint-ignore-file camelcase
import { type Chat, type Message, type Update, type User } from "./types.ts";

// === Util types

type SnakeToCamelCase<S extends string> = S extends `${infer L}_${infer R}`
    ? `${L}${Capitalize<SnakeToCamelCase<R>>}`
    : S;
export type AliasProps<U> = {
    [K in string & keyof U as SnakeToCamelCase<K>]: U[K];
};
type RenamedUpdate = AliasProps<Omit<Update, "update_id">>;

// === Context class
/**
 * When your bot receives a message, Telegram sends an update object to your
 * bot. The update contains information about the chat, the user, and of course
 * the message itself. There are numerous other updates, too:
 * https://core.telegram.org/bots/api#update
 *
 * When grammY receives an update, it wraps this update into a context object
 * for you. Context objects are commonly named `ctx`. A context object does two
 * things:
 * 1. **`ctx.update`** holds the update object that you can use to process the
 *    message. This includes providing useful shortcuts for the update, for
 *    instance, `ctx.msg` is a shortcut that gives you the message object from
 *    the update—no matter whether it is contained in `ctx.update.message`, or
 *    `ctx.update.edited_message`, or `ctx.update.channel_post`, or
 *    `ctx.update.edited_channel_post`.
 * 2. **`ctx.api`** gives you access to the full Telegram Bot API so that you
 *    can directly call any method, such as responding via
 *    `ctx.api.sendMessage`. Also here, the context objects has some useful
 *    shortcuts for you. For instance, if you want to send a message to the same
 *    chat that a message comes from (i.e. just respond to a user) you can call
 *    `ctx.reply`. This is nothing but a wrapper for `ctx.api.sendMessage` with
 *    the right `chat_id` pre-filled for you. Almost all methods of the Telegram
 *    Bot API have their own shortcut directly on the context object, so you
 *    probably never really have to use `ctx.api` at all.
 *
 * This context object is then passed to all of the listeners (called
 * middleware) that you register on your bot. Because this is so useful, the
 * context object is often used to hold more information. One example are
 * sessions (a chat-specific data storage that is stored in a database), and
 * another example is `ctx.match` that is used by `bot.command` and other
 * methods to keep information about how a regular expression was matched.
 *
 * Read up about middleware on the
 * [website](https://grammy.dev/guide/context.html) if you want to know more
 * about the powerful opportunities that lie in context objects, and about how
 * grammY implements them.
 */
export class Context implements RenamedUpdate {
    /**
     * Used by some middleware to store information about how a certain string
     * or regular expression was matched.
     */
    public match: string | RegExpMatchArray | undefined;

    constructor(
        /**
         * The update object that is contained in the context.
         */
        public readonly update: Update,
    ) {}

    // UPDATE SHORTCUTS

    /** Alias for `ctx.update.message` */
    get message() {
        return this.update.message;
    }
    /** Alias for `ctx.update.edited_message` */
    get editedMessage() {
        return this.update.edited_message;
    }
    /** Alias for `ctx.update.channel_post` */
    get channelPost() {
        return this.update.channel_post;
    }
    /** Alias for `ctx.update.edited_channel_post` */
    get editedChannelPost() {
        return this.update.edited_channel_post;
    }
    /** Alias for `ctx.update.message_reaction` */
    get messageReaction() {
        return this.update.message_reaction;
    }
    /** Alias for `ctx.update.message_reaction_count` */
    get messageReactionCount() {
        return this.update.message_reaction_count;
    }
    /** Alias for `ctx.update.inline_query` */
    get inlineQuery() {
        return this.update.inline_query;
    }
    /** Alias for `ctx.update.chosen_inline_result` */
    get chosenInlineResult() {
        return this.update.chosen_inline_result;
    }
    /** Alias for `ctx.update.callback_query` */
    get callbackQuery() {
        return this.update.callback_query;
    }
    /** Alias for `ctx.update.shipping_query` */
    get shippingQuery() {
        return this.update.shipping_query;
    }
    /** Alias for `ctx.update.pre_checkout_query` */
    get preCheckoutQuery() {
        return this.update.pre_checkout_query;
    }
    /** Alias for `ctx.update.poll` */
    get poll() {
        return this.update.poll;
    }
    /** Alias for `ctx.update.poll_answer` */
    get pollAnswer() {
        return this.update.poll_answer;
    }
    /** Alias for `ctx.update.my_chat_member` */
    get myChatMember() {
        return this.update.my_chat_member;
    }
    /** Alias for `ctx.update.chat_member` */
    get chatMember() {
        return this.update.chat_member;
    }
    /** Alias for `ctx.update.chat_join_request` */
    get chatJoinRequest() {
        return this.update.chat_join_request;
    }
    /** Alias for `ctx.update.chat_boost` */
    get chatBoost() {
        return this.update.chat_boost;
    }
    /** Alias for `ctx.update.removed_chat_boost` */
    get removedChatBoost() {
        return this.update.removed_chat_boost;
    }

    // AGGREGATION SHORTCUTS

    /**
     * Get message object from wherever possible. Alias for `ctx.message ??
     * ctx.editedMessage ?? ctx.callbackQuery?.message ?? ctx.channelPost ??
     * ctx.editedChannelPost`
     */
    get msg(): Message | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.message ??
                this.editedMessage ??
                this.callbackQuery?.message ??
                this.channelPost ??
                this.editedChannelPost
        );
    }
    /**
     * Get chat object from wherever possible. Alias for `(ctx.msg ??
     * ctx.myChatMember ?? ctx.chatMember ?? ctx.chatJoinRequest ??
     * ctx.messageReaction ?? ctx.messageReactionCount ?? ctx.chatBoost ??
     * ctx.removedChatBoost)?.chat`
     */
    get chat(): Chat | undefined {
        // Keep in sync with types in `filter.ts`.
        return (
            this.msg ??
                this.messageReaction ??
                this.messageReactionCount ??
                this.myChatMember ??
                this.chatMember ??
                this.chatJoinRequest ??
                this.chatBoost ??
                this.removedChatBoost
        )?.chat;
    }
    /**
     * Get sender chat object from wherever possible. Alias for
     * `ctx.msg?.sender_chat`.
     */
    get senderChat(): Chat | undefined {
        return this.msg?.sender_chat;
    }
    /**
     * Get message author from wherever possible. Alias for
     * `(ctx.callbackQuery?? ctx.inlineQuery ?? ctx.shippingQuery ??
     * ctx.preCheckoutQuery ?? ctx.chosenInlineResult ?? ctx.msg ??
     * ctx.myChatMember ?? ctx.chatMember ?? ctx.chatJoinRequest)?.from`
     */
    get from(): User | undefined {
        // Keep in sync with types in `filter.ts`.
        return this.messageReaction?.user ??
            (this.callbackQuery ??
                this.inlineQuery ??
                this.shippingQuery ??
                this.preCheckoutQuery ??
                this.chosenInlineResult ??
                this.msg ??
                this.myChatMember ??
                this.chatMember ??
                this.chatJoinRequest)?.from;
    }
    /**
     * Get inline message ID from wherever possible. Alias for
     * `(ctx.callbackQuery ?? ctx.chosenInlineResult)?.inline_message_id`
     */
    get inlineMessageId(): string | undefined {
        return (
            this.callbackQuery?.inline_message_id ??
                this.chosenInlineResult?.inline_message_id
        );
    }
}
