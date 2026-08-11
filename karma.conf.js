// Karma config shared by docs + components unit tests.
// ChromeHeadlessCI adds Docker/CI-friendly flags (--no-sandbox).
module.exports = function (config) {
  config.set({
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
