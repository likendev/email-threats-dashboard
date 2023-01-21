import { createStore } from "vuex";

export default createStore({
    state: {
        messages: {},
        customers: {},
    },
    mutations: {
        setMessagesData(state, data) {
            state.messages = data;
        },
        setCustomers(state, data) {
            state.customers = data;
        },
    },
    actions: {
        updateMessagesData(context, data) {
            context.commit("setMessagesData", data);
        },
        setCustomers(context, data) {
            context.commit("setCustomers", data);
        },
    },
    getters: {
        getMessages(state) {
            return state.messages;
        }
    },
});
