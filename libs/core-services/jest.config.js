module.exports = {
  name: 'core-services',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/core-services',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
