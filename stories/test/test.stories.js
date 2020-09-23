import Vue from 'vue';
import { Button } from 'ant-design-vue'
import App from '@/components/test/test1.vue';
import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withKnobs, text } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';

Vue.component(Button.name, Button);

export default {
  title: 'test',
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'Kindle Fire HD'
    },
  },
  component: App,
  backgrounds: [
    { name: 'red', value: 'rgba(255, 0, 0)' },
  ],
  decorators: [withKnobs, withA11y]
};

export const test1 = () => ({
  components: { App },
  template: `
    <div>
      <app @btnclick="action3"></app>{{ text }}
      <button @click="action1">Go back</button>
      <button @click="action2">Go back</button>
    </div>
  `,
  props: {
    text: {
      default: text('Text', 'Hello Storybook')
    },
  },
  methods: {
    action1: linkTo('Components', 'Lines'),
    action2: action('onClick'),
    action3: action('btnclick'),
  },
});
