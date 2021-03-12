const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'public/scripts/'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
            {
                test: /\.s?css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            { test: /\.ttf$/, use: 'file-loader' },
            { test: /\.(png|jpe?g|gif)$/i, use: 'file-loader' }
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'public/'),
        publicPath: '/scripts/',
        historyApiFallback: true,
    }
};