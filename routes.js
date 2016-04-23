// Router configuration
Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

//Loading template hook
Router.onBeforeAction('loading');
//Home template, no data required
Router.route('/', {
  name: 'home',
  template: 'home',
});

Router.route('/consent',{
  name: 'consent',
  waitOn: function(){
    return [Meteor.subscribe('Responses')];
  },
  action: function(){
      this.render('consent');
  },
  onBeforeAction: function() {
    if (!Meteor.user()) {
      return this.render("tsUserAccessDenied");
    } else{
      return this.next();
    }
  }
}); 

//After moving through the instructions users will arrive at the main survey
Router.route('/survey',{
  name: 'survey',

  waitOn: function(){
    return [Meteor.subscribe('Responses')];
  },
  action: function(){
    var user = Responses.findOne(Meteor.userId());
    if (user.status == 'instructions'){
      this.render('instructions');
    } else if(user.status == 'survey'){
      this.render('survey');
    }
  },

  onBeforeAction: function() {
    if (Responses.findOne(Meteor.userId()).consent){
      return this.render("tsUserAccessDenied");
    } else{
      return this.next();
    }
  }
});

//End survey
Router.route('/endSurvey',{
  name: 'endSurvey',
  template: 'endSurvey',
  
  waitOn: function(){
    return Meteor.subscribe('Responses');
  },
  action: function(){
      this.render('endSurvey');
  }
});