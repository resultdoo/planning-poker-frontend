module.exports = {
    "globals": {
        "window": true,
        "document": true
    },

    "extends": "airbnb",
    "plugins": [
        "react-hooks"
    ],
    "parser": require.resolve('babel-eslint'),
    "rules": {
        "react/jsx-filename-extension":  [ 1, { "extensions": [ ".js", ".jsx" ] } ],
        "semi": [ "error", "never" ],
        "quotes": [ "error", "single" ],
        "import/no-unresolved": 0,
        "indent": [ "error", "tab" ],
        "react/no-deprecated": [ "error" ],
        "no-tabs": ["error", { allowIndentationTabs: true }],
        "no-tabs": 0,
        "react/jsx-indent": [ 2, "tab" ],
        "react/jsx-curly-spacing": [ 2, { "when": "always" } ],
        "react/jsx-indent-props": [ 2, "tab" ],
        "space-in-parens": [ "error", "always" ],
        "array-bracket-spacing": [ "error", "always" ],
        "comma-dangle": [ "error", "only-multiline" ],
        "jsx-quotes": [ "error", "prefer-single" ],
        "template-curly-spacing": [ "error", "always" ],
        "react/forbid-prop-types": 0,
        "computed-property-spacing": [ "error", "always" ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "camelcase": 0,
    }
}
