const config = {
    root: true,
    env: {
        browser: true,
        es6: true
    },
    parser: "babel-eslint",
    globals: {
        env: true,
    },
    rules: {
        "semi": ["error", "never"],
        "quotes": ["error", "double"],
        "comma-dangle": "off",
        "indent": ["error", 4],
    },
}

module.exports = config
