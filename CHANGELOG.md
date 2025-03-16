
<a name="v0.3.0"></a>
## [v0.3.0](https://git.aleyoscar.com/oscarale/resurrexit/compare/v0.2.0...v0.3.0) (2025-03-15)

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
## [v0.2.0](https://git.aleyoscar.com/oscarale/resurrexit/compare/v0.1.0...v0.2.0) (2025-03-14)

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

