const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './src/core/theme/global.css' })
