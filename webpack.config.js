const path = require("path");

module.exports = {
  resolve : {
    extensions : [ '.js', '.jsx', '.tsx', '.ts'],
    alias : {
      '@_/*': path.resolve(__dirname, 'src/*')
    }
  }
}
