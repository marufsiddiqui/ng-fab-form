angular.module("ngFabForm",[]),angular.module("ngFabForm").directive("form",["$compile","$timeout","ngFabForm",function(a,b,c){"use strict";var d=function(a){a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation()},e=function(a,c,e,f){var g,h=!1,i=function(){h=!1},j=function(){h=!0,g&&b.cancel(g),g=b(i,e)};a.$on("$destroy",function(){g&&b.cancel(g)}),c.bindFirst("submit."+f,function(a){h?(d(a),j()):(h=!0,j())})},f=function(a,b,c,e){var f=!1;b.bindFirst("submit."+e,function(a){f&&d(a)}),a.$watch(function(){return c.$valid},function(a){f=!a})},g=function(a,b){if(b.disableForm){a.wrapInner("<fieldset>");var c=a.children();b.$observe("disableForm",function(){"true"===b.disableForm||b.disableForm===!0?c.attr("disabled",!0):c.removeAttr("disabled")})}},h=function(a,b,c,d){b.bindFirst("submit."+c,function(){a.$apply(function(){d.$triedSubmit=!0})})},i=function(a,b,c,d,e){var f=d;a.bindFirst("submit."+c,function(){var c=a.find(".ng-invalid")[0];if(c&&b.$invalid){var g=$(c).offset().top+e;d?("smooth"===d&&(f=Math.abs(window.scrollY-g)/4+200),$("html, body").animate({scrollTop:g},f,function(){c.focus()})):window.scrollTo(0,g)}})};return{restrict:"E",scope:!1,require:"form",compile:function(a,b){return!b.novalidate&&c.config.setNovalidate&&(a.attr("novalidate",!0),b.novalidate=!0),function(a,b,d,j){var k=c.config.preventDoubleSubmitTimeoutLength,l=c.config.eventNameSpace;c.config.preventInvalidSubmit&&f(a,b,j,l),c.config.preventDoubleSubmit&&e(a,b,k,l),c.config.disabledForms&&g(b,d),c.config.setFormDirtyOnSubmit&&h(a,b,l,j),c.config.scrollToAndFocusFirstErrorOnSubmit&&i(b,j,l,c.config.scrollAnimationTime,c.config.scrollOffset)}}}}]),angular.module("ngFabForm").directive("maxFileSize",["maxUploadSizeInByte",function(a){"use strict";var b={maxUploadSizeInByte:a,validationKey:"maxFileSize"};return{restrict:"A",require:"?ngModel",scope:{ngModel:"=",maxFileSize:"@"},link:function(a,c,d,e){var f;f=!a.maxFileSize||parseFloat(a.maxFileSize)>0?b.maxUploadSizeInByte:a.maxFileSize,a.$watch("ngModel",function(c){if(c instanceof Array){e.$setViewValue(c);for(var d=!0,g=0;g<a.ngModel.length;g++){var h=a.ngModel[g];if(h.size>f){d=!1;break}}e.$setValidity(b.validationKey,d)}else e.$setValidity(b.validationKey,!0)},!0)}}}]),angular.module("ngFabForm").directive("input",["ngFabFormDirective",function(a){"use strict";return a}]),angular.module("ngFabForm").directive("textarea",["$compile","ngFabFormDirective",function(a,b){"use strict";return b}]),angular.module("ngFabForm").directive("select",["ngFabFormDirective",function(a){"use strict";return a}]),angular.module("ngFabForm").factory("ngFabFormDirective",["ngFabForm","$compile","$timeout",function(a,b,c){"use strict";return{restrict:"E",require:["?^form","?ngModel"],compile:function(d,e){if(e.ngModel&&!e.name){var f=e.ngModel.replace(".","_");d.attr("name",f),e.name=f}return function(d,e,f,g){var h=g[0],i=g[1];if(h&&i&&c(function(){var c=a.makeAlertTpl(h.$name,f,i.$validators),g=b(c)(d);a.insertErrorTpl(g,e,f)}),a.config.setAsteriskForRequiredLabel&&f.required===!0){var j=$("label[for="+f.name+"]");j.length<1&&(j=e.prev("label")),j&&j[0]&&"radio"!==f.type&&"checkbox"!==f.type&&(j[0].innerText=j[0].innerText+a.config.asteriskStr)}}}}}]),angular.module("ngFabForm").provider("ngFabForm",function(){"use strict";var a={showErrorsOn:["$touched","$dirty"],setNovalidate:!0,setAsteriskForRequiredLabel:!0,asteriskStr:"*",preventInvalidSubmit:!0,preventDoubleSubmit:!0,preventDoubleSubmitTimeoutLength:1e3,setFormDirtyOnSubmit:!0,scrollToAndFocusFirstErrorOnSubmit:!0,scrollAnimationTime:"smooth",scrollOffset:-100,disabledForms:!0,eventNameSpace:"ngFabForm",validationMsgPrefix:"validationMsg"},b={required:"This field is required",pattern:"Your input does not match the requirements",maxlength:"Your input is too long",minlength:"Your input is too short",email:"This is not a valid email-address"},c=function(a,b,c,d){var e="";return angular.forEach(d,function(a,b){e+='<li ng-message="'+b+'">'+a+"</li>"}),'<div ng-show="'+a+'"ng-messages="'+b+"."+c+'.$error" class="help-block with-errors"><ul class ="list-unstyled">'+e+"</ul></div>"},d=function(c,d){var e={},f={};return angular.forEach(d,function(b,c){var d=new RegExp(a.validationMsgPrefix);if(c.match(d)){var e=c.replace(a.validationMsgPrefix,"");e=e.charAt(0).toLowerCase()+e.slice(1),f[e]=b}}),angular.forEach(c,function(a,c){e[c]=f&&f[c]?f[c]:b[c]}),e},e=function(b,e,f){var g=e.name,h=b+"."+g+".$invalid";h+=" && (",angular.forEach(a.showErrorsOn,function(a,c){h+=0===c?b+"."+g+"."+a:" || "+b+"."+g+"."+a}),h+="|| "+b+".$triedSubmit",h+=")";var i=d(f,e);return c(h,b,g,i)},f=function(a,b,c){"checkbox"===c.type||"radio"===c.type?b.parent().after(a):b.after(a)};return{extendValidationMessages:function(a){b=angular.extend(b,a)},extendConfig:function(b){a=angular.extend(a,b)},setWrapperTplFunction:function(a){c=a},setInsertErrorTplFn:function(a){f=a},$get:function(){return{insertErrorTpl:f,makeAlertTpl:e,config:a}}}});