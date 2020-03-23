import Vue from 'vue';
import { Slider } from 'ant-design-vue';

import BsLines from '../src/components/bs-lines/BsLines.vue';

Vue.use(Slider);

export default {
  title: 'Components',
};

export const Lines = () => ({
  components: { BsLines },
  template: '<bs-lines></bs-lines>',
});
