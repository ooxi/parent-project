const extendDefaultTypeScriptConfiguration = require("webpack-configuration-templates")
    .extendDefaultTypeScriptConfiguration;



module.exports = [

    /* cli application
     */
    extendDefaultTypeScriptConfiguration({
        entry: "./src/main.ts",

        output: {
            path: __dirname + "/target",
            filename: "main.js"
        },

        target: 'node'
    }),


    /* Test cases
     */
    extendDefaultTypeScriptConfiguration({
        entry: "./test/JsYamlTest.ts",

        output: {
            path: __dirname + "/target",
            filename: "JsYamlTest.js"
        },

        target: 'node'
    })
];
