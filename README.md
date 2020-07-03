## What is a ToDo-app?

It is a clone of a **Google Keep** that is used to improve my frontend skills.
A main idea was to create a basic functionality in a **React+Redux** style.
Then it must be easy to rewrite this application using modern framework.

---

### Stage 1: Reinvent the wheel `completed`

I might start by simply using a `create-react-app` and have everything working somehow.
But that wasn't my goal.
At first I wanted to come through all steps of building a frontend application including **Webpack** and **ESLint** configuration, adding specific loaders (e.g. `sass-loader`) and so on.

I had set up my webpack config so I was able to see results in a browser (development build) and to get a minified and **Babel**-transpiled version (production build) as well.

ESLint config includes **Airbnb** rules and excludes **Prettier**-conflicted rules.

I wanted my application to have some business logic (a store with a state) so I can redraw the app when the state have changed.
Here i come close enough to what i've might do with Redux (`dispatch` method, action reducers).

I started with a simple markup that was using **Sass** stylesheets. Markup was splitted into separate templates within an HTML file so i could reuse them.

Simple example of such a template:

```html
<div id="template-container" class="template">
  <div class="container" id="container">
    <div class="container__item"></div>
  </div>
</div>
```

Template's instances are configured by a **setup** functions which are created by `setupBuilder`.

The main problem with such an approach is that it has no **virtual DOM** like React has. This leads to user experience suffers from blinking and focus losses.
Template system can't benefit from composition as **JSX** does, though it has some perspective in extensibility after some improvements.

So after i took some important application setup skills, practiced in vanilla JS and understood problems solved by React, I decided to go to a stage 2.

My expectations from the stage 1 was to implement all basic functionality of the original application.
But it makes no sense because of the problems mentioned above.

### Stage 2: Modernization `in process`

Making a React+Redux based full featured clone...

### Stage 3: Broadening horizons

Experiments with approaches and technologies...
