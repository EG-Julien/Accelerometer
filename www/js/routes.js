angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.liveView'
      2) Using $state.go programatically:
        $state.go('tabsController.liveView');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab2/live
      /page1/tab3/live
  */
  .state('tabsController.liveView', {
    url: '/live',
    views: {
      'tab2': {
        templateUrl: 'templates/liveView.html',
        controller: 'liveViewCtrl'
      },
      'tab3': {
        templateUrl: 'templates/liveView.html',
        controller: 'liveViewCtrl'
      }
    }
  })

  .state('tabsController.graphics', {
    url: '/graph',
    views: {
      'tab3': {
        templateUrl: 'templates/graphics.html',
        controller: 'graphicsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.recording'
      2) Using $state.go programatically:
        $state.go('tabsController.recording');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab2/recording
      /page1/tab3/recording
  */
  .state('tabsController.recording', {
    url: '/recording',
    views: {
      'tab2': {
        templateUrl: 'templates/recording.html',
        controller: 'recordingCtrl'
      },
      'tab3': {
        templateUrl: 'templates/recording.html',
        controller: 'recordingCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/tab2/live')

  

});