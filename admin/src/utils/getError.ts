import { getMessage, MessageInput } from "./getMessage";

export const getError = (messageKey?: string) => {
    if (messageKey) {
        return getMessage(messageKey as MessageInput);
    }
    return '';
};