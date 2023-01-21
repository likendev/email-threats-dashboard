<template>
  <div class="dashboard-container">
    <div v-for="data in processedData" :key="data.severity">
      <threats-info
        :threats-category="data.type"
        :threats-data="data.data"
        :severity="data.severity"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ThreatsInfo from "@/components/ThreatsInfo";

export default {
  name: "EmailDashboard",
  components: { ThreatsInfo },
  computed: {
    processedData() {
      return this.processData(this.$store.getters.getMessages);
    },
  },
  async created() {
    await axios
      .get(
        "https://abnormalsecurity-public.s3.amazonaws.com/fe_dashboard/adams_keeling/messages.json"
      )
      .then((response) => {
        this.$store.dispatch("updateMessagesData", response.data);
      });
  },
  methods: {
    processData(messageData) {
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

        return messageArr.sort((a, b) => {
          a.severity - b.severity;
        });
      }
    },
  },
};
</script>

<style type="scss" scoped>
.dashboard-container {
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  width: 100%;
}
</style>