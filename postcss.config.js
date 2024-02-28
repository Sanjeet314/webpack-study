module.exports = {
  plugins: [require("autoprefixer")], // intresting question: how autoprefixer comes to know when to add prefixer to a modern property that is very new to old broser if user is using old browser? answer: we will create a brwoserlist file using that it does so.
};
