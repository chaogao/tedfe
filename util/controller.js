var controller = {
  getResponse: function (data) {
    return {
      errno: 0,
      data: data || {}
    }
  }
}

module.exports = controller;