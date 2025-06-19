
<a name="v3.0.0"></a>
## [v3.0.0](https://github.com/aleyoscar/resurrexit/compare/v2.4.1...v3.0.0) (2025-06-19)

### Feat

* **web:** Added psalm slug to index
* **web:** Added style helper classes
* **web:** Added custom list creation. Closes [#5](https://github.com/aleyoscar/resurrexit/issues/5)
* **web:** Added account management page
* **web:** Client-side form validation
* **web:** Added 'new password' field to authentication form.
* **web:** Added required asterisk (*) to forms
* **web:** Added authentication

### Fix

* **core:** Updated build source in gen-chglog.sh
* **docs:** Fix README link
* **web:** Fixed validation helper functions
* **web:** Reset form when modal is opened
* **web:** Close any modals previously opened.

### Refactor

* **core:** Freezing to 'pb_public' folder
* **core:** Using pocketbase as front and backend server
* **core:** Switching to docker deployment
* **core:** Replacing PHPMailer with PocketBase
* **web:** Moved auth error to it's own function
* **web:** Changed authentication state events
* **web:** Changed logged in/logged out classes
* **web:** Removed theme text
* **web:** Removed unused icons
* **web:** Renamed 'modals.jinja' to 'tools.jinja'


<a name="v2.4.1"></a>
## [v2.4.1](https://github.com/aleyoscar/resurrexit/compare/v2.4.0...v2.4.1) (2025-06-10)

### Feat

* **web:** Search on submit
* **web:** Remember theme choice using cookies. Closes [#6](https://github.com/aleyoscar/resurrexit/issues/6)

### Fix

* **web:** Every word in search must be in psalm text. Closes [#4](https://github.com/aleyoscar/resurrexit/issues/4)


<a name="v2.4.0"></a>
## [v2.4.0](https://github.com/aleyoscar/resurrexit/compare/v2.3.0...v2.4.0) (2025-06-09)

### Feat

* **book:** Added lyrics
* **core:** Check that all audio has a lyric file
* **core:** Update README and sw with new tag
* **docs:** Tools.py comments
* **web:** Removed source link

### Fix

* **book:** Reconciled audio sources. Closes [#8](https://github.com/aleyoscar/resurrexit/issues/8)
* **web:** More readable page title
* **web:** Sort audio sources. Fixes [#9](https://github.com/aleyoscar/resurrexit/issues/9)

### Refactor

* **web:** Change template extensions to 'jinja'


<a name="v2.3.0"></a>
## [v2.3.0](https://github.com/aleyoscar/resurrexit/compare/v2.2.1...v2.3.0) (2025-05-27)

### Feat

* **core:** Update version info in README and sw
* **web:** PWA functionality

### Refactor

* **web:** Changed ' to "


<a name="v2.2.1"></a>
## [v2.2.1](https://github.com/aleyoscar/resurrexit/compare/v2.2.0...v2.2.1) (2025-05-21)

### Feat

* **web:** Update contact form styles/function. Closes [#1](https://github.com/aleyoscar/resurrexit/issues/1). Closes [#2](https://github.com/aleyoscar/resurrexit/issues/2).

### Refactor

* **web:** Moved config to volume


<a name="v2.2.0"></a>
## [v2.2.0](https://github.com/aleyoscar/resurrexit/compare/v2.1.0...v2.2.0) (2025-05-21)

### Feat

* **core:** Create release zip
* **core:** Github workflow to create releases

### Fix

* **core:** Escape multiline tag for github js
* **core:** Escape multiline tag message
* **core:** Use contents of current-tag.md for release
* **core:** Updated url used for repo in tags
* **core:** Updated permissions for create release workflow

### Refactor

* **web:** Changed git repo url


<a name="v2.1.0"></a>
## [v2.1.0](https://github.com/aleyoscar/resurrexit/compare/v2.0.1...v2.1.0) (2025-05-21)

### Feat

* **web:** Link to psalm in other languages
* **web:** Added chord quality
* **web:** Search lyrics


<a name="v2.0.1"></a>
## [v2.0.1](https://github.com/aleyoscar/resurrexit/compare/v2.0.0...v2.0.1) (2025-05-20)

### Feat

* **web:** Added favicon


<a name="v2.0.0"></a>
## [v2.0.0](https://github.com/aleyoscar/resurrexit/compare/v1.5.0...v2.0.0) (2025-05-20)

### Feat

* **wire:** Updated contact form page title
* **wire:** Added selectable ids to main template
* **wire:** Updated psalms template to pico.css
* **wire:** Menu for smaller screens
* **wire:** Detect when element is 'sticking'
* **wire:** Updated psalm-list template to pico.css
* **wire:** Updated contact template to pico.css
* **wire:** Footer with text instead of icons
* **wire:** Added new icon 'funnel'
* **wire:** Added pico.colors.css
* **wire:** Added light/dark theme switcher
* **wire:** Added js-cookie library
* **wire:** Updated home template to pico.css
* **wire:** Added pico.css

### Fix

* **wire:** Fixed broken source link
* **wire:** Sort not working
* **wire:** Theme buttons not showing
* **wire:** Blank header on home page

### Refactor

* **core:** Switched to a static site using flask
* **wire:** Clean up code
* **wire:** Moved header to _main.php


<a name="v1.5.0"></a>
## [v1.5.0](https://github.com/aleyoscar/resurrexit/compare/v1.4.3...v1.5.0) (2025-04-09)

### Feat

* **book:** Gritad jubilosos & shema
* **docs:** Added link to app in README
* **wire:** Added script to reset password after migration
* **wire:** Added spanish translation for FrontendForms
* **wire:** Added FrontendForms module

### Refactor

* **wire:** Styling changes
* **wire:** Changed contact form to FrontendForms
* **wire:** Remove Pages2JSON module
* **wire:** Remove ProcessExportProfile module
* **wire:** Moved WireMailSmtp to site/modules


<a name="v1.4.3"></a>
## [v1.4.3](https://github.com/aleyoscar/resurrexit/compare/v1.4.2...v1.4.3) (2025-04-01)

### Feat

* **wire:** Versioning for scripts and stylesheets

### Fix

* **wire:** Remove old script


<a name="v1.4.2"></a>
## [v1.4.2](https://github.com/aleyoscar/resurrexit/compare/v1.4.1...v1.4.2) (2025-03-31)

### Fix

* **wire:** Update to eplayer v0.5.2 for touch screens


<a name="v1.4.1"></a>
## [v1.4.1](https://github.com/aleyoscar/resurrexit/compare/v1.4.0...v1.4.1) (2025-03-31)

### Feat

* **wire:** Update to eplayer v0.5.1

### Fix

* **book:** Typo in aquedah
* **wire:** Moved audio player to bottom for smaller screens


<a name="v1.4.0"></a>
## [v1.4.0](https://github.com/aleyoscar/resurrexit/compare/v1.3.0...v1.4.0) (2025-03-21)

### Feat

* **book:** Added various psalms
* **book:** Quiero cantar
* **wire:** Added leaf division for psalms on multiple pages
* **wire:** New custom psalm list template

### Fix

* **book:** Updated chords and subtitle for A la victima
* **wire:** Move admin css changes to admin.css in site/templates
* **wire:** Larger field and monospace font for psalm_lyrics
* **wire:** Check page templates when iterating


<a name="v1.3.0"></a>
## [v1.3.0](https://github.com/aleyoscar/resurrexit/compare/v1.2.0...v1.3.0) (2025-03-20)

### Feat

* **docs:** Update sources
* **wire:** Parse lyric text directly in ProcessWire


<a name="v1.2.0"></a>
## [v1.2.0](https://github.com/aleyoscar/resurrexit/compare/v1.1.1...v1.2.0) (2025-03-18)

### Feat

* **wire:** Replaced search_cache with SearchEngine module


<a name="v1.1.1"></a>
## [v1.1.1](https://github.com/aleyoscar/resurrexit/compare/v1.1.0...v1.1.1) (2025-03-17)

### Fix

* **wire:** Export search results to json using wireEncodeJSON
* **wire:** Missing overlay in psalm-list template


<a name="v1.1.0"></a>
## [v1.1.0](https://github.com/aleyoscar/resurrexit/compare/v1.0.0...v1.1.0) (2025-03-17)

### Feat

* **wire:** reCaptcha for contact form


<a name="v1.0.0"></a>
## [v1.0.0](https://github.com/aleyoscar/resurrexit/compare/v0.3.0...v1.0.0) (2025-03-15)

### Feat

* **wire:** Added ProcessExportProfile module

### Refactor

* **wire:** Removed CPanel deployment


<a name="v0.3.0"></a>
## [v0.3.0](https://github.com/aleyoscar/resurrexit/compare/v0.2.0...v0.3.0) (2025-03-15)

### Feat

* **tools:** Check and rename audio files
* **wire:** CPanel deployment
* **wire:** Update eplayer to v0.4.1
* **wire:** Change psalm audio source and language

### Fix

* **book:** Corrections for en-us psalms
* **docs:** Update README version and icon source
* **wire:** btn-links without href not showing as pointer


<a name="v0.2.0"></a>
## [v0.2.0](https://github.com/aleyoscar/resurrexit/compare/v0.1.0...v0.2.0) (2025-03-14)

### Feat

* **book:** Added en-us psalms
* **book:** Added all es-es psalms
* **book:** Paired en-us and es-es psalms by id
* **book:** Added tags to es-es psalms
* **book:** Added steps to es-es psalms
* **book:** Added steps to en-us psalms
* **book:** Added en-us lists
* **book:** Added tags to en-us psalms
* **book:** Added pages to es-es psalms
* **docs:** Update README with new abbreviation
* **docs:** Added latin abbreviations to README
* **tools:** Index parser separates page number and id
* **tools:** Added script to check for duplicate IDs in list
* **tools:** Added check for duplicate lyrics
* **tools:** Added tools to parse steps and print ids
* **tools:** Check ids and export to csv
* **tools:** Added pdf parser for steps
* **tools:** Check for completeness of lyric frontmatter
* **tools:** Added page to lyrics export
* **tools:** Added tool to parse psalm lists
* **tools:** Added pandas & tesseract libraries
* **wire:** Added global and book tags to psalms in psalm list
* **wire:** Separated book tags and global tags
* **wire:** Added edit link

### Fix

* **book:** Removed duplicates and made corrections to en-us psalms
* **book:** Psalm corrections
* **book:** Added missing steps to es-es psalms
* **book:** Fixed en-us lists
* **book:** Fixed es-es lists
* **book:** Added missing poe tags for en-us psalms
* **book:** Song list corrections for en-us
* **docs:** Updated latin abbreviations in README
* **docs:** README corrections
* **tools:** Updated to new settings structure
* **tools:** Check if page matches instead of id when parsing index
* **tools:** Added newline to csv export
* **tools:** Conditionally set subpage. Remove subpage from title
* **tools:** Updated description of parse_pdf_steps
* **tools:** Set psalm ID as an int in frontmatter
* **tools:** End file with new line when parsing steps
* **wire:** Changed ser to con. Set to darker grey
* **wire:** Book tags not filtering
* **wire:** Sort global tags

### Refactor

* **tools:** Moved helper functions to lib


<a name="v0.1.0"></a>
## v0.1.0 (2025-03-10)

### Feat

* **wire:** Initial Conversion to ProcessWire

