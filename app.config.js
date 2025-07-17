const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'
const USERNAME = process.env.USERNAME || 'username'

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return `com.${USERNAME}.TransportTrackerSQLite.dev`
    }

    if (IS_PREVIEW) {
        return `com.${USERNAME}.TransportTrackerSQLite.preview`
    }

    return `com.${USERNAME}.TransportTrackerSQLite`
}

const getAppName = () => {
    if (IS_DEV) {
        return 'TransportTracker - SQLite (Dev)'
    }

    if (IS_PREVIEW) {
        return 'TransportTracker - SQLite (Preview)'
    }

    return 'TransportTracker - SQLite'
}

export default {
    expo: {
        name: getAppName(),
        slug: "TransportTracker-SQLite",
        version: "0.6.0-beta.10",
        icon: "./assets/images/icon.png",
        scheme: "transporttrackersqlite",
        ios: {
            bundleIdentifier: getUniqueIdentifier(),
        },
        android: {
            package: getUniqueIdentifier(),
            usesCleartextTraffic: true,
            permissions: [
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.FOREGROUND_SERVICE",
                "android.permission.VIBRATE",
            ],
            softwareKeyboardLayoutMode: 'pan',
            edgeToEdgeEnabled: true
        },
        orientation: 'portrait',
        newArchEnabled: true,
        runtimeVersion: {
            policy: "appVersion"
        },
        plugins: [
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/icon_transparent.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff"
                }
            ],
            [
                "expo-build-properties",
                {
                    android: {
                        usesCleartextTraffic: true
                    }
                }
            ],
            [
                "expo-localization"
            ],
            [
                "expo-router"
            ]
        ],
        experiments: {
            typedRoutes: true
        }
    },
}
