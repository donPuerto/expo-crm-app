module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
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
    ],
  };
};
