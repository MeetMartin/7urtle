(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{495:function(e,n,t){"use strict";t.r(n);var a=t(54),o=t.n(a),r=t(1),l=t.n(r),i=t(5),s=t(27),c=t(29),u=t(44),m=t(103),d=t(39),p=t(6),f=t(51),g=t(11),h=[{name:"Functions to rule everything"},{name:"Pure functions"},{name:"First-class functions"},{name:"Partial Application"},{name:"Function composition"}],E=function(e){return"lambda-"+Object(p.s)(Object(p.x)("-")(/ /g)(e))};n.default=function(){var e=Object(r.useState)(!1),n=o()(e,2),t=n[0],a=n[1];return Object(r.useEffect)((function(){return window.addEventListener("scroll",(function(){return window.pageYOffset>0?a(!0):a(!1)}))}),[]),l.a.createElement(s.a,null,l.a.createElement("header",{className:"whiteBackground"},l.a.createElement(i.i,null,l.a.createElement("h1",null,l.a.createElement("div",null,l.a.createElement("strong",null,"@7urtle"),"/lambda"),"JavaScript functional programming basics"))),l.a.createElement("article",{className:"whiteBackground textLeft pb6 plr1"},l.a.createElement(i.i,null,l.a.createElement(i.t,null,l.a.createElement(i.g,{md:"3",className:"LearnSideMenu d-none d-md-block"},l.a.createElement("p",null,l.a.createElement(f.a,{target:g.b.Learn},"‹ Learn")),l.a.createElement("h2",{className:"pt-0"},"JavaScript functional programming basics"),l.a.createElement(d.a,{contents:h,sorted:!1})),l.a.createElement(i.g,null,l.a.createElement("p",null,l.a.createElement("strong",null,"JavaScript")," is an amazing programming language that rules the internet. No modern web application is done without it. ",l.a.createElement("strong",null,"JavaScript")," is a multiparadigmatic language that supports ",l.a.createElement("strong",null,"both object-oriented and functional approach to programming"),"."),l.a.createElement("h2",{className:"pt-2",id:E(h[0].name)},h[0].name),l.a.createElement("p",null,"Functional programming is based on the use of functions and functors. Since ES6, JavaScript offers ",l.a.createElement("strong",null,"arrow functions")," for concise lambda expressions:"),l.a.createElement(u.a,{language:"javascript",code:"const myFunction = value => 'I am ' + value;\n\nmyFunction('a turtle'); // => 'I am a turtle';"}),l.a.createElement("p",null,"Which is equivalent to:"),l.a.createElement(u.a,{language:"javascript",code:"const myFunction = function (value) {\n    const result = \"I am \" + value;\n    return result;\n};\n\nmyFunction('a turtle'); // => 'I am a turtle';"}),l.a.createElement("p",null,"To follow functional programming practices, you should understand ",l.a.createElement("strong",null,"pure functions"),", ",l.a.createElement("strong",null,"first-class functions"),", ",l.a.createElement("strong",null,"partial application"),",  and ",l.a.createElement("strong",null,"function composition"),"."),l.a.createElement("h3",{id:E(h[1].name)},h[1].name),l.a.createElement("p",null,l.a.createElement("strong",null,"A pure function is a function in which output depends only on its input without any side effects.")," ",l.a.createElement("strong",null,"Side effect")," is any change of variables outside of the function's scope (in functional programming that is called ",l.a.createElement("strong",null,"mutation"),". ",l.a.createElement("strong",null,"Side effect")," is also any reading or writing into IO like console log, file reading, database updating and so on."),l.a.createElement("p",null,"In ",l.a.createElement("strong",null,"functional programming"),", ",l.a.createElement("strong",null,"side effects")," are managed through ",l.a.createElement("strong",null,"monads"),". ",l.a.createElement("strong",null,"Monads")," make working with side effects more explicit and safe while ensuring general programming best practices."),l.a.createElement("p",null,l.a.createElement("strong",null,"Side effects"),", like reading variables outside of functional scope, may not feel particular dangerous to you. Code like this is quite common:"),l.a.createElement(u.a,{language:"javascript",code:"let tortoises = 'Leonardo';\n\nconst addDonatelo = function () {\n    tortoises = tortoises + ' and Donatelo';\n};\n\naddDonatelo(); // => tortoises is 'Leonardo and Donatelo'\ntortoises = tortoises.toUpperCase();\naddDonatelo(); // => tortoises is 'LEONARDO AND DONATELO and Donatelo"}),l.a.createElement("p",null,l.a.createElement("code",null,"addDonatelo")," in the example depends on ",l.a.createElement("code",null,"tortoises")," variable which is outside of its scope. The danger lies in the fact that any part of the code can change the value of counter, not just your function. That means that it is impossible to know the effect of ",l.a.createElement("code",null,"addDonatelo")," without knowing the current value of ",l.a.createElement("code",null,"tortoises"),". At the same time ",l.a.createElement("code",null,"addDonatelo")," is also harder to test because you have to mock all your dependencies for any unit test of a function. In a real application such dependencies are often very complicated and lead to unpredictable code that is hard to test."),l.a.createElement("p",null,"Functional code is much easier to reason about because pure functions are dependent only on their input."),l.a.createElement(u.a,{language:"javascript",code:"const addDonatelo = currentCounter => tortoises + ' and Donatelo';\naddDonatelo('Leonardo'); // => 'Leonardo and Donatelo'\naddDonatelo('Leonardo'); // => 'Leonardo and Donatelo'"}),l.a.createElement("p",null,l.a.createElement("code",null,"addDonatelo")," in the functional example is a ",l.a.createElement("strong",null,"pure function")," that depends only on its input. You can always easily say what it's output is going to be."),l.a.createElement("p",null,"Functions in a ",l.a.createElement("strong",null,"functional programming")," are declarative lambda expressions that represent a mapping from their inputs to its outputs. That is a very important principle."),l.a.createElement("p",null,l.a.createElement("strong",null,"JavaScript")," itself is quite unpredictable because some of its functions are pure and some are not."),l.a.createElement(u.a,{language:"javascript",code:"let me = 'Martin';\nlet us = ['Petra', 'Martin'];\n\nlet newMe = me.toUpperCase();\nlet newUs = us.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);\n\nme === newMe; // false, toUpperCase is pure, it did not mutate the me variable\nus === newUs; // true, sort is impure, it mutated the us variable"}),l.a.createElement("p",null,"In ",l.a.createElement("strong",null,"@7urtle/lambda")," functions are made predictable and pure."),l.a.createElement(u.a,{language:"javascript",code:"import {upperCaseOf, sort} from '@7urtle/lambda';\n\nlet me = 'Martin';\nlet us = ['Petra', 'Martin'];\n\nlet newMe = upperCaseOf(me);\nlet newUs = sort((a, b) => a < b ? -1 : a > b ? 1 : 0)(us);\n\nme === newMe; // false, upperCaseOf is pure, it did not mutate the me variable\nus === newUs; // false, sort is now also pure, it did not mutate the us variable"}),l.a.createElement("p",null,"Because ",l.a.createElement("strong",null,"functional programming")," works with pure functions, all variables are ",l.a.createElement("strong",null,"immutable constants"),". In practice, in ",l.a.createElement("strong",null,"JavaScript"),", that means in your code you should not need to change any variables. All code logic is expressed by functions mapping inputs to outputs."),l.a.createElement("h3",{id:E(h[2].name)},h[2].name),l.a.createElement("p",null,l.a.createElement("strong",null,"First-class function is a function that takes a function as its input or it returns a function."),"It can be obvious to you, because in ",l.a.createElement("strong",null,"JavaScript")," you regularly assign your functions into a constant."),l.a.createElement(u.a,{language:"javascript",code:"const myFunction = function (value) {\n    return value + 1;\n};\nconst myArrowFunction = value => value + 1;\n// both myFunction and myArrowFunction are pure functions saved in a constant variable\n\nconst myFirstClassFunction = function (fn, value) {\n    return fn(value);\n};\nconst myFirstClassArrowFunction = (fn, value) => fn(value);\n// both myFirstClassFunction and myFirstClassArrowFunction expect their first argument fn\n// to be a function\n\nconst myCurriedFunction = function (fn) {\n    return function (value) {\n        return fn(value);\n    };\n};\nconst myCurriedArrowFunction = fn => value => fn(value);\n// both myCurriedFunction and myCurriedArrowFunction are curried functions that return\n// a function after receiving their first argument.\n\nmyCurriedFunction(myFunction)(1) === myCurriedArrowFunction(myFunction)(1); // true"}),l.a.createElement("p",null,"The use of ",l.a.createElement("strong",null,"first-class functions")," is instrumental to ",l.a.createElement("strong",null,"currying"),", ",l.a.createElement("strong",null,"partial application"),", and ",l.a.createElement("strong",null,"function composition"),"."),l.a.createElement("h3",{id:E(h[3].name)},h[3].name),l.a.createElement("p",null,"When defining functions that depend on multiple arguments, you would usually do something like this:"),l.a.createElement(u.a,{language:"javascript",code:"const add = function (a, b) {\n    return a + b;\n };\n \n add(1, 2); // => 3"}),l.a.createElement("p",null,"In functional programming, the best practice is to define all your functions curried. That means that after your function is called with its first argument it returns a function expecting the next argument until all arguments are received. This approach helps with reusability of your code as your function will lend themselves nicely to be combined into other functions through ",l.a.createElement("strong",null,"partial application")," and ",l.a.createElement("strong",null,"function composition"),"."),l.a.createElement(u.a,{language:"javascript",code:"const add = a => b => a + b;\n\nadd(1)(2); // => 3\n\nconst add5 = b => add(a)(b);\nconst add5PointFree = add(a);\n\nadd5(5) + add5PointFree(5); // 20"}),l.a.createElement("p",null,"In ",l.a.createElement("strong",null,"@7urtle/lambda")," functions are defined to support being called as both curried unary or common n-ary function so that you can adopt the style as you choose."),l.a.createElement(u.a,{language:"javascript",code:"import {substr} from '@7urtle/lambda';\n\n'7urtle'.substr(0, 1); // => '7', original JavaScript\nsubstr(1)(0)('7urtle'); // => '7'\nsubstr(1, 0, '7urtle'); // => '7'"}),l.a.createElement("p",null,"You may also notice that ",l.a.createElement("strong",null,"@7urtle/lambda")," follows a specific logic of order for inputs. That is to make all function ideal for ",l.a.createElement("strong",null,"function composition"),"."),l.a.createElement("h3",{id:E(h[4].name)},h[4].name),l.a.createElement("p",null,"Classes in object-oriented programming allow you to organize your code into logical models of the world. Instances of classes have their own scope, you can inherit methods and so on. Functional programming doesn't need classes, instead we model our code by flexible function composition."),l.a.createElement("p",null,"As pure functions just map inputs into outputs we then take those outputs and use them as inputs for our next function in the row. This way simple functions come together to build complex logic."),l.a.createElement("p",null,"As an example we will build a function magic that will take a list of names as its input and return an upper-case string of those names alphabetically ordered. Let's do it first imperatively without ",l.a.createElement("strong",null,"@7urtle/lambda"),":"),l.a.createElement(u.a,{language:"javascript",code:"const names = ['Petra', 'luci', 'MARTIN'];\n\nconst sortingAZ = function (ao, bo) {\n    const a = ao.toUpperCase();\n    const b = bo.toUpperCase();\n    \n    if (a < b) {\n     return -1;\n    }\n    \n    if (a > b) {\n     return 1;\n    } else {\n      return 0;\n    }\n};\n\nconst magic = function (names) {\n    const sorted = names.sort(sortingAZ);\n    \n    let result = '';\n    sorted.forEach(function (name) {\n      result = result + name + ' ';\n    });\n    \n    return result.trim().toUpperCase();\n};\n\nmagic(names); // LUCI MARTIN PETRA"}),l.a.createElement("p",null,"Now let's do the same declaratively using function composition and ",l.a.createElement("strong",null,"@7urtle/lambda"),":"),l.a.createElement(u.a,{language:"javascript",code:"import {reduce, sortAlphabetically, upperCaseOf, compose} from '@7urtle/lambda';\n\nconst names = ['Petra', 'luci', 'MARTIN'];\n\nconst justString = list => reduce('')((a, c) => a + ' ' + c)(list);\n\nconst magic = compose(upperCaseOf, justString, sortAlphabetically);\n// the same as const magic = value => upperCaseOf(justString(sortAlphabetically(value)));\n\nmagic(names); // LUCI MARTIN PETRA"}),l.a.createElement("p",null,"Once you get familiar with ",l.a.createElement("strong",null,"functional programming")," syntax you will be able to write much shorter, reusable, and robust code that follows general programming best practices."))))),l.a.createElement(c.a,null),t&&l.a.createElement(m.a,{scrolled:t,setScrolled:a}))}}}]);