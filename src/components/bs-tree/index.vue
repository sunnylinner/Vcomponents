/**
  带勾选框的虚拟树结构
 */

<template>
  <div
    ref="scrollDom"
    :style="{
      height: height
    }"
    class="sl-tree-container"
    @scroll="scroll"
  >
    <div
      :style="{
        height: dataList.length * 33 + 'px'
      }"
    ></div>
    <ul :style="{ top: startIndex * 33 + 'px' }">
      <template v-for="(item, index) in splitDataList">
        <li v-if="isShow(item)" :key="index">
          <div class="sl-tree-row">
            <template v-if="item.level > 0">
              <span
                v-for="(blank, blank_index) in new Array(item.level - 1)"
                :key="blank_index"
                class="sl-tree-vertical"
                :class="{
                  'sl-tree-vertical-half': item.retract.includes(blank_index + 1)
                }"
              >
              </span>
              <span
                class="sl-tree-vertical"
                :class="{
                  'sl-tree-vertical-half': isLast(item),
                }"
              >
              </span>
            </template>
            <span
              v-if="item.children.length !== 0"
              class="sl-tree-checkbox"
              :class="{
                'sl-tree-switch-close': !item.showChildren,
                'sl-tree-switch-open': item.showChildren
              }"
              @click="onSwitch(item)"
            >
              <span v-if="item.level !== 0" class="sl-tree-polyLine"></span>
              <span v-if="item.level === 0" style="display: inline-block;"></span>
              <span class="sl-tree-checkbox-inner"></span>
            </span>
            <span v-else class="sl-tree-line">
              <span v-if="item.level !== 0" class="sl-tree-polyLine"></span>
              <span class="sl-tree-line-inner"></span>
            </span>
            <span class="sl-tree-checkbox">
              <span
                class="sl-tree-checkbox-inner"
                :class="{
                  'sl-tree-checkbox-0': item.checked === '0',
                  'sl-tree-checkbox-1': item.checked === '1',
                  'sl-tree-checkbox-2': item.checked === '2'
                }"
                @click="checkClick(item)"
              ></span>
            </span>
            <span class="sl-tree-title" @click="selectClick(item)" draggable="true">{{ item.title }}</span>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Virtual",
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: () => "400px"
    },
    parentClick: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      dataList: [],
      limitCount: 15,
      startIndex: 0
    };
  },
  computed: {
    splitDataList() {
      return _.filter(this.dataList, (o) => {
        return this.isShow(o)
      }).slice(this.startIndex, this.startIndex + this.limitCount);
    }
  },
  watch: {
    treeData: {
      handler(newValue) {
        this.dataList = this.getList(newValue, 0, []);
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.scrollDom.offsetHeight === 0) {
        this.limitCount = Math.floor((this.height.slice(0, -2) * 1) / 33 + 2);
      } else {
        this.limitCount = Math.floor(this.$refs.scrollDom.offsetHeight / 33 + 2);
      }
    });
  },
  methods: {
    getList(array, level, retract, parent = []) {
      let target = [];
      array.forEach((item, index) => {
        const { title, key, children } = item;
        if (children === undefined || children.length === 0) {
          target.push({
            title,
            key,
            level,
            showChildren: true,
            children: [],
            retract,
            parent,
            checked: "0",
          });
        } else {
          if (array.length - 1 === index) {
            retract.push(level);
          }
          const obj = {};
          const list = this.getList(children, level + 1, [...retract], [...parent, obj]);
          target.push(
            Object.assign(obj, {
              title,
              key,
              level,
              showChildren: true,
              children: list,
              retract,
              parent,
              checked: "0",
            })
          );
          target = target.concat(list);
        }
      });
      return target;
    },
    onSwitch(item) {
      item.showChildren = !item.showChildren;
      this.dataList = [...this.dataList];
    },
    scroll() {
      const scrollTop = this.$refs.scrollDom.scrollTop;
      this.startIndex = Math.floor(scrollTop / 33);
    },
    selectClick(item) {
      this.$emit('select-click', {item})
    },
    checkClick(item) {
      if (item.children === undefined || item.children.length === 0) {
        this.changeChildNode(item, item.checked === "0" ? "1" : "0")
          .then(this.refreshParentsNode([item]))
          .then(() => {
            this.$emit("check-click", {
              checkeditems: this.getLeafChecked(this.dataList),
              item,
              checked: item.checked
            });
          });
      } else if (this.parentClick) {
        const promiseArray = [];
        item.children.forEach(child => {
          if (child.children === undefined || child.children.length === 0) {
            promiseArray.push(this.changeChildNode(child, item.checked === "1" ? "0" : "1"));
          }
        });
        Promise.all(promiseArray).then(items => {
          this.refreshParentsNode(items);
        });
      }
    },
    async changeChildNode(item, checked) {
      item.checked = checked;
      return await item;
    },
    refreshParentNode(item) {
      item.forEach(parent => {
        let isAll0 = true;
        let isAll1 = true;
        this.getRelChildren(parent).forEach(child => {
          if (isAll0 === false && isAll1 === false) {
            return false;
          }
          if (child.checked === "2") {
            isAll0 = false;
            isAll1 = false;
          } else if (child.checked === "0") {
            isAll1 = false;
          } else if (child.checked === "1") {
            isAll0 = false;
          }
        });
        if (isAll0) parent.checked = "0";
        else if (isAll1) parent.checked = "1";
        else parent.checked = "2";
      });
    },
    refreshParentsNode(items) {
      let nodes = [];
      items.forEach(item => {
        nodes.push(...item.parent);
      });
      nodes = _.orderBy(Array.from(new Set(nodes)), ["level"], ["desc"]);
      this.refreshParentNode(nodes);
    },
    getRelChildren(item) {
      return _.filter(item.children, {
        level: item.level + 1
      });
    },
    getLeaf(items) {
      return _.filter(items, o => o.children.length === 0);
    },
    getLeafChecked(items) {
      return _.filter(items, o => o.children.length === 0 && o.checked === "1");
    },
    getRelParent(item) {
      return item.parent[item.parent.length - 1];
    },
    isShow(item) {
      // return item.show;
      if (item.parent.length === 0) {
        return true;
      } else {
        const parent = this.getRelParent(item)
        return this.isShow(parent) && parent.showChildren
      }
    },
    isLast(item) {
      const children = this.getRelChildren(this.getRelParent(item))
      return item === children[children.length - 1]
    },
  }
};
</script>

<style lang="scss" scoped>
.sl-tree-container {
  overflow: auto;
  position: relative;
}

ul {
  position: absolute;
  list-style: none;
  user-select: none;
  margin: 0;
  padding: 0;
  font-size: 0;
}

.sl-tree-row {
  position: relative;
  height: 30px;
  display: flex;
}

.sl-tree-vertical {
  position: relative;
  display: inline-block;
  height: 24px;
  width: 24px;

  &::after {
    content: "";
    position: absolute;
    border-left: 1px solid #d9d9d9;
    height: 33px;
    top: -10px;
    left: 8px;
  }

  &.sl-tree-vertical-half {
    &::after {
      content: "";
      position: absolute;
      border-left: 1px solid #d9d9d9;
      height: 0px;
    }
  }
}

.sl-tree-polyLine {
  position: absolute;
  display: inline-block;
  width: 16px;
  height: 26px;
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  top: -10px;
  left: -16px;
}

.sl-tree-switch-close,
.sl-tree-switch-open {
  & .sl-tree-checkbox-inner::after {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 100%;
    font-size: 16px;
  }
}

.sl-tree-switch-close .sl-tree-checkbox-inner:after {
  content: "+";
}

.sl-tree-switch-open .sl-tree-checkbox-inner:after {
  content: "-";
}

.sl-tree-line {
  display: inline-block;
  padding: 4px 0;
  position: relative;

  &-inner {
    position: relative;
    top: -8px;
    display: inline-block;
    width: 16px;
    height: 20px;
    border-bottom: 1px solid #d9d9d9;
  }
}

.sl-tree-checkbox {
  display: inline-block;
  padding: 4px 0;
  position: relative;
  margin-right: 4px;

  &-inner {
    position: relative;
    top: 0;
    left: 0;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-collapse: separate;
  }

  &-0 {
    background: white;
  }

  &-1 {
    background: #5584ff;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(135deg);
      width: 8px;
      height: 4px;
      // background: white;
      border-right: 2px solid white;
      border-top: 2px solid white;
    }
  }

  &-2 {
    background: #5584ff;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 2px;
      background: white;
    }
  }
}

.sl-tree-title {
  display: inline-block;
  line-height: 29px;
  height: 29px;
  vertical-align: top;
  user-select: text;
  font-size: 16px;
  top: -2px;
  position: relative;
}
</style>
