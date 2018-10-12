cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-shortcuts-android.ShortcutsPlugin",
    "file": "plugins/cordova-plugin-shortcuts-android/www/ShortcutsPlugin.js",
    "pluginId": "cordova-plugin-shortcuts-android",
    "clobbers": [
      "Shortcuts"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-shortcuts-android": "0.1.0",
  "cordova-plugin-splashscreen": "5.0.3-dev",
  "cordova-plugin-whitelist": "1.3.3"
};
// BOTTOM OF METADATA
});