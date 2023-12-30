import type { AliasProps, Update, UpdateEvent } from "./event.ts";

type FilterFunction<C extends UpdateEvent, D extends C> = (ctx: C) => ctx is D;

export function matchFilter<E extends UpdateEvent, Q extends FilterQuery>(
    filter: Q | Q[],
): FilterFunction<E, Filter<E, Q>> {
    console.log("Matching", filter);
    return (event: E): event is Filter<E, Q> => !!event;
}

/** All valid filter queries (every event type except update_id) */
export type FilterQuery = keyof Omit<Update, "update_id">;

/** Narrow down an event object based on a filter query */
export type Filter<E extends UpdateEvent, Q extends FilterQuery> = PerformQuery<
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
type PerformQuery<E extends UpdateEvent, U extends object> = U extends unknown
    ? FilteredEvent<E, Update & U>
    : never;

// set the given update into a given event object, and adjust the aliases
type FilteredEvent<E extends UpdateEvent, U extends Update> =
    & E
    & FilteredEventCore<U>;

// generate a structure with all aliases for a narrowed update
type FilteredEventCore<U extends Update> =
    & Record<"update", U>
    & AliasProps<Omit<U, "update_id">>;

type Middleware<C extends UpdateEvent> = (ctx: C) => unknown | Promise<unknown>;
class EventHub<C extends UpdateEvent> {
    use(...middleware: Array<Middleware<C>>): EventHub<C> {
        console.log("Adding", middleware.length, "generic handlers");
        return this;
    }
    on<Q extends FilterQuery>(
        filter: Q | Q[],
        ...middleware: Array<Middleware<Filter<C, Q>>>
    ): EventHub<Filter<C, Q>> {
        console.log("Adding", middleware.length, "handlers for", filter);
        return new EventHub<Filter<C, Q>>();
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

hub.on("chat_join_request", (event) => event.chatJoinRequest.chat_join_request);
hub.on(
    "chat_join_request",
    (event) => event.update.chat_join_request.chat_join_request,
);

hub.on<"message" | "channel_post">("message", async (event) => {
    await 0;
});

const x = hub.on(["message", "channel_post"], () => {});
x.use(() => {});

hub.on("message", (event) => Promise.resolve());
hub.on("message_reaction", (event) => Promise.resolve());

hub.on("removed_chat_boost", (event) => {});
