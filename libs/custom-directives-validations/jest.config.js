module.exports = {
  name: 'custom-directives-validations',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/custom-directives-validations',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
