const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled : true
            }
          }
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "../src"),
    }
  }
};

// module.exports =  async ({ config, mode }) => {
//   [
//     {
//       test: /\.less$/,
//       use: [
//         { loader: 'style-loader' },
//         { loader: 'css-loader' },
//         {
//           loader: 'less-loader',
//           options: {
//             javascriptEnabled : true
//           }
//         }
//       ]
//     },
//     {
//       test: /\.sass$/,
//       use: [
//         'vue-style-loader',
//         'css-loader',
//         'sass-loader'
//       ]
//     },
//     {
//       test: /\.scss$/,
//       use: [
//         'vue-style-loader',
//         'css-loader',
//         'sass-loader'
//       ]
//     },
//     {
//       test: /\.css$/,
//       use: [
//         'style-loader',
//         'css-loader',
//       ]
//     }
//   ].forEach((item) => {
//     config.module.rules.push(item);
//   });
//
//   Object.assign(config.resolve.alias,{
//     '@': path.resolve(__dirname, '../src'),
//   });
//   // Return the altered config
//   return config;
// };
