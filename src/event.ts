export interface Update {
    update_id: number;

    message: { message: string };
    edited_message: { edited_message: string };
    channel_post: { channel_post: string };
    edited_channel_post: { edited_channel_post: string };
    message_reaction: { message_reaction: string };
    message_reaction_count: { message_reaction_count: string };
    inline_query: { inline_query: string };
    chosen_inline_result: { chosen_inline_result: string };
    callback_query: { callback_query: string };
    shipping_query: { shipping_query: string };
    pre_checkout_query: { pre_checkout_query: string };
    poll: { poll: string };
    poll_answer: { poll_answer: string };
    my_chat_member: { my_chat_member: string };
    chat_member: { chat_member: string };
    chat_join_request: { chat_join_request: string };
    chat_boost: { chat_boost: string };
    removed_chat_boost: { removed_chat_boost: string };
}

type SnakeToCamelCase<S extends string> = S extends `${infer L}_${infer R}`
    ? `${L}${Capitalize<SnakeToCamelCase<R>>}`
    : S;
export type AliasProps<U> = {
    [K in string & keyof U as SnakeToCamelCase<K>]: U[K];
};
type RenamedUpdate = AliasProps<Omit<Update, "update_id">>;

export class Event implements RenamedUpdate {
    constructor(public readonly update: Update) {}

    /** Alias for `event.update.message` */
    get message() {
        return this.update.message;
    }
    /** Alias for `event.update.edited_message` */
    get editedMessage() {
        return this.update.edited_message;
    }
    /** Alias for `event.update.channel_post` */
    get channelPost() {
        return this.update.channel_post;
    }
    /** Alias for `event.update.edited_channel_post` */
    get editedChannelPost() {
        return this.update.edited_channel_post;
    }
    /** Alias for `event.update.message_reaction` */
    get messageReaction() {
        return this.update.message_reaction;
    }
    /** Alias for `event.update.message_reaction_count` */
    get messageReactionCount() {
        return this.update.message_reaction_count;
    }
    /** Alias for `event.update.inline_query` */
    get inlineQuery() {
        return this.update.inline_query;
    }
    /** Alias for `event.update.chosen_inline_result` */
    get chosenInlineResult() {
        return this.update.chosen_inline_result;
    }
    /** Alias for `event.update.callback_query` */
    get callbackQuery() {
        return this.update.callback_query;
    }
    /** Alias for `event.update.shipping_query` */
    get shippingQuery() {
        return this.update.shipping_query;
    }
    /** Alias for `event.update.pre_checkout_query` */
    get preCheckoutQuery() {
        return this.update.pre_checkout_query;
    }
    /** Alias for `event.update.poll` */
    get poll() {
        return this.update.poll;
    }
    /** Alias for `event.update.poll_answer` */
    get pollAnswer() {
        return this.update.poll_answer;
    }
    /** Alias for `event.update.my_chat_member` */
    get myChatMember() {
        return this.update.my_chat_member;
    }
    /** Alias for `event.update.chat_member` */
    get chatMember() {
        return this.update.chat_member;
    }
    /** Alias for `event.update.chat_join_request` */
    get chatJoinRequest() {
        return this.update.chat_join_request;
    }
    /** Alias for `event.update.chat_boost` */
    get chatBoost() {
        return this.update.chat_boost;
    }
    /** Alias for `event.update.removed_chat_boost` */
    get removedChatBoost() {
        return this.update.removed_chat_boost;
    }
}

type FilterFunction<C extends Event, D extends C> = (ctx: C) => ctx is D;

export function matchFilter<E extends Event, Q extends FilterQuery>(
    filter: Q | Q[],
): FilterFunction<E, Filter<E, Q>> {
    console.log("Matching", filter);
    return (event: E): event is Filter<E, Q> => !!event;
}

/** All valid filter queries (every event type except update_id) */
export type FilterQuery = keyof Omit<Update, "update_id">;

/** Narrow down an event object based on a filter query */
export type Filter<E extends Event, Q extends FilterQuery> = PerformQuery<
    E,
    RunQuery<Q>
>;

// generate an object structure that can be intersected with events to narrow them down
type RunQuery<Q extends string> = Combine<L1Fragment<Q>, Q>;

// maps each part of the filter query to Record<"key", object>
type L1Fragment<Q extends string> = Q extends unknown ? Record<Q, object>
    : never;
// define all other fields from query as keys with value `undefined`
type Combine<U, K extends string> = U extends unknown
    ? U & Partial<Record<Exclude<K, keyof U>, undefined>>
    : never;

// apply a query result by intersecting it with Update, and then injecting into E
type PerformQuery<E extends Event, U extends object> = U extends unknown
    ? FilteredEvent<E, Update & U>
    : never;

// set the given update into a given event object, and adjust the aliases
type FilteredEvent<E extends Event, U extends Update> =
    & E
    & FilteredEventCore<U>;

// generate a structure with all aliases for a narrowed update
type FilteredEventCore<U extends Update> =
    & Record<"update", U>
    & AliasProps<Omit<U, "update_id">>;
