const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        // `filename` provides a template for naming your bundles (remember to use `[name]`)
        filename: '[name].bundle.js',
    // `chunkFilename` provides a template for naming code-split bundles (optional)
        chunkFilename: '[name].bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        historyApiFallback: true,
        hot: true,
        open: true
    },

    module: {
        rules: [
            {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
            },{
                test: /(\.svg|\.mp3|\.png|\.jpg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                        name: "assets/[name].[ext]"
                        }
                    }
                ]
            },{
                test: /\.s?css$/,
                use: ['style-loader','css-loader','postcss-loader','sass-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css',
          }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: path.resolve(__dirname, './dist/index.html'),
        })
    ]
};