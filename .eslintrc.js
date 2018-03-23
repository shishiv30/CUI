module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
        "node": true,
    },
    "globals": {
        "Mustache": true,
        "moment": true,
        "browser": true,
        "console": true,
        "noUiSlider": true,
        "workbox": true,
        "importScripts":true,
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["error", 4, {
            "VariableDeclarator": 1
        }],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
