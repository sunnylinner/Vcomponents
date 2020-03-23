<template>
    <div id="bs-lines">
        <div id="bs-lines-1">
            <a-slider range :defaultValue="defaultValue" @afterChange="onAfterChange"/>
        </div>
        <div style="position: relative;">
            <div id="bs-lines-2" style="display: inline-block;"></div>
            <div id="bs-lines-4"
                 style="display: inline-block;height: 100%;position: absolute;margin: -6px 0;">
                <a-slider vertical v-model="yValue0"
                          style="display: inline-block;" @afterChange="onYValueChange"/>
                <a-slider vertical v-model="yValue1"
                          style="display: inline-block;" @afterChange="onYValueChange"/>
            </div>
        </div>
        <div id="bs-lines-3"></div>
    </div>
</template>

<script>
import G2 from '@antv/g2';
import _ from 'lodash';
import { DataSet } from '@antv/data-set';
import $ from 'jquery';
import Vue from 'vue';
import { Slider } from 'ant-design-vue';
import GetData from './GetData';

Vue.use(Slider);

export default {
  name: 'BsLines',
  // components: {
  //   [Slider.name]: Slider,
  // },
  data() {
    const self = this;

    // 折线图数据
    const data = _.filter(GetData, (o) => o.type !== 'type0');
    // slider数据
    const sliderData = _.filter(GetData, (o) => o.type === 'type0');
    // 折线图数据依赖同一个DataSet
    const ds = new DataSet({
      state: {
        start: _.minBy(data, (o) => o.timestamp).timestamp,
        end: _.maxBy(data, (o) => o.timestamp).timestamp,
      },
    });
    // 折线图们chart合集
    const charts = [];
    // 当前选中的折线图
    let currentChart;
    // 竖线的坐标
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
    // 竖线初始坐标转换成横向滑动坐标
    const defaultValue = [
      ((position[0] - 50) / 700) * 100,
      ((position[1] - 50) / 700) * 100,
    ];
    // 竖线滑动坐标绑定值
    const yValue0 = 50;
    const yValue1 = 50;
    // 折线图的容器
    let container;

    return {
      data,
      ds,
      sliderData,
      charts,
      position,
      defaultValue,
      currentChart,
      yValue0,
      yValue1,
      container,
    };
  },
  methods: {
    /**
     * 根据传入数据，新建获取DataView
     * @param ds 共用DataSet
     * @param data 传入数组数据
     * @returns {number|View} 新建DataView
     */
    getDv({ ds, data }) {
      return ds.createView().source(data).transform({
        type: 'sort',
        callback(a, b) {
          return a.timestamp - b.timestamp;
        },
      });
    },
    /**
     * 画竖线
     */
    getLine() {
      _.forEach(this.charts, ({ chart }) => {
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
            position: () => [tmp.timestamp,
              (chart.getYScales()[0].min * 1 + chart.getYScales()[0].max * 1) / 2],
            content: tmp.value,
          });
          chart.repaint();
        });
      });
    },
    /**
     * 画下方x轴 slider
     */
    setSlider() {
      const {
        ds, sliderData, getLine, container,
      } = this;
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
          _.debounce(() => {
            getLine();
          }, 50)();
        },
        handleStyle: {
          // img: `${process.env.BASE_URL}/slider.png`,
          img: 'https://gw.alipayobjects.com/zos/rmsportal/QXtfhORGlDuRvLXFzpsQ.png',
          width: 5,
        },
      });
      $('#bs-lines-2-slider').css('display', 'none');
    },
    /**
     * 绘画多个折线图
     */
    setCharts() {
      const self = this;
      _.forEach(_.groupBy(self.data, 'type'), (data, index) => {
        // chart基本设置
        const canvasDiv = document.createElement('div');
        canvasDiv.id = `bs-lines-2-${index}`;
        canvasDiv.className = 'bs-lines-2';
        self.container.appendChild(canvasDiv);
        const chart = new G2.Chart({
          container: `bs-lines-2-${index}`,
          width: 800,
          height: 100,
          padding: [5, 50, 5, 50],
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
        const dv = self.getDv({ ds: self.ds, data });
        dv.transform({
          type: 'filter',
          callback(row) {
            return row.timestamp >= self.ds.state.start && row.timestamp <= self.ds.state.end;
          },
        });
        const min = _.minBy(data, (o) => o.value).value;
        const max = _.maxBy(data, (o) => o.value).value;
        self.charts.push({
          chart, min, max, yArray: [50, 50],
        });
        chart.source(dv);
        chart.line().position('timestamp*value');
        chart.render();
        self.changeY({ chart, min, max });
        $(`#bs-lines-2-${index}`).css({ margin: '-2px', 'box-shadow': '0 0 5px white' });
        chart.on('mouseup', () => {
          self.currentChart = chart;
          $('.bs-lines-2').css({ 'box-shadow': '0 0 5px white' });
          $(`#bs-lines-2-${index}`).css({ 'box-shadow': '0 0 5px red' });

          const { yArray } = _.find(self.charts,
            (chartObject) => chartObject.chart === self.currentChart);
          [self.yValue0, self.yValue1] = yArray;
        });
      });
    },
    /**
     * 改变y轴显示区间
     * @param chart 目前chart对象
     * @param max y轴显示最大值
     * @param min y轴显示最小值
     */
    changeY({ chart, max, min }) {
      const currentMax = _.max([(max * 1) / 0.85, (max * 1) * 0.85]);
      const currentMin = _.min([(min * 1) / 0.85, (min * 1) * 0.85]);
      chart.scale('value', {
        type: 'linear',
        tickCount: 2,
        ticks: [currentMax, currentMin],
        formatter: (value) => value,
        nice: false,
        max: currentMax,
        min: currentMin,
      });
      chart.repaint();
    },
    /**
     * 横向滑动结束触发事件
     * @param value 横向滑动坐标值
     */
    onAfterChange(value) {
      this.position[0] = (value[0] / 100) * 700 + 50;
      this.position[1] = (value[1] / 100) * 700 + 50;
    },
    /**
     * 竖向滚动结束触发事件
     */
    onYValueChange() {
      const y1 = this.yValue0;
      const y2 = this.yValue1;
      if (this.currentChart !== undefined) {
        const index = _.findIndex(this.charts,
          (chartObject) => chartObject.chart === this.currentChart);
        const { chart, min, max } = this.charts[index];
        let difference;
        let newMin;
        let newMax;
        difference = ((y1 / 50) * (max - min)) / 2;
        newMin = (max * 1 + min * 1) / 2 - difference;
        newMax = (max * 1 + min * 1) / 2 + difference;

        difference = (y2 / 50 - 1) * (max - min);
        newMin += difference;
        newMax += difference;
        this.charts[index].yArray = [y1, y2];
        this.changeY({ chart, min: newMin, max: newMax });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.container = document.getElementById('bs-lines-2');
      this.setSlider();
      this.setCharts();
    });
  },
};
</script>

<style scoped lang="scss">
#bs-lines {
    padding: 10px;
}
#bs-lines-1 {
    & {
        width: 800px;
        padding: 0 50px;
    }
}
</style>
