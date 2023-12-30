// deno-lint-ignore-file camelcase no-explicit-any
import { type AliasProps, type Context } from "./context.ts";
import { type Update } from "./types.ts";

type FilterFunction<C extends Context, D extends C> = (ctx: C) => ctx is D;

export function matchFilter<C extends Context, Q extends FilterQuery>(
    filter: Q | Q[],
): FilterFunction<C, Filter<C, Q>> {
    console.log("Matching", filter);
    return (ctx: C): ctx is Filter<C, Q> => !!ctx;
}

const UPDATE_KEYS = {
    message: {},
    edited_message: {},
    channel_post: {},
    edited_channel_post: {},
    inline_query: {},
    chosen_inline_result: {},
    callback_query: {},
    shipping_query: {},
    pre_checkout_query: {},
    poll: {},
    poll_answer: {},
    my_chat_member: {},
    chat_member: {},
    chat_join_request: {},
    message_reaction: {},
    message_reaction_count: {},
    chat_boost: {},
    removed_chat_boost: {},
} as const;

// === Build up all possible filter queries from the above validation structure
type KeyOf<T> = string & keyof T; // Emulate `keyofStringsOnly`

// Suggestion building base structure
type ComputeFilterQueryList = KeyOf<typeof UPDATE_KEYS>;

/**
 * Represents a filter query that can be passed to `bot.on`. There are three
 * different kinds of filter queries: Level 1, Level 2, and Level 3. Check out
 * the [website](https://grammy.dev/guide/filter-queries.html) to read about how
 * filter queries work in grammY, and how to use them.
 *
 * Here are three brief examples:
 * ```ts
 * // Listen for messages of any type (Level 1)
 * bot.on('message', ctx => { ... })
 * // Listen for audio messages only (Level 2)
 * bot.on('message:audio', ctx => { ... })
 * // Listen for text messages that have a URL entity (Level 3)
 * bot.on('message:entities:url', ctx => { ... })
 * ```
 */
export type FilterQuery = ComputeFilterQueryList;

// === Infer the present/absent properties on a context object based on a query
// Note: L3 filters are not represented in types

/**
 * Any kind of value that appears in the Telegram Bot API. When intersected with
 * an optional field, it effectively removes `| undefined`.
 */
type NotUndefined = string | number | boolean | object;

/**
 * Given a FilterQuery, returns an object that, when intersected with an Update,
 * marks those properties as required that are guaranteed to exist.
 */
type RunQuery<Q extends string> = L1Discriminator<Q, L1Parts<Q>>;

// gets all L1 query snippets
type L1Parts<Q extends string> = Q extends `${infer L1}:${string}` ? L1 : Q;
// gets all L2 query snippets for the given L1 part, or `never`
type L2Parts<
    Q extends string,
    L1 extends string,
> = Q extends `${L1}:${infer L2}:${string}` ? L2
    : Q extends `${L1}:${infer L2}` ? L2
    : never;

// build up all combinations of all L1 fields
type L1Discriminator<Q extends string, L1 extends string> = Combine<
    L1Fragment<Q, L1>,
    L1
>;
// maps each L1 part of the filter query to an object
type L1Fragment<Q extends string, L1 extends string> = L1 extends unknown
    ? Record<L1, NotUndefined>
    : never;

// define additional fields on U with value `undefined`
type Combine<U, K extends string> = U extends unknown
    ? U & Partial<Record<Exclude<K, keyof U>, undefined>>
    : never;

/**
 * This type infers which properties will be present on the given context object
 * provided it matches the given filter query. If the filter query is a union
 * type, the produced context object will be a union of possible combinations,
 * hence allowing you to narrow down manually which of the properties are
 * present.
 *
 * In some sense, this type computes `matchFilter` on the type level.
 */
export type Filter<C extends Context, Q extends FilterQuery> = PerformQuery<
    C,
    RunQuery<Q>
>;
// same as Filter but stop before intersecting with Context
export type FilterCore<Q extends FilterQuery> = PerformQueryCore<
    RunQuery<Q>
>;

// apply a query result by intersecting it with Update, and then injecting into C
type PerformQuery<C extends Context, U extends object> = U extends unknown
    ? FilteredContext<C, Update & U>
    : never;
type PerformQueryCore<U extends object> = U extends unknown
    ? FilteredContextCore<Update & U>
    : never;

// set the given update into a given context object, and adjust the aliases
type FilteredContext<C extends Context, U extends Update> =
    & C
    & FilteredContextCore<U>;

// generate a structure with all aliases for a narrowed update
type FilteredContextCore<U extends Update> =
    & Record<"update", U>
    & AliasProps<Omit<U, "update_id">>
    & Shortcuts<U>;

// helper type to infer shortcuts on context object based on present properties,
// must be in sync with shortcut impl!
interface Shortcuts<U extends Update> {
    msg: [U["callback_query"]] extends [object] ? U["callback_query"]["message"]
        : [U["message"]] extends [object] ? U["message"]
        : [U["edited_message"]] extends [object] ? U["edited_message"]
        : [U["channel_post"]] extends [object] ? U["channel_post"]
        : [U["edited_channel_post"]] extends [object] ? U["edited_channel_post"]
        : undefined;
    chat: [U["callback_query"]] extends [object]
        ? NonNullable<U["callback_query"]["message"]>["chat"] | undefined
        : [Shortcuts<U>["msg"]] extends [object] ? Shortcuts<U>["msg"]["chat"]
        : [U["my_chat_member"]] extends [object] ? U["my_chat_member"]["chat"]
        : [U["chat_member"]] extends [object] ? U["chat_member"]["chat"]
        : [U["chat_join_request"]] extends [object]
            ? U["chat_join_request"]["chat"]
        : undefined;
    senderChat: [Shortcuts<U>["msg"]] extends [object]
        ? Shortcuts<U>["msg"]["sender_chat"]
        : undefined;
    from: [U["callback_query"]] extends [object] ? U["callback_query"]["from"]
        : [U["inline_query"]] extends [object] ? U["inline_query"]["from"]
        : [U["shipping_query"]] extends [object] ? U["shipping_query"]["from"]
        : [U["pre_checkout_query"]] extends [object]
            ? U["pre_checkout_query"]["from"]
        : [U["chosen_inline_result"]] extends [object]
            ? U["chosen_inline_result"]["from"]
        : [U["message"]] extends [object] ? NonNullable<U["message"]["from"]>
        : [U["edited_message"]] extends [object]
            ? NonNullable<U["edited_message"]["from"]>
        : [U["my_chat_member"]] extends [object] ? U["my_chat_member"]["from"]
        : [U["chat_member"]] extends [object] ? U["chat_member"]["from"]
        : [U["chat_join_request"]] extends [object]
            ? U["chat_join_request"]["from"]
        : undefined;
    // inlineMessageId: disregarded here because always optional on both types
}
