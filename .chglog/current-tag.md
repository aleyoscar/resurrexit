
v3.0.0
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

