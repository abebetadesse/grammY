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

declare const up: Update;

export class UpdateEvent implements Omit<Update, "update_id"> {
    public message: Update["message"] = up.message;
    public edited_message: Update["edited_message"] = up.edited_message;
    public channel_post: Update["channel_post"] = up.channel_post;
    public edited_channel_post: Update["edited_channel_post"] =
        up.edited_channel_post;
    public message_reaction: Update["message_reaction"] = up.message_reaction;
    public message_reaction_count: Update["message_reaction_count"] =
        up.message_reaction_count;
    public inline_query: Update["inline_query"] = up.inline_query;
    public chosen_inline_result: Update["chosen_inline_result"] =
        up.chosen_inline_result;
    public callback_query: Update["callback_query"] = up.callback_query;
    public shipping_query: Update["shipping_query"] = up.shipping_query;
    public pre_checkout_query: Update["pre_checkout_query"] =
        up.pre_checkout_query;
    public poll: Update["poll"] = up.poll;
    public poll_answer: Update["poll_answer"] = up.poll_answer;
    public my_chat_member: Update["my_chat_member"] = up.my_chat_member;
    public chat_member: Update["chat_member"] = up.chat_member;
    public chat_join_request: Update["chat_join_request"] =
        up.chat_join_request;
    public chat_boost: Update["chat_boost"] = up.chat_boost;
    public removed_chat_boost: Update["removed_chat_boost"] =
        up.removed_chat_boost;
}
