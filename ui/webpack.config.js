const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/index.jsx",
    output: {
        path: __dirname + "/dist",
        publicPath: "/",
        filename: "jammed.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.sass$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    {
                        loader: "sass-resources-loader",
                        options: {
                            resources: ["./src/styles/colors.sass"]
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ],
    devServer: {
        contentBase: "./dist",
        port: 3000,
        hot: true,
        watchContentBase: true,
        historyApiFallback: true,
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"]
    },
}
