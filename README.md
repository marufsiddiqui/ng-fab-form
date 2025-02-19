ng-fab-form
===========

*Convenient forms for Angular with no extra markup? Fabulous!*

AngularJS forms are pretty nice. But if you have worked with angular for a while, you'll find that the out-of-the-box-mechanics like the instant validation are far from perfect from the common users perspective. Furthermore you probably catch yourself declaring (and sometimes forgetting) the same stuff on and on again like giving a `novalidate` attribute and preventing for submission for invalid forms or like declaring a proper name attribute. 

The the most repitive part by far is validation. I understand why the angular-developers want to give us the freedom, of doing this stuff in the most flexible manner, but I personally like to keep things consistent, which is hard with how forms work out of the box.`ng-fab-form` tries solve all of those issues without requiring you to change anything. Just set your forms up as usual and let `ng-fab-form` do the rest for you. 

There are also a lot of [form builders and other directives](https://github.com/search?o=desc&q=angular+form&s=stars&type=Repositories&utf8=%E2%9C%93) out there. But most of the time you have to implement quite a different markup, to make those work. `ng-fab-form` takes another approach, by extending how forms work application-wide.

[Bug-reports or feature request](https://github.com/johannesjo/ng-fab-form/issues) as well as any other kind of **feedback is highly welcome!**

## getting started

Install it via bower:
```
bower install ng-fab-form angular-messages -S
```
And add `ngFabForm` and `ngMessages` as dependency in your main module:
```
angular.module('yourApp',[
  'ngFabForm',
  'ngMessages'
]);
```
Thats all you need to do to get started.

## features

Have a look at the [DEMO](http://johannesjo.github.io/ng-fab-form#demo)!

Keep in mind that if you don't like one of the functionalities, ng-fab-form is build with customization in mind. **It's possible to disable almost any feature easily in your app configuration**.

It automatically:

* appends configurable validation messages (using `ng-messages`, [see](https://docs.angularjs.org/api/ngMessages/directive/ngMessages)) to any element  with a validation directive on it like `required`, `ng-required`, `ng-pattern`, `ng-minlength` and so on
* adds a validation directive in case you have an exception to the rule
* adds `name` attributes based on ng-model, if none is set
* adds a `novalidate` attribute to forms
* prevents submission of invalid forms
* adds an option to disable a form completly via a `disable-form` attribute
* adds a trigger to show field validations after the user tries to submmit
* prevents double submissions of forms when double clicked via a configurable delay
* scrolls to and focusses the first form element with an error, if the submission fails
* tries to set an asterisk to the corresponding label, if `required` or `ng-required` is set
* should work with any custom validation directive you have running in your project (as long as they're correctly working with the ngModel-Controller)

## configuring options

Currently the configuration object of ng-fab-forms looks like this.
```
showErrorsOn: [
    '$touched', // if element was focussed 
    '$dirty' // if element was edited
],

// add noovalidate to forms
setNovalidate: true, 

// add asterisk to required fields
setAsteriskForRequiredLabel: false, 

// asterisk string to be added if enabled
asteriskStr: '*', 

// prevent submission of invalid forms
preventInvalidSubmit: true,

// prevent double clicks 
preventDoubleSubmit: true, 

// double click delay duration
preventDoubleSubmitTimeoutLength: 1000, 

// show validation-messages on failed submit
setFormDirtyOnSubmit: true, 

// autofocus first error-element
scrollToAndFocusFirstErrorOnSubmit: true, 

// set either to fixed duration or to 'smooth'
// 'smooth' means that the duration is calculated, 
// based on the distance to scroll (the more the faster it scrolls)
scrollAnimationTime: 'smooth',

// fixed offset for scroll to elment
scrollOffset: -100,

// option to disable forms by wrapping them in a disabled <fieldset> elment
disabledForms: true,

// event-name-space, usually you won't need to change anything here
eventNameSpace: 'ngFabForm',

// the validation message prefix, results for the default state
// `validation-msg-required` or `validation-msg-your-custom-validation`
validationMsgPrefix: 'validationMsg'

// uses advanced dynamic validations,e .g. for min and max
useAdvancedValidationMsgs: true,
dateFormat: 'dd.MM.yy',
timeFormat: 'HH:MM'
```
You can easily extend those configurations like this
```javascript
angular.module('exampleApp', [
    'ngFabForm',
    'ngMessages'
])
    .config(function (ngFabFormProvider)
    {
        ngFabFormProvider.extendConfig({
            scrollToAndFocusFirstErrorOnSubmit: false,
            setNovalidate: false
        });
    });

```

## configuring default messages

Like the options, the default messages are an easily configurable 
```javascript
angular.module('exampleApp', [
    'ngFabForm',
    'ngMessages'
])
    .config(function (ngFabFormProvider)
    {
        ngFabFormProvider.extendValidationMessages({
            required: 'This field is required!!!',
            maxlength: 'Your input is way too long',
            minlength: 'Your input is just short',
            email: 'This is not a gmail-address'
        });
    });

```

## special validations (e.g. ng-pattern)

Sometimes you might want to have another text for a specifc context. Special validation-messages like this are easily added like this:
```html
<input type="text"
       mg-model="my-model"
       ng-pattern="/abcdefg/"
       vallidation-msg-pattern="Not abcdefg :(">
```

## advanced validations (eg. min & max display attribute value)

For some validation attributes it might be nice to to display the value provied, as the chracter count for `minlength` or the earliest date, when using `min` for a date input field. If you want to modify the default values provided or add mew ones, you can do that like this:

```javascript
angular.module('exampleApp', [
    'ngFabForm',
    'ngMessages'
])
    .config(function (ngFabFormProvider)
    {
        ngFabFormProvider.extendAdvancedValidations([
           // for all inputs, textareas, and selects with...
        {
            // ...the attribute `maxlength` return the following validation message
             maxlength: function (attrs)
            {
                return 'Your input should have max ' + attrs.maxlength + ' characters';
            },
            minlength: function (attrs)
            {
                return 'Your input should have at least ' + attrs.minlength + ' characters';
            }
        },
        // date-fields
        {
           // for all inputs with the attribute type="time"...
            type: 'time',
            // ...and the attribute min or...
            min: function (attrs)
            {
                return 'The time provided should be no earlier than {{"' + attrs.min + '"|date:"' + config.timeFormat + '"}}';
            },
            // ... max return the following validation message.
            max: function (attrs)
            {
                return 'The time should be no later than {{"' + attrs.max + '"|date:"' + config.timeFormat + '"}}';
            }
        }
        ]);
    });
    
```


## advanced configuration

Furthermore you can adjust the validation template to your needs:

```javascript
angular.module('exampleApp', [
    'ngFabForm',
    'ngMessages'
])
    .config(function (ngFabFormProvider)
    {
        var customTplFn = function (ngShowCondition, formName, elName, messages)
            {
                var msgs = '';
                angular.forEach(messages, function (msg, key)
                {
                    msgs += '<li ng-message="' + key + '">' + msg + '</li>';
                });

                return '<div ng-show="' + ngShowCondition + '"' +
                    'ng-messages="' + formName + '.' + elName + '.$error" ' +
                    'class="help-block with-errors">' +
                    '<ul class ="list-unstyled">' +
                    msgs +
                    '</ul></div>';
            };
        ngFabFormProvider.setWrapperTplFunction(customTplFn);
    });
    
```

And edit where and how the messages are inserted in relation to their corresponding form-element:

```javascript
angular.module('exampleApp', [
    'ngFabForm',
    'ngAnimate'
])
    .config(function (ngFabFormProvider)
    {
        var customInsertFn = function (compiledAlert, el, attrs)
            {
                // insert after or after parent if checkbox or radio
                if (attrs.type === 'checkbox' || attrs.type === 'radio') {
                    el.parent().after(compiledAlert);
                } else {
                    el.after(compiledAlert);
                }
            };
        ngFabFormProvider.setInsertErrorTplFn(customInsertFn);
    });
    
```

## ❤ contribute ❤

I'm happy for any [issue or feature request](https://github.com/johannesjo/ng-fab-form/issues), you might encounter or want to have. Even a one liner is better, than no feedback at all. Pull requests are also highly welcome. Just fork the repository, clone it and run `grunt serve` for development.

`ng-fab-form` is published under the [The GNU Lesser General Public License V2.1](https://github.com/johannesjo/ng-fab-form/blob/master/LICENSE).






