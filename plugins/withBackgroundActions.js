const { withAndroidManifest } = require('expo/config-plugins');

const SERVICE_NAME = 'com.asterinet.react.bgactions.RNBackgroundActionsTask';
const DATA_SYNC_PERMISSION = 'android.permission.FOREGROUND_SERVICE_DATA_SYNC';

function ensurePermission(manifest, permissionName) {
  if (!manifest['uses-permission']) {
    manifest['uses-permission'] = [];
  }
  const permissions = manifest['uses-permission'];
  const exists = permissions.some((entry) => entry.$?.['android:name'] === permissionName);
  if (!exists) {
    permissions.push({ $: { 'android:name': permissionName } });
  }
}

function ensureBackgroundService(application) {
  if (!application.service) {
    application.service = [];
  }
  const services = application.service;
  const existing = services.find((entry) => entry.$?.['android:name'] === SERVICE_NAME);
  if (existing) {
    existing.$['android:foregroundServiceType'] = 'dataSync';
    return;
  }
  services.push({
    $: {
      'android:name': SERVICE_NAME,
      'android:foregroundServiceType': 'dataSync',
    },
  });
}

function withBackgroundActions(config) {
  return withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults.manifest;
    ensurePermission(manifest, DATA_SYNC_PERMISSION);

    const application = manifest.application?.[0];
    if (application) {
      ensureBackgroundService(application);
    }

    return modConfig;
  });
}

module.exports = withBackgroundActions;
