# `esc`

## tl;dr
`esc` is a hands-off web application framework that uses HTML markup and
browser APIs, with a few dabs of JS to glue everything together.

## Features
Breathe also supports anything you might expect from a web app framework,
including:
 * components, including scoping, lifecycle, and composition
 * conditional rendering
 * one- and two-way binding and bind-by-value
 * event handling
 * state management
 * server-side rendering
 * hot module reloading
 * resource caching

## Server-Side Rendering
Since the browser does all the rendering, what Breathe provides is actually
more like precompiling. It simply does as much of the work ahead of time as it
can. All you need to do is run `yarn add -D breathe-cli` and add
`yarn breathe-cli` to your favorite build management tool.

## Hot Module Reloading
Why is this always limited to development servers? Why does it have to be so
complicated to install and configure? It shouldn't be, and it's dead simple with
Breathe. If you're willing to do a little server configuration--and we've got
excellent instructions for it--all you have to do is run
`yarn add -D breathe-hmr` and `yarn breathe-hmr start`, and when you build
with breathe-cli (in development or deployment!) it will magically reload
anything that changed, for every browser session, up to and including breathe.js
itself.

## Caching
Because Breathe uses all of the normal resources a browser expects, it can take
full advantage of browser caching. breathe-cli has a simple config option to
enable the browser side of far-future caching, and configuring your favorite
static resource server is most likely very well documented.

## Testing
Since component templates are just HTML, they integrate perfectly with any
test framework that can run browser tests, letting you write test cases at the
component level.
