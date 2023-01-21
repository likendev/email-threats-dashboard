<template>
  <div class="dashboard-container">
    <div class="customer-info-container">
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
    </div>

    <div v-if="processedData.length === 0">
      <div class="threats-info-container">
        <threats-info
          :threats-category="`HIGH_SEVERE`"
          :threats-data="[]"
          :severity="1"
        />
        <threats-info
          :threats-category="`SPAM`"
          :threats-data="[]"
          :severity="2"
        />
      </div>
    </div>
    <div v-else>
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

    <div>
      <top-threat-table :data="allMessages" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ThreatsInfo from "@/components/ThreatsInfo";
import TopThreatTable from "@/components/TopThreatTable";

export default {
  name: "EmailDashboard",
  components: { TopThreatTable, ThreatsInfo },
  data() {
    return {
      selectedCustomer: 0,
      customerMessages: [],
      allMessages: [],
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

    let customers = this.$store.getters.getCustomersInfo;
    customers.forEach((customer) => {
      let url = `https://abnormalsecurity-public.s3.amazonaws.com/fe_dashboard/${customer.id}/messages.json`;
      axios
        .get(url)
        .then((response) => {
          this.allMessages = this.allMessages.concat(response.data);
          let messageArr = this.processMessage(response.data);
          this.$store.dispatch("initializeMessageData", {
            id: customer.id,
            data: messageArr,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  methods: {
    handleSelectionChange() {
      if (this.selectedCustomer === 0) {
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
            let messageArr = this.processMessage(response.data);
            this.$store.dispatch("updateMessagesData", messageArr);
            this.customerMessages = messageArr;
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

        messageArr = this.sortArr(messageArr);

        return messageArr;
      }
    },
    sortArr(data) {
      return data.sort((a, b) => {
        a.severity - b.severity;
      });
    },
  },
};
</script>

<style type="scss" scoped>
.customer-info-container {
  margin-bottom: 30px;
}
.threats-info-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
</style>
