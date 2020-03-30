<template>
    <div ref="container" :style="style"></div>
</template>

<script>
import G2 from '@antv/g2';
import _ from 'lodash';
import $ from 'jquery';

export default {
  name: 'BsLine',
  props: {
    data: {
      type: Array,
    },
    ds: {
      type: Object,
    },
    getDv: {
      type: Function,
    },
    changeY: {
      type: Function,
    },
    currentChart: {
      type: Object,
    },
  },
  data() {
    return {
      chart: {},
    };
  },
  computed: {
    style() {
      if (this.currentChart.chart && this.currentChart.chart === this.chart) {
        return {
          'box-shadow': '0 0 5px red',
        };
      }
      return {
        'box-shadow': '0 0 5px white',
      };
    },
  },
  methods: {
    setChart() {
      const {
        getDv, ds, data, changeY,
      } = this;
      const chart = new G2.Chart({
        container: this.$refs.container,
        forceFit: true,
        height: 100,
        padding: [5, 50, 5, 50],
      });
      this.chart = chart;
      chart.scale('timestamp', {
        type: 'time',
        range: [0, 1],
        mask: 'YYYY-MM-DD HH:mm:ss SSS',
      });
      chart.scale('value', {
        type: 'linear',
        tickCount: 2,
      });
      chart.axis('timestamp', {
        line: {
          stroke: '#d9d9d9',
          lineWidth: 1,
          lineDash: [4, 4],
        },
        tickLine: {
          length: 0,
        },
      });
      chart.axis('value', {
        grid: {
          type: 'line',
          lineStyle: {
            stroke: '#d9d9d9',
            lineWidth: 1,
            lineDash: [4, 4],
          },
          align: 'middle', // 网格顶点从两个刻度中间开始
        },
        label: {
          textStyle: {
            fontSize: 10,
            fill: '#aaaaaa',
          },
        },
      });

      const dv = getDv({ ds, data });
      dv.transform({
        type: 'filter',
        callback(row) {
          return row.timestamp >= ds.state.start && row.timestamp <= ds.state.end;
        },
      });
      const min = _.minBy(data, (o) => o.value).value;
      const max = _.maxBy(data, (o) => o.value).value;

      this.$emit('charts-push', {
        chart, min, max, yArray: [50, 50],
      });
      chart.source(dv);
      chart.line().position('timestamp*value');
      chart.render();
      changeY({ chart, min, max });
      $(this.$refs.container).css({ margin: '-2px' });
      chart.on('mouseup', () => {
        this.$emit('mouseup', { chart, chartElement: this.$refs.container });
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setChart();
    });
  },
};
</script>

<style scoped>

</style>
