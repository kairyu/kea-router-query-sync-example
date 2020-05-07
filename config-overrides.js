const {
  override,
  useBabelRc,
  useEslintRc,
} = require('customize-cra')

module.exports = override(
  useBabelRc('.babelrc.json'),
  useEslintRc('.eslintrc.json')
)
