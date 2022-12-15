const URL = 'http://localhost:1337/'
// const URL ='http://your-app-name.herokuapp.com/'

require([
 'libs/text!header.html',
 'libs/text!home.html',
 'libs/text!footer.html'],
 function (
  headerTpl,
  homeTpl,
  footerTpl) {

  const ApplicationRouter = Backbone.Router.extend({
   routes: {
    '': 'home',
    '*actions': 'home'
   },
   initialize: function () {
    this.headerView = new HeaderView()
    this.headerView.render()
    this.footerView = new FooterView()
    this.footerView.render()
   },
   home: function () {
    this.homeView = new HomeView()
    this.homeView.render()
   }
  })

  const HeaderView = Backbone.View.extend({
   el: '#header',
   templateFileName: 'header.html',
   template: headerTpl,
   initialize: function () {
   },
   render: function () {
    $(this.el).html(_.template(this.template))
   }
  })

  const FooterView = Backbone.View.extend({
   el: '#footer',
   template: footerTpl,
   render: function () {
    this.$el.html(_.template(this.template))
   }
  })
  const Message = Backbone.Model.extend({
   url: URL + 'messages.json'
  })
  const MessageBoard = Backbone.Collection.extend({
   model: Message,
   url: URL + 'messages.json'
  })

  const HomeView = Backbone.View.extend({
   el: '#content',
   template: homeTpl,
   events: {
    'click #send': 'saveMessage'
   },

   initialize: function () {
    const homeView = this
    homeView.collection = new MessageBoard()
    homeView.collection.bind('refresh', homeView.render, homeView)
    homeView.collection.fetch({
     success: function (collection, response, options) {
      console.log('Fetched ', collection)
      collection.trigger('refresh')
     },
     error: function () {
      console.error('Error fetching messages')
     }
    })
    homeView.collection.on('add', function (message) {
     if (message.attributes._id) return false
     message.save(null, {
      success: function (message) {
       homeView.collection.trigger('refresh')
       console.log('Saved ', message)
      },
      error: function (message) {
       console.log('error')
      }
     })
    })
   },
   saveMessage: function () {
    const newMessageForm = $('#new-message')
    const username = newMessageForm.find('[name="username"]').val()
    const message = newMessageForm.find('[name="message"]').val()
    this.collection.add({
     'username': username,
     'message': message
    })
   },
   render: function () {
    console.log('Home view rendered')
    $(this.el).html(_.template(this.template)(this.collection))
   }
  })

  window.app = new ApplicationRouter()
  Backbone.history.start()
 })
