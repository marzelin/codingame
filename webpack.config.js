const webpack = require('webpack')
const join = require('path').join

module.exports = {
    entry:  join(__dirname, 'src', 'index.ts'),
    output: {
        filename: 'index.js',
        path:     join(__dirname, 'build'),
        pathinfo: true
    },

    // Enable sourcemaps for debugging webpack's output.
    // don't create sourcemap file since we there's no need for debugging in a browser
    // devtool: 'source-map',

    resolve: {
        // Add '.ts' resolvable extensions. WARNING: no .js files will be resolved
        extensions: ['.ts']
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            // since we don't use sourcemaps we don't need this
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]

    },
    plugins: [
        new webpack.DefinePlugin({
            'isRunAtCodingame': true
    })
  ]
}