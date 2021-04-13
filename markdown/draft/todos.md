# PREORDERS

* Add link to main site menu beside Table of Contents
* Style preorder link at bottom of chapters
* Set up webhooks for preorder codes
 -- set up order refund hook
 -- set up order chargeback hook
 -- set up order failed hook (if required)
* Before going live make sure all URLS point to discoverthreejs.com
 -- webhook urls
 -- order success url (/preorders/success)
* Add Apple Pay
* Add PayPal express
* Test AliPay

# STYLES
TODO-POSTLAUNCH: Style update_details page
TODO-POSTLAUNCH: Test all colors for contrast and color blind in day and night themes
TODO-LOW: reduce margin/padding for asides/figures/scenes etc. on mobile
TODO-LOW: color of links in asides need to be improved in dark mode

# USERS

TODO-PRELAUNCH: Function to display changes since last login
TODO-PRELAUNCH: setup SOCIAL_AUTH_NEW_ASSOCIATION_REDIRECT_URL when multiple social auth types are setup
TODO-PRELAUNCH: investigate https://github.com/django-guardian/django-guardian
TODO-POSTLAUNCH: support cropping non-square avatars
TODO-POSTLAUNCH: Disconnect social auths function

# SITE
TODO-HIGH: preorder banner heading shouldn't get anchor link
TODO-LOW: "includeInSitemap" template variable not defined for all pages e.g. preorders
TODO-LOW: "classes" template variable not defined for all pages e.g. preorders
TODO-LOW: <main> may be defined multiple times for some templates
TODO-LOW: fix login error - can't set attribute when logging in with Github
****
TODO-LOW: use intersection observer to load/unload iframes
TODO-LOW: check how shared links look in twitter, FB, whatsapp, imessenger etc.
TODO-LOW: preload ide script and chapters late setup script
TODO-LOW: add warning when dynamic polyfill is not supported
TODO-LOW: Check manifest errors in Chrome dev tools

TODO-PRELAUNCH: all three.js example iframes should be hosted by me to event upstream changes breaking shit
TODO-PRELAUNCH: add button pause all inline scenes and animations (reduced motion)
TODO-PRELAUNCH: add button to require all inline scene and animations don't load immediately (low performance)
TODO-PRELAUNCH: serve responsive images (add auto pre-processor to create multiple image sizes)
TODO-POSTLAUNCH: fix app/loader
TODO-POSTLAUNCH: make katex pre-rendered
TODO-POSTLAUNCH: make prism.js pre-rendered
Problem: line numbers https://github.com/PrismJS/prism/issues/1945

TODO-POSTLAUNCH: gzip glb files
TODO-POSTLAUNCH: Fix search
TODO-POSTLAUNCH: lightbox images
TODO-POSTLAUNCH: ssr latex https://katex.org/docs/api.html
TODO-POSTLAUNCH: it would be interesting for users who purchased the book to have a system of bookmark, or something allowing to mark a section as read. This way, you know where to start from when you come back after a long break. (alaric)
TODO-POSTLAUNCH: Add endorsements section
TODO-POSTLAUNCH: Put a badge saying r120 (or whatever) on the front page that links to the section explaining that the book is always up to date. There, mention what version of three.js is used throughout the book
TODO-POSTLAUNCH: as many inline scenes as possible should use rendering on demand
TODO-POSTLAUNCH: host all three.js examples locally so that changes on the repo don't break things

# PAYMENTS

TODO-PRELAUNCH: add possibility to purchase more than one account at once
TODO-PRELAUNCH: Add "pay it forward" low income accounts
TODO-PRELAUNCH: add other pay types: bank, apple, google

# PACKAGES

TODO-PRELAUNCH: Create design for each package
TODO-PRELAUNCH: Decide difference between packages
TODO-PRELAUNCH: Decide on name for each package

# IDE

TODO-LOW: add license file to zip package
TODO-LOW: if IDESwitchImportsAllow = false, hide select menu
TODO-LOW: selected file/folder doesn't highlight in menu
TODO-POSTLAUNCH: ssr html structure for editor to prevent page reflow on load
TODO-POSTLAUNCH: clicking on icon in file tree should select row, at the moment clicking on text is required
TODO-POSTLAUNCH: create compressed versions of three.js and replace editor scripts with those
TODO-POSTLAUNCH: https://codesandbox.io/docs/api add option to open in codesandbox
TODO-POSTLAUNCH: https://stackoverflow.com/questions/14924362/capture-console-log-of-an-iframe - add preview logs to panel
TODO-POSTLAUNCH: add link rel=preload to inline example scripts (done, but seems to make page load time worse)
TODO-POSTLAUNCH: add axeshelper to built-in-geometries
TODO-POSTLAUNCH: showing texture preview not working
TODO-POSTLAUNCH: preview glb files in editor
TODO-POSTLAUNCH: add esprima for code complete
TODO-POSTLAUNCH: add glsl mode to codemirror

# CHAPTERS

TODO-LOW: organizing with group remove camera controls from snake scene
TODO-LOW: later go over these two sections on front page: about the author/tips and tricks
TODO-PRELAUNCH: test all challenges
TODO-POSTLAUNCH: possibly add a chapter explaining how three.js and 3D in the browser works, i.e. how everything is drawn inside a canvas element, WebGL/WebGPU, canvas2D, and how this relates to the rest of the web page, or to a traditional web app
TODO-POSTLAUNCH: add chapter on AR/VR to to free section. Should be as simple as possible, just convert the birds scene
TODO-POSTLAUNCH: explain these in JS ref chapter:

* Map
* Set
* setTimeout and clearTimeout
* setInterval and clearInterval
* ternary operator
* destructuring assignment
* rest parameters (?)
* class fields and private fields

# SEO

Steal OG tags from here https://davidwalsh.name/twitter-cards
Get twitter card to show large image
No need to duplicate twitter and OG properties
Add more link rel="xyz"
https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel

# Pre-release checks

* check js disabled
* cross browser visual inspection
* mobile browser visual inspection
* check that links going between book sections are correct
* Make sure django file logging is disabled

TODO-LOW: do these pre-build checks automatically
* bump version number in config/settings/base.py

## Automatic checks
* make sure no "import logging" in django
* Make sure 127.0.0.1 hasn't sneaked into any links

wheredipstherockyhighland