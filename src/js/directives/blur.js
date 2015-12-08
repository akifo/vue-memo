var Vue = require('vue');

module.exports = {
  twoWay: true,

  bind: function(){

    this.handler = function () {
      console.log('onblur されたよ', this.el);
    }.bind(this);

    this.el.addEventListener('onblur', this.handler);

  },

  update: function(value){
    console.log('onblur init', this.el);
    console.log(value);
  },

  unbind: function () {
    this.el.removeEventListener('onblur', this.handler);
  }

};
