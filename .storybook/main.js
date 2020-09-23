const path = require('path');

module.exports = {
  // stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-links/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-docs',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
  ],
  // webpackFinal: async (config, { configType }) => {
  //   // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  //   // You can change the configuration based on that.
  //   // 'PRODUCTION' is used when building the static version of storybook.
  //
  //   // Make whatever fine-grained changes you need
  //   config.module.rules.push({
  //     test: /\.less$/,
  //     use: [
  //       { loader: 'style-loader' },
  //       { loader: 'css-loader' },
  //       {
  //         loader: 'less-loader',
  //         options: {
  //           javascriptEnabled : true
  //         }
  //       }
  //     ]
  //   });
  //   config.module.rules.push({
  //     test: /\.sass$/,
  //     use: [
  //       'vue-style-loader',
  //       'css-loader',
  //       'sass-loader'
  //     ]
  //   },);
  //   config.module.rules.push({
  //     test: /\.scss$/,
  //     use: [
  //       'vue-style-loader',
  //       'css-loader',
  //       'sass-loader'
  //     ]
  //   });
  //   config.module.rules.push({
  //     test: /\.css$/,
  //     use: [
  //       'style-loader',
  //       'css-loader',
  //     ]
  //   });
  //   Object.assign(config.resolve.alias,{
  //     '@': path.resolve(__dirname, '../src'),
  //   });
  //
  //   // Return the altered config
  //   return config;
  // },
};
