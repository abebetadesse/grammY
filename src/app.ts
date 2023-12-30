export interface Update {
    update_id: number;

    message?: { message: string };
    edited_message?: { edited_message: string };
    channel_post?: { channel_post: string };
    edited_channel_post?: { edited_channel_post: string };
    message_reaction?: { message_reaction: string };
    message_reaction_count?: { message_reaction_count: string };
    inline_query?: { inline_query: string };
    chosen_inline_result?: { chosen_inline_result: string };
    callback_query?: { callback_query: string };
    shipping_query?: { shipping_query: string };
    pre_checkout_query?: { pre_checkout_query: string };
    poll?: { poll: string };
    poll_answer?: { poll_answer: string };
    my_chat_member?: { my_chat_member: string };
    chat_member?: { chat_member: string };
    chat_join_request?: { chat_join_request: string };
    chat_boost?: { chat_boost: string };
    removed_chat_boost?: { removed_chat_boost: string };
}

type FilterFunction<U extends Update, V extends U> = (up: U) => up is V;

export function matchFilter<U extends Update, Q extends FilterQuery>(
    filter: Q | Q[],
): FilterFunction<U, Filter<U, Q>> {
    console.log("Matching", filter);
    return (up: U): up is Filter<U, Q> => !!up;
}

/** All valid filter queries (every update key except update_id) */
export type FilterQuery = keyof Omit<Update, "update_id">;

/** Narrow down an update object based on a filter query */
export type Filter<U extends Update, Q extends FilterQuery> = PerformQuery<
    U,
    RunQuery<Q>
>;

// generate an object structure that can be intersected with updates to narrow them down
type RunQuery<Q extends string> = Combine<L1Fragment<Q>, Q>;

// maps each part of the filter query to Record<"key", object>
type L1Fragment<Q extends string> = Q extends unknown ? Record<Q, object>
    : never;
// define all other fields from query as keys with value `undefined`
type Combine<U, K extends string> = U extends unknown
    ? U & Partial<Record<Exclude<K, keyof U>, undefined>>
    : never;

// apply a query result by intersecting it with update,
// and then using these values to override the actual update
type PerformQuery<U extends Update, R extends object> = R extends unknown
    ? FilteredEvent<U, Update & R>
    : never;

// narrow down an update by intersecting it with a different update
type FilteredEvent<E extends Update, U extends Update> =
    & E
    & Omit<U, "update_id">;

type Middleware<U extends Update> = (ctx: U) => unknown | Promise<unknown>;
class EventHub<U extends Update> {
    use(...middleware: Array<Middleware<U>>): EventHub<U> {
        console.log("Adding", middleware.length, "generic handlers");
        return this;
    }
    on<Q extends FilterQuery>(
        filter: Q | Q[],
        ...middleware: Array<Middleware<Filter<U, Q>>>
    ): EventHub<Filter<U, Q>> {
        console.log("Adding", middleware.length, "handlers for", filter);
        return new EventHub<Filter<U, Q>>();
    }
}

const hub = new EventHub();

const c = hub.on(["message", "channel_post"]).on("message");
c.use(() => {});

hub.on(["message", "channel_post"], (event) => {});
const filter: FilterQuery[] = [
    "message",
    "callback_query",
    "edited_message",
];
hub.on(filter);
hub.on(filter, (event) => {});
hub.on(filter, async (event) => {});

hub.on("message", async (event) => {});

hub.on(
    "chat_join_request",
    (event) => event.chat_join_request.chat_join_request,
);

hub.on(["message", "channel_post"], async (event) => {
    // const x: undefined = event.callback_query;
    // const y: object = event.message ?? event.channel_post;
    await 0;
});

hub.on<"message" | "channel_post">("message", async (event) => {
    // const x: undefined = event.callback_query;
    // const y: object = event.message ?? event.channel_post;
    await 0;
});

const x = hub.on(["message", "channel_post"], () => {});
x.use(() => {});

hub.on("message", (event) => Promise.resolve());
hub.on("message_reaction", (event) => Promise.resolve());

hub.on("removed_chat_boost", (event) => {});
