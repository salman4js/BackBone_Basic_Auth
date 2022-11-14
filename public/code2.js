
var Credentials = Backbone.Model.extend({
  defaults : {
    username: '',
    password: ''
  },
  validate : function(attrs){
    console.log(attrs.username.length)
    if(attrs.username.length <= 5){
      return "Username should not be lesser than 5 characters"
    }
  }
});


var Collections = Backbone.Collection.extend({
  model : Credentials,
  url : "https://express-login-auth-backbone-1.vercel.app/api/loginusers"
});

var ICollection = new Collections();


var LandingPage = Backbone.View.extend({
    initialize : function(){
        this.template = _.template($('.template-container-landingPage').html());
        this.render();
    },
    render : function(){
        this.$el.html(this.template());
        return this;
    }
})

var LogOffView = Backbone.View.extend({
    render : function(){
        this.$el.html("You have logged off successfully!");
        return this;
    }
})

var BrowserRouter = Backbone.Router.extend({
    routes : {
        "loggedIn" : "landingPage",
        "logOff" : "loggedOff"
    },
    landingPage : function(){
        var landingView = new LandingPage({el : ".root"});
        //landingView.render();
    },
    loggedOff : function(){
        var logOffScreen = new LogOffView({el : ".content"});
        logOffScreen.render();
    }
})

var router = new BrowserRouter();
Backbone.history.start();

var LoginView = Backbone.View.extend({
    model : ICollection,
    initialize : function(){
        this.template = _.template($('.template-container-Login').html());
        this.render();
    },
    events : {
        'click .signin-user' : 'signinUser'
    },
    signinUser : function(e){
        var self = this;
        console.log("SigninUser has been triggered!");
        console.log(($('#username').val()));
        console.log(($('#password').val()));
        var cred = new Credentials({
          username : $('#username').val(),
          password : $('#password').val()
        });
        console.log(cred.isValid());
        if(cred.isValid()){
          ICollection.add(cred);
          cred.save(null, {
              success : function(){
                  console.log("User Logged In!");
                  var $button = $(e.target);
                  router.navigate($button.attr("data-url"), { trigger : true});
              },
              error : function(){
                  console.log("Invalid username and password!");
                  self.errorRender();
              }
          })
        } else {
          console.log("Model validation has been triggered...");
          self.invalidRender();
        }
        //ICollection.add(cred);
        // var $button = $(e.target);
        // router.navigate($button.attr("data-url"), { trigger : true});
    },
    errorRender : function(){
        $('.error-align').html("<div class = 'error-text error-image'>You have entered an invalid user name or password. Please try again.</div>")
    },
    
    invalidRender : function(){
      $('.error-align').html("<div class = 'error-text error-image'>Username must be greater than 5 characters.</div>")
    },
    
    render : function(){
        this.$el.html(this.template());
        return this;
    }
})

var loginView = new LoginView({el : ".root"});
