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

//When users accept the HIT they're first shown the consent; if they agree to the consent then they are show the instructions 
Router.route('/lobby',{
  name: 'lobby',
  template: 'lobby',
  waitOn: function(){
    return [Meteor.subscribe('responses')];
  },
  action: function(){
    var user = Responses.findOne(Meteor.userId());
    if (user.consent == false && user.status == 'consent'){
      this.render('consent');
    } else if(user.consent == true && user.status == 'instructions'){
      this.render('instructions');
    }
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
  name: 'game',
  waitOn: function(){
    return [Meteor.subscribe('stims'), Meteor.subscribe('responses')];
  },
  action: function(){
    this.render('survey');
  }
});

//End survey
Router.route('/endSurvey',{
  name: 'endSurvey',
  template: 'endSurvey',
  
  waitOn: function(){
    return Meteor.subscribe('responses');
  },
  action: function(){
      this.render('endSurvey');
  }
});