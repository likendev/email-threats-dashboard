<template>
  <div class="dashboard-container">
    <h3>Customer:</h3>
    <select v-model="selectedCustomer" @change="handleSelectionChange">
      <option disabled value="0">please select</option>
      <option
        v-for="customer in customersInfo"
        :key="customer.id"
        :value="customer.id"
      >
        {{ customer.name }}
      </option>
    </select>

    <div class="threats-info-container">
      <div v-for="data in processedData" :key="data.severity">
        <threats-info
          :threats-category="data.type"
          :threats-data="data.data"
          :severity="data.severity"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ThreatsInfo from "@/components/ThreatsInfo";

export default {
  name: "EmailDashboard",
  components: { ThreatsInfo },
  data() {
    return {
      selectedCustomer: 0,
      customerMessages: [],
    };
  },
  computed: {
    processedData() {
      return this.customerMessages;
    },
    customersInfo() {
      return this.$store.getters.getCustomersInfo;
    },
  },
  async created() {
    await axios
      .get(
        "https://abnormalsecurity-public.s3.amazonaws.com/fe_dashboard/customers.json"
      )
      .then((response) => {
        this.$store.dispatch("setCustomers", response.data);
      });
  },
  methods: {
    handleSelectionChange() {
      if(this.selectedCustomer === 0) {
        return;
      } else {
        this.$store.dispatch("setSelectedCustomers", this.selectedCustomer);
        if (this.$store.getters.getMessages(this.selectedCustomer)) {
          this.customerMessages = this.$store.getters.getMessages(
            this.selectedCustomer
          );
        } else {
          let url = `https://abnormalsecurity-public.s3.amazonaws.com/fe_dashboard/${this.selectedCustomer}/messages.json`;
          axios.get(url).then((response) => {
            this.processMessage(response.data);
          });
        }
      }
    },
    processMessage(messageData) {
      if (Array.isArray(messageData)) {
        let spamMessage = messageData.filter((message) => {
          return message.attackType === "SPAM";
        });

        let highSeverity = messageData.filter((message) => {
          return message.attackType !== "SPAM";
        });

        let messageArr = [];
        messageArr.push({
          type: "HIGH_SEVERE",
          severity: 1,
          data: highSeverity,
        });
        messageArr.push({
          type: "SPAM",
          severity: 2,
          data: spamMessage,
        });

        messageArr = this.sortArr(messageArr)

        this.$store.dispatch("updateMessagesData", messageArr);
        this.customerMessages = messageArr;
      }
    },
    sortArr(data) {
      return data.sort((a, b) => {
        a.severity - b.severity;
      });
    }
  },
};
</script>

<style type="scss" scoped>
.threats-info-container {
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  width: 100%;
}
</style>
