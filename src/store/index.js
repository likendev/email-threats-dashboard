import { createStore } from "vuex";

export default createStore({
  state: {
    messages: {},
    customers: {},
    selectedCustomers: "",
  },
  mutations: {
    setMessagesData(state, data) {
      state.messages[state.selectedCustomers] = data;
    },
    setCustomers(state, data) {
      state.customers = data;
    },
    setSelectedCustomers(state, data) {
      const found = state.customers.some((customer) => customer.id === data);
      if (found) {
        state.selectedCustomers = data;
      }
    },
  },
  actions: {
    updateMessagesData(context, data) {
      context.commit("setMessagesData", data);
    },
    setCustomers(context, data) {
      context.commit("setCustomers", data);
    },
    setSelectedCustomers(context, data) {
      context.commit("setSelectedCustomers", data);
    },
  },
  getters: {
    getMessages: (state) => (id) => {
      return state.messages[id];
    },
    getCustomersInfo(state) {
      return state.customers;
    },
  },
});
