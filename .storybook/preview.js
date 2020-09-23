import { configure } from '@storybook/vue';
import { addParameters } from '@storybook/vue';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};

addParameters({
  viewport: { viewports: customViewports },
  docs: {
    inlineStories: true,
  },
  backgrounds: [
    { name: 'twitter', value: '#00aced', default: true },
    { name: 'facebook', value: '#3b5998' },
  ],
});

const loaderFn = () => {
  const allExports = [];
  const req = require.context('../stories', true, /\.stories\.js$/);
  req.keys().forEach((fName) => allExports.push(req(fName)));

  return allExports;
};

configure(loaderFn, module);
