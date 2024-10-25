# Lion Example

Example Web Component using Design Tokens.

Used Lion/Lit because it's a fairly simple run-time-only base layer that is close to the platform, so this example will be easy to abstract and apply to any framework (e.g. React).

## Tokens structure

There are three layers:

- Core
- Semantic
- Component (only button as of now)

We have two dimensions of themes:

- Brand (casual, business)
- Color (blue, green, purple)

The core layer is not theme-dependent.

The semantic layer has tokens that change based on the theme, they refer to different core tokens depending on the theme.

The button layer refers to either core tokens or semantic tokens, and some of those semantic tokens depend on the theme, making the button also partially theme-dependent.
It is important for component tokens to be "dumb" tokens, e.g. they are just references only. They don't have any logic to them like math or color modifiers.
This allows us to use `outputReferences` and ensure that component tokens are output as references to semantic/core layer.
That way, no matter what the theme selection is, the same CSS rules apply for component tokens, hence we have only a single `button.css` output file, and not `button-casual-green.css`.

Without `outputReferences` for our component tokens, a component specific stylesheet for each theme permutation is necessary, switching out the semantic CSS is not enough then.
Every UI component class will then be responsible for switching to the right stylesheet, [which is something we did earlier in this project](https://github.com/tokens-studio/lion-example/tree/b1c3c6a247956a5c3420c3073f8fb33bfbc40e85). The tradeof is that your components are more isolated / encapsulated, the drawback is that each UI component contains more CSS rules.
Often, multiple UI components are used on the same page so at that point, it's often better to make the components more lightweight and require the user to load the semantic CSS custom property that the components depend on.

Lastly, there is a `$themes.json` file containing metadata about which theme dimensions exists (noted by `group` property) and which variations exist within each dimension (noted by `name` property). Each variation has a `selectedTokenSets` array property showing which tokensets are enabled for this theme variation.

> The difference between "source" and "enabled" values is **not relevant** in the scope of lion-example / Style Dictionary.

## Preventing redundancy

It's important to note here that we want to load as few styles as possible, there should be 0 redundancy.

What that means is:

- if we don't load a button component on the page, no button tokens should be loaded
- if we are in `business-purple` theme initially, no other theme-specific tokens that are not for `business-purple` should be loaded
- if we switch themes, only the tokens that change should be loaded and replace the old theme's tokens that have now become redundant

By setting these rules we are targeting:

- Lowest initial load time (fewest amount of bytes of CSS loaded initially), to reduce bounce-rate of end-users leaving our app because it loads too slow
- Minimal load time upon theme switch, to ensure the app feels responsive and quick during customization

## Style-Dictionary setup

Given our tokens structure and the rules we've set with regard to minimizing redundancy, we would like to output a couple of different files:

- Core tokens, in case Application developers of our hypothetical design system want to consume straight from core. Not all design systems will allow their consumers to do that, because some design systems are more strict about their guidelines.

- Semantic tokens, Application developers of our hypothetical design system will need these. Think of layouting the app, spacers, giving the footer or header a semantic color, ensuring the text content on the app consumes from the semantic text tokens (e.g. Header1, Header2, paragraphText).

- Component tokens, they're often consumed by the Design System itself as they publish UI components for their app developers to use in their apps.

The main two features that we use for filtering and splitting outputs:

- [Style-Dictionary "Filters"](https://amzn.github.io/style-dictionary/#/formats?id=filtering-tokens)
- Using JavaScript to dynamically generate an array of [Style-Dictionary "Files"](https://amzn.github.io/style-dictionary/#/formats?id=using-formats)
- `outputReferences` option for the built-in css/variables format, to output references for our component tokens

### Core

This layer is pretty simple to expose, we can just create a filter that filters all of our tokens that come from our "Core" tokenset (`core.json`). Since these are not theme-dependent, a single `core.css` output is enough.

### Semantic

This layer is partially theme-dependent, so we have to create two outputs:

- a theme-dependent CSS file e.g. `semantic-business-blue.css` which contains only the tokens that may change by theme.
- a CSS file with the semantic tokens that do not change by theme: `semantic.css`.

We can repeat the above for every theme permutation. The application developer is then responsible for always loading the `semantic.css` and conditionally loading the theme-specific semantic CSS file based on the current theme chosen by the end user.

### Component

This layer is partially theme-dependent in the sense that it outputs reference to the theme-dependent layer (semantic).
Due to using CSS custom variables as a way to output references to this semantic layer, we only need to generate a single `button.css` file with that component's tokens.

We can repeat the above for every component that we have. The design system developer is then responsible for loading the `button.css` as a dependency of the Button component.

## Initial loading of stylesheets

For core/semantic tokens, load them on page load if your page depends on them.
That includes if you have UI components on the page that use them, so probably always.

In this project, we only load the semantic tokens, they reference the core but we output resolved values in CSS.
It is definitely possible to use `outputReferences` for the semantic layer,
but there is no real benefit as the core layer that it references is static (not theme-dependent).
It would just lead to more lines of CSS in this case, since you'd need to load both the semantic and the core layer on the page.

Since we split our static semantic tokens in its own `semantic.css` file, and the dynamic theme-dependent tokens in their own respective `semantic-{brand}-{color}.css` files,
you will want to load the static file immediately.
Then, load the semantic file of the currently active theme by loading the currently active theme preference e.g. from local storage, or Operating System default.
It is recommended to load the user preference in a render-blocking manner to prevent a flash of unstyled or unthemed UI.
One approach could be to do this server-side by putting the theme preference inside the user's cookies so that the server can respond with an HTML response with the correct initial CSS links.
A modern approach is by using a [render-blocking module script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#blocking), although this specification has yet to land inside all evergreen browsers, [see Can I Use status](https://caniuse.com/mdn-html_elements_script_blocking).

For component tokens, load the CSS files with the component.
Loading a UI component can be done lazily when the component becomes visible (Intersection Observer).

## Switching stylesheets

Upon theme switching, assuming this is possible in the application as a run-time action, you'll have to swap out the old themed stylesheets with the new themed stylesheets.

In this repository we have an example in our theme handler utility that does this for our semantic tokens:

```js
const { default: sheet } = await import(
  `./semantic-${this.brand}-${this.color}.css`,
  {
    with: { type: "css" },
  }
);

// we mark this sheet as a "theme" sheet so we know to remove it for future swaps
sheet.theme = true;
// our component has a shadowRoot, so we can just apply the sheet on it so its styles don't leak outwards
document.adoptedStyleSheets = [
  // remove the old sheet
  ...document.adoptedStyleSheets.filter((sheet) => !sheet.theme),
  // add the new sheet
  sheet,
];
```

Depending on what kind of framework or styling solution you use, there may or may not be a convenient way to swap themes on an application or component basis.
In any case, the above approach works in a Vanilla JavaScript context, both for Web Components (use `this.shadowRoot.adoptedStyleSheets`) or on the document itself (app-level).
