module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'react' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './src/tamagui/tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/services': './services',
            '@': './src',
            '~assets': './assets',
          },
          extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.png',
            '.jpg',
            '.jpeg',
            '.gif',
            '.svg',
          ],
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
