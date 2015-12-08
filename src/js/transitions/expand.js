module.exports = {
  beforeEnter: function (el) {
    $(el).css({
      transition: "all 0.4s ease",
      overflow: "hidden",
      opacity: 0
    });
  },
  enter: function (el) {
    $(el).css({
      height: $(el).height(),
      opacity: 1
    });
  },
  afterEnter: function (el) {
    $(el).css({
      height: 'auto',
    });
  },
  enterCancelled: function (el) {
  },

  beforeLeave: function (el) {
  },
  leave: function (el) {
    $(el).css({
      height: 0,
      opacity: 0,
      margin: 0,
      border: 0
    });
  },
  afterLeave: function (el) {
  },
  leaveCancelled: function (el) {
  }
};
