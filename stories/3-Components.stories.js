import App from '../src/components/bs-lines/App.vue';
import { GetData, AddData } from '../src/components/bs-lines/GetData';

import slTree from '../src/components/bs-tree/index';

export default {
  title: 'Components',
};

export const Lines = () => ({
  components: { App },
  template: '<app :init-data="GetData" ref="app"></app>',
  data() {
    return {
      GetData,
    };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.app.dataAdd(AddData);
    }, 5000);
  },
});


export const Tree = () => ({
  components: { Tree: slTree },
  template: `
    <tree
      :tree-data="treeData"
      :height="height"
      @check-refresh="onclick"
      @select-click="onclick"
      :parent-click="false"
      :checked-list="checkedList"
      :can-checked="true"
      :leaf-drag="true"
    >
    </tree>`,
  data() {
    return {
      height: '900px',
      checkedList: ['0-0-0', '0-0-2-0'],
      treeData: [
        {
          title: '0',
          key: '0',
          children: [
            {
              title: '0-0',
              key: '0-0',
              children: [
                {
                  title: '0-0-0',
                  key: '0-0-0',
                  children: [
                    { title: '0-0-0-0', key: '0-0-0-0', children: [] },
                    { title: '0-0-0-1', key: '0-0-0-1', children: [] },
                    { title: '0-0-0-2', key: '0-0-0-2', children: [] },
                  ],
                },
                {
                  title: '0-0-1',
                  key: '0-0-1',
                  children: [
                    { title: '0-0-1-0', key: '0-0-1-0', children: [] },
                    { title: '0-0-1-1', key: '0-0-1-1', children: [] },
                    { title: '0-0-1-2', key: '0-0-1-2', children: [] },
                  ],
                },
                {
                  title: '0-0-2',
                  key: '0-0-2',
                  children: [
                    { title: '0-0-2-0', key: '0-0-2-0', children: [] },
                    { title: '0-0-2-1', key: '0-0-2-1', children: [] },
                  ],
                },
              ],
            },
            {
              title: '0-1',
              key: '0-1',
              children: [
                { title: '0-1-0-0', key: '0-1-0-0', children: [] },
                { title: '0-1-0-1', key: '0-1-0-1', children: [] },
                { title: '0-1-0-2', key: '0-1-0-2', children: [] },
              ],
            },
            {
              title: '0-2',
              key: '0-2',
              children: []
            },
          ]
        }
      ],
    }
  },
  mounted() {
    const _this = this;
    fetch('http://localhost:3001/data')
      .then((response) => response.json())
      .then((data) => {
        _this.treeData = _this.changeData(data)
        _this.checkedList = ['B6947_01_MDS_6KV_FM_12', "B6947_01_MDS_35KV_SUB_SHP47_03"];

        setTimeout(() => {
          _this.checkedList = ['B6947_01_MDS_6KV_FM_12'];
        }, 3000)
      })
  },
  methods: {
    changeData(array) {
      const temp = []
      if (array.length !== 0) {
        array.forEach((item) => {
          temp.push({
            title: item.text,
            key: item.id,
            children: this.changeData(item.items),
            props: item,
          })
        })
      }
      return temp
    },
    onclick(obj) {
      console.log(obj);
    },
  },
});
