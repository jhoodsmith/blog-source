const path = require('path');

module.exports = {
    entry: [path.resolve(__dirname, 'themes', 'jhs-tailwindcss', 'assets', 'js')],
    output: {
	filename: 'app.js',
	path: path.resolve(__dirname, 'themes', 'jhs-tailwindcss', 'assets', 'js')
    }
}
