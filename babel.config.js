module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './components',
            '@hooks': './hooks',
            '@constants': './constants',
            '@assets': './assets'
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      ['dotenv-import', {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      }],
    ],
  };
};
