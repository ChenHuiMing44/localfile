module.exports = {
  // 入口，是一个对象
  entry: {
    app: "./server.js"
  },

  // 输出
  output: {
    // 带五位hash值的js
    filename: "[name].[hash:5].js"
  }
};
