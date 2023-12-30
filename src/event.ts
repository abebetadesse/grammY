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

declare const up: Update;

export class UpdateEvent implements RenamedUpdate {
    public message: Update["message"] = up.message;
    public editedMessage: Update["edited_message"] = up.edited_message;
    public channelPost: Update["channel_post"] = up.channel_post;
    public editedChannelPost: Update["edited_channel_post"] =
        up.edited_channel_post;
    public messageReaction: Update["message_reaction"] = up.message_reaction;
    public messageReactionCount: Update["message_reaction_count"] =
        up.message_reaction_count;
    public inlineQuery: Update["inline_query"] = up.inline_query;
    public chosenInlineResult: Update["chosen_inline_result"] =
        up.chosen_inline_result;
    public callbackQuery: Update["callback_query"] = up.callback_query;
    public shippingQuery: Update["shipping_query"] = up.shipping_query;
    public preCheckoutQuery: Update["pre_checkout_query"] =
        up.pre_checkout_query;
    public poll: Update["poll"] = up.poll;
    public pollAnswer: Update["poll_answer"] = up.poll_answer;
    public myChatMember: Update["my_chat_member"] = up.my_chat_member;
    public chatMember: Update["chat_member"] = up.chat_member;
    public chatJoinRequest: Update["chat_join_request"] = up.chat_join_request;
    public chatBoost: Update["chat_boost"] = up.chat_boost;
    public removedChatBoost: Update["removed_chat_boost"] =
        up.removed_chat_boost;
}
