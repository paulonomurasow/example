"use strict";var app=angular.module("app",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngAnimate","ngTouch","ui.bootstrap","ngWebsocket","Config"]).config(["$websocketProvider",function(a){return a.$setup({reconnect:!0,reconnectInterval:2e3}),navigator.serviceWorker&&navigator.serviceWorker.register?(navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).then(function(a){console.log("Service worker registered, scope: "+a.scope),console.log("Refresh the page to talk to it.")})["catch"](function(a){console.log("Service worker registration failed: "+a.message)}),navigator.serviceWorker.register("/sw.js",{scope:"/cache/"}).then(function(a){console.log("Service worker registered, scope: "+a.scope),console.log("Refresh the page to talk to it.")})["catch"](function(a){console.log("Service worker registration failed: "+a.message)}),"showNotification"in ServiceWorkerRegistration.prototype?"denied"===Notification.permission?void console.log("The user has blocked notifications."):"PushManager"in window?void 0:void console.log("Push messaging isn't supported."):void console.log("Notifications aren't supported.")):void console.log("This browser doesn't support service workers")}]);app.config(["$httpProvider",function(a){a.interceptors.push(["$q","$rootScope","AppService","ENV",function(a,b,c,d){return{request:function(e){b.$broadcast("loading-started");var f=c.getToken();return"development"===d.name&&-1!==e.url.indexOf("api")&&(e.url=d.apiEndpoint+e.url),f&&(e.headers.Authorization="Token "+f),e||a.when(e)},response:function(c){return b.$broadcast("loading-complete"),c||a.when(c)},responseError:function(c){return b.$broadcast("loading-complete"),a.reject(c)},requestError:function(c){return b.$broadcast("loading-complete"),a.reject(c)}}}]),a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]),app.run(["$rootScope","$location","$window","AUTH_EVENTS","APP_EVENTS","USER_ROLES","AuthService","AppService","AlertService",function(a,b,c,d,e,f,g,h,i){a.$on("$routeChangeStart",function(b,c){if("/"!==c.redirectTo){var e=c.data.authorizedRoles;-1===e.indexOf(f.NOT_LOGGED)&&(g.isAuthorized(e)||(b.preventDefault(),g.isAuthenticated()?a.$broadcast(d.notAuthorized):a.$broadcast(d.notAuthenticated)))}}),a.$on(d.mensagem,function(a,b){i.notification("Mensagem",b.emit.data),sendMessage(b.emit.data)}),a.$on(d.mensagem,function(a,b){i.notification("Comunicado",b.emit.data),sendMessage(b.emit.data)}),a.$on(d.quantidade,function(b,c){a.$apply(function(){a.conectados=c.emit.data})}),a.$on(d.notAuthorized,function(){b.path("/403")}),a.$on(d.notAuthenticated,function(){a.currentUser=null,h.removeToken(),b.path("/login")}),a.$on(d.loginFailed,function(){h.removeToken(),b.path("/login")}),a.$on(d.logoutSuccess,function(){a.currentUser=null,h.removeToken(),b.path("/dashboard")}),a.$on(d.loginSuccess,function(){b.path("/dashboard")}),a.$on(e.offline,function(){i.clear(),i.addWithTimeout("danger","Servidor esta temporariamente indisponível, tente mais tarde")}),c.addEventListener("load",function(a){c.applicationCache.addEventListener("updateready",function(a){c.applicationCache.status===c.applicationCache.UPDATEREADY&&(c.location.reload(),alert("Uma nova versão será carregada!"))},!1)},!1)}]),app.constant("APP_EVENTS",{offline:"app-events-offline"}),app.constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized",comunicado:"comunicado",mensagem:"mensagem",quantidade:"qtde"}),app.constant("USER_ROLES",{ADMINISTRADOR:"ADMINISTRADOR",FUNCIONARIO:"FUNCIONARIO",USUARIO:"USUARIO",NOT_LOGGED:"NOT_LOGGED"}),app.factory("AuthInterceptor",["$rootScope","$q","AUTH_EVENTS","APP_EVENTS",function(a,b,c,d){return{responseError:function(e){return a.$broadcast({"-1":d.offline,0:d.offline,404:d.offline,503:d.offline,401:c.notAuthenticated,419:c.sessionTimeout,440:c.sessionTimeout}[e.status],e),b.reject(e)}}}]),angular.module("Config",[]).constant("ENV",{name:"production",apiEndpoint:"https://cep-fwkdemoiselle.rhcloud.com/"}),app.controller("DashboardController",["$scope","DashboardService","AlertService",function(a,b,c){a.limpar=function(){a.logradouro={},a.logradouros=[],a.localidade={},a.localidades=[],a.searchText="",a.cep="",a.uf="",a.loc="",a.log=""},a.limpar(),a.findCep=function(){b.findCep(a.cep).then(function(b){a.logradouro=b},function(a){var b=a[0],d=a[1];401===d&&c.addWithTimeout("warning",b.message)})},a.findUf=function(){b.findUf(a.uf).then(function(b){a.localidades=b},function(a){var b=a[0],d=a[1];401===d&&c.addWithTimeout("warning",b.message)})},a.findLocalidade=function(){b.findLocalidade(a.loc).then(function(b){a.localidades=b},function(a){var b=a[0],d=a[1];401===d&&c.addWithTimeout("warning",b.message)})},a.findLogradouro=function(){b.findLogradouro(a.log).then(function(b){a.logradouros=b},function(a){var b=a[0],d=a[1];401===d&&c.addWithTimeout("warning",b.message)})}}]),app.directive("uiLinhabar",["$rootScope","$anchorScroll",function(a,b){return{restrict:"AC",template:'<span class="bar"></span>',link:function(a,c,d){c.addClass("linhabar hide"),a.$on("$routeChangeStart",function(a){b(),c.removeClass("hide").addClass("active")}),a.$on("$routeChangeSuccess",function(a,b,d,e){a.targetScope.$watch("$viewContentLoaded",function(){c.addClass("hide").removeClass("active")})}),a.$on("loading-started",function(a){c.removeClass("hide").addClass("active")}),a.$on("loading-complete",function(a){c.addClass("hide").removeClass("active")})}}}]),app.directive("backButton",function(){return{restrict:"A",link:function(a,b,c){b.bind("click",function(){history.back(),a.$apply()})}}}),app.directive("alerts",function(){return{restrict:"E",templateUrl:"partials/alerts.html"}}),app.directive("autofill",function(){return{require:"ngModel",link:function(a,b,c,d){a.$on("autofill:update",function(){d.$setViewValue(b.val())})}}}),app.directive("hasRoles",["AuthService",function(a){return{restrict:"A",link:function(b,c,d){var e=d.hasRoles.split(",");a.isAuthorized(e)||c.remove()}}}]),app.directive("isLogged",["AuthService",function(a){return{restrict:"A",link:function(b,c,d){a.isAuthenticated()||c.remove()}}}]),app.directive("maxLength",["$compile","AlertService",function(a,b){return{restrict:"A",require:"ngModel",link:function(a,c,d,e){d.$set("ngTrim","false");var f=parseInt(d.maxLength,10);e.$parsers.push(function(a){return void 0!==a&&void 0!==a.length&&a.length>f&&(b.addWithTimeout("warning","O valor máximo de caracteres ("+f+") para esse campo já foi alcançado"),a=a.substr(0,f),e.$setViewValue(a),e.$render()),a})}}}]),app.directive("hasRolesDisable",["AuthService",function(a){return{restrict:"A",link:function(b,c,d){var e=d.hasRolesDisable.split(",");a.isAuthorized(e)||angular.forEach(c.find("input, select, textarea, button, a"),function(a){var b=angular.element(a);b.attr("disabled","true")})}}}]),app.directive("ngEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter)}),b.preventDefault())})}}),app.config(["$routeProvider","USER_ROLES",function(a,b){a.when("/",{templateUrl:"views/cep.html",controller:"DashboardController",data:{authorizedRoles:[b.NOT_LOGGED]}}).when("/cep",{templateUrl:"views/cep.html",controller:"DashboardController",data:{authorizedRoles:[b.NOT_LOGGED]}}).when("/uf",{templateUrl:"views/uf.html",controller:"DashboardController",data:{authorizedRoles:[b.NOT_LOGGED]}}).when("/logradouro",{templateUrl:"views/logradouro.html",controller:"DashboardController",data:{authorizedRoles:[b.NOT_LOGGED]}}).otherwise({redirectTo:"/",data:{authorizedRoles:[b.NOT_LOGGED]}})}]),app.factory("AlertService",["$rootScope","$timeout",function(a,b){var c={};return a.alerts=[],c.addWithTimeout=function(a,d,e){var f=c.add(a,d);b(function(){c.closeAlert(f)},e?e:4e3)},c.add=function(b,c,d){b&&c&&a.alerts.push({type:b,msg:c})},c.showMessageForbiden=function(){this.addWithTimeout("danger","Você não tem permissão para executar essa operação")},c.closeAlert=function(b){return this.closeAlertIdx(a.alerts.indexOf(b))},c.closeAlertIdx=function(b){return a.alerts.splice(b,1)},c.clear=function(){a.alerts=[]},c.notification=function(a){return new Promise(function(b,c){var d=new MessageChannel;d.port1.onmessage=function(a){a.data.error?c(a.data.error):b(a.data)},navigator.serviceWorker.controller.postMessage(a,[d.port2])})},c}]),app.factory("AppService",["$window","$rootScope",function(a,b){function c(a){var b=a.replace("-","+").replace("_","/");switch(b.length%4){case 0:break;case 2:b+="==";break;case 3:b+="=";break;default:throw"Illegal base64url string!"}return window.atob(b)}var d="token",e={};return e.getToken=function(){var c=a.localStorage.getItem(d);return c&&void 0!==c&&null!==c&&"null"!==c?(b.currentUser||(b.currentUser=e.getUserFromToken()),c):(a.localStorage.removeItem(d),b.currentUser=null,null)},e.setToken=function(b){a.localStorage.setItem(d,b)},e.removeToken=function(){a.localStorage.removeItem(d)},e.getUserFromToken=function(){var b=a.localStorage.getItem(d),e=null;if(null!==b&&void 0!==typeof b){var f=b.split(".")[1],g=JSON.parse(c(f));e=JSON.parse(g.user)}return e},e}]),app.factory("AuthService",["$http","AppService","$rootScope","WS",function(a,b,c,d){var e={};return e.login=function(d){return b.removeToken(),a.post("api/auth",d).success(function(a,d,e){return b.setToken(e("Set-Token")),c.currentUser=b.getUserFromToken(),a})},e.setCss=function(a){b.setCss(a)},e.getCss=function(){return b.getCss()},e.isAuthenticated=function(){return c.currentUser?!0:!1},e.isAuthorized=function(a){var b=!1;if(!e.isAuthenticated())return!1;angular.isArray(a)||(a=[a]);var d=c.currentUser.grupos;if(void 0!==d&&null!==d)for(var f=0;f<a.length;f++)for(var g=0;g<d.length;g++)for(var h=0;h<d[g].perfis.length;h++)if(-1!==a[f].indexOf(d[g].perfis[h])){b=!0;break}return b},e}]),app.factory("DashboardService",["$http",function(a){var b={};return b.findCep=function(b){return a.get("api/cep/"+b).then(function(a){return a.data})},b.findUf=function(b){return a.get("api/localidade/uf/"+b).then(function(a){return a.data})},b.findLocalidade=function(b){return a.get("api/localidade/"+b).then(function(a){return a.data})},b.findLogradouro=function(b){return a.get("api/logradouro/"+b).then(function(a){return a.data})},b}]),app.factory("WorkerService",["$http",function(a){var b={};return b.checkServiceWorker=function(){return!1},b.checkServiceWorker(),b}]),app.factory("WS",["$rootScope","$websocket",function(a,b){var c={};navigator.vibrate=navigator.vibrate||navigator.webkitVibrate||navigator.mozVibrate||navigator.msVibrate,navigator.vibrate&&navigator.vibrate([500]);var d="wss://reforce-pgxp.rhcloud.com:8443/echo",e=b.$new({url:d,protocols:[],subprotocols:["base46"]});return e.$on("$open",function(){console.log("WS ON"),a.currentUser&&e.$emit("login",a.currentUser.name)}),e.$on("$close",function(){console.log("WS OFF")}),e.$on("$error",function(a){console.log(a),console.log("WS ERROR")}),e.$on("$message",function(b){a.$broadcast(b.event,{emit:b})}),c.command=function(a,b){e.$emit(a,b)},c}]);