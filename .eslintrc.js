module.exports = {
    "extends": ["eslint:recommended", "plugin:prettier/recommended"],
    "parserOptions": { "ecmaVersion": 6 },
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "rules": {
        "semi": 0,
        "quotes": 0,
        "indent": ["error", 2]
    }
};