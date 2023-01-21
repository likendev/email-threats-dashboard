<template>
  <div class="threats-info-card" >
    <h1 class="threats-count" :class="severityClass">
      {{ threatsCount }}
    </h1>
    <div class="threats-label">
      {{ threatsCategoryLabel }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ThreatsInfo",
  props: {
    threatsCategory: { type: String, required: true },
    threatsData: { type: Array, required: true },
    severity: { type: Number, required: true },
  },
  computed: {
    threatsCount() {
      return this.threatsData.length;
    },
    threatsCategoryLabel() {
      return this.threatsCategory === "SPAM"
        ? "Spam Messages"
        : "High Severity Threats";
    },
    severityClass() {
      switch (this.severity) {
        case 1:
          return "danger";
        case 2:
          return "medium";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped type="scss">
.threats-info-card {
  border: solid;
  border-color: black;
  border-radius: 5px;
  text-align: center;
  padding: 30px;
  width: 100%;
}
.danger {
  color: red;
}
.medium {
  color: orange;
}
</style>
