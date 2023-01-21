<template>
  <div class="table-container">
    <h3>Top {{ rank }} Malicious Domains:</h3>
    <div class="table-row">
      <table class="table">
        <tr>
          <th class="table-cell-left">Domain</th>
          <th class="table-cell-right">% of threats</th>
          <th class="table-cell-right"># of threats</th>
        </tr>
        <tr v-for="data in threatsData" :key="data.domain">
          <td class="table-cell-left">{{ data.domain }}</td>
          <td class="table-cell-right">{{ data.threatsPercentage }}%</td>
          <td class="table-cell-right">{{ data.threatsCount }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopThreatTable",
  props: {
    data: {},
  },
  computed: {
    rank() {
      return 5;
    },
    threatsData() {
      return this.processThreats(this.data);
    },
  },
  methods: {
    processThreats(data) {
      let domainMap = {};
      data.forEach((record) => {
        let domain = record.from.split("@")[1];
        if (domainMap[domain] !== undefined) {
          domainMap[domain]++;
        } else {
          domainMap[domain] = 0;
        }
      });

      const totalThreats = Object.values(domainMap).reduce((a, b) => a + b, 0);

      let sortedThreat = [];
      for (let domain in domainMap) {
        sortedThreat.push({
          domain: domain,
          threatsPercentage: this.percentage(domainMap[domain], totalThreats),
          threatsCount: domainMap[domain],
        });
      }

      sortedThreat.sort((a, b) => {
        a.threatsCount - b.threatsCount;
      });

      return sortedThreat.sort((a, b) => {
        return b.threatsCount - a.threatsCount;
      }).slice(0, this.rank);
    },
    percentage(partialValue, totalValue) {
      return Math.round((100 * partialValue) / totalValue);
    },
  },
};
</script>

<style scoped>
.table-container {
  border: solid black;
  border-radius: 5px;
  padding: 30px;
}
.table {
  width: 100%;
}
.table-row {
  display: flex;
}
.table-cell-right {
  text-align: right;
}
.table-cell-left {
  text-align: left;
}
</style>
