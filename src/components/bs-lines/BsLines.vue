<template>
    <div>
        <div id="bs-lines-1">1</div>
        <div id="bs-lines-2"></div>
        <div id="bs-lines-3"></div>
    </div>
</template>

<script>
import G2 from '@antv/g2';
import _ from 'lodash';
import { DataSet } from '@antv/data-set';
import $ from 'jquery';
import GetData from './GetData';

export default {
  name: 'BsLines',
  data() {
    const self = this;

    const data = _.filter(GetData, (o) => o.type !== 'type0');
    const sliderData = _.filter(GetData, (o) => o.type === 'type0');
    const ds = new DataSet({
      state: {
        start: _.minBy(data, (o) => o.timestamp).timestamp,
        end: _.maxBy(data, (o) => o.timestamp).timestamp,
      },
    });
    const charts = [];
    let position = [200, 400];
    position = new Proxy(position, {
      get(target, key) {
        return target[key];
      },
      set(target, key, value) {
        _.debounce(() => {
          self.getLine();
        }, 50)();
        return Reflect.set(target, key, value);
      },
    });

    return {
      data, ds, sliderData, charts, position,
    };
  },
  computed: {},
  methods: {
    getDv({ ds, data }) {
      return ds.createView().source(data).transform({
        type: 'sort',
        callback(a, b) {
          return a.timestamp - b.timestamp;
        },
      });
    },
    // 画竖线
    getLine() {
      // debugger;
      _.forEach(this.charts, (chart) => {
        chart.guide().clear();
        _.forEach(this.position, (item) => {
          // eslint-disable-next-line no-underscore-dangle
          const tmp = chart.getSnapRecords({ x: item, y: 0 })[0]._origin;
          chart.guide().line({
            start: () => [tmp.timestamp, 'start'],
            end: () => [tmp.timestamp, 'end'],
          });
          chart.guide().text({
            top: true,
            position: () => [tmp.timestamp, 'median'],
            content: tmp.value,
          });
          chart.repaint();
        });
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 获取并分类数据
      console.log(GetData);
      console.log(_.groupBy(this.data, 'type'));

      const {
        ds, getDv, sliderData, getLine, charts, position,
      } = this;

      const container = document.getElementById('bs-lines-2');

      // 创建slider
      const setSlider = () => {
        const canvasDiv = document.createElement('div');
        canvasDiv.id = 'bs-lines-2-slider';
        container.appendChild(canvasDiv);
        const chart = new G2.Chart({
          container: 'bs-lines-2-slider',
        });
        chart.scale('timestamp', {
          type: 'time',
          range: [0, 1],
          mask: 'YYYY-MM-DD HH:mm:ss SSS',
        });
        chart.scale('value', {
          type: 'linear',
          tickCount: 2,
        });
        chart.interact('slider', {
          container: 'bs-lines-3',
          start: ds.state.start,
          end: ds.state.end,
          xAxis: 'timestamp',
          yAxis: 'value',
          width: 800,
          padding: [10, 50, 10, 50],
          data: sliderData,
          backgroundChart: {
            type: 'line',
            color: 'grey',
          },
          onChange({ startValue, endValue }) {
            ds.setState('start', startValue);
            ds.setState('end', endValue);
          },
        });
        $('#bs-lines-2-slider').css('display', 'none');
      };
      setSlider();

      // 画多个折线图
      _.forEach(_.groupBy(this.data, 'type'), (data, index) => {
        const canvasDiv = document.createElement('div');
        canvasDiv.id = `bs-lines-2-${index}`;
        container.appendChild(canvasDiv);
        const chart = new G2.Chart({
          container: `bs-lines-2-${index}`,
          width: 800,
          height: 100,
          padding: [5, 50, 5, 50],
        });
        charts.push(chart);
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

        // 填充数据并画线
        const dv = getDv({ ds, data });
        dv.transform({
          type: 'filter',
          callback(row) {
            return row.timestamp >= ds.state.start && row.timestamp <= ds.state.end;
          },
        });
        chart.source(dv);
        chart.line().position('timestamp*value');
        chart.render();
      });

      position[0] = 50;
      getLine(charts);
    });
  },
};
</script>

<style scoped>

</style>
