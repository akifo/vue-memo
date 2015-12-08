var Vue = require('vue');

module.exports = {
  twoWay: true,

  bind: function(){
    this.handler1 = function () {
      this.el.innerHTML = '<input value="'+this.el.innerText+'">';
      console.log('dblclick されたよ', $(this.el).find('input'));
      console.log('dblclick されたよ', $(this.el).find('input').val());
      $(this.el).find('input').addEventListener('onblur', function(){
        console.log('aijojpip');
      });
    }.bind(this);

    this.handler2 = function () {
      // this.el.innerHTML = this.el;
      console.log('onblur されたよ', this);
      this.el.removeEventListener('onblur', this.handler2);
    }.bind(this);

    this.el.addEventListener('dblclick', this.handler1);

  },

  update: function(value){
    console.log(value);
  },

  unbind: function () {
    this.el.removeEventListener('dblclick', this.handler1);
  }

};
