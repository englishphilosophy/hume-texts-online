# Data

The main purpose of this web site is to make available digital editions of Hume's philosophical writings. The text of these editions is stored in several YAML files in the subdirectories of this folder, divided into *early* works (the *Treatise*, the *Abstract*, and *A Letter from a Gentleman*), *late* works (the two *Enquiries*, the *Natural History*, the *Dissertation on the Passions*, and the *Dialogues*), the *essays* (self-explanatory), and *other* (a handful of advertisements, and *My Own Life*).

Each YAML file represents a "section" of text. A section is a essentially a sequence of paragraphs (with some additional meta-data). The sections are all complete units, such as an essay, *My Own Life*, or a section of one of the longer works like the *Treatise* or *Enquiries*.

## 1. The Original Text

The data of the original
In digitising the originals texts, decisions had to be made concerning how to translate those originals into plain text. Those decisions are documented here.

### 1.1. Formatting

Formatting is represented with the use of special characters, ones that Hume himself never used (and so we can be sure there will never be any ambiguity). The same character is used to mark the beginning and end of some format style, in the spirit of Markdown.

- `_italics_`
- `*small capitals*`
- `^dropped capitals^` (typically used at the start of a section)
- `~wide spaced letters~` (used in section headings)
- `$greek text$` (formatted with a different font)
- `¬` (a tab)
- `//` (a line break)
- ``blockquote``

Some paragraphs are given `type: "title"`, and marked up with HTML <h> tags. Some paragraphs are given `type: "first"`, which means they are not to have the text indent that all other paragraphs have by default. These paragraphs typically start with a dropped capital letter. Some paragraphs are also given `style: "italic"`; these are paragraphs rendered in italics (with any italics within them rendered in normal font style).

### 1.2. Footnotes



### 1.3. Page Breaks

Page breaks are not particularly valuable data, but can be handy when checking the digital text against the source. In principle, we have included them in the text for each paragraph, represented as `<#num>`. In practice, this data is patchy. It is not used at all in the web site itself.

## 2. Supplementary Data

In addition to digitising the original texts, the files also include a small amount of additional data, as follows.

### 2.1. Identifying Labels

Every section and every paragraph has been given a unique identifier, for ease of reference. These labels follow the more or less standard practice (insofar as there is one) among Hume scholars. See the notes on the web site itself for details.

### 2.2. Page References to Modern Editions

Page references to the most commonly cited modern editions are included in the meta-data for each paragraph. For paragraphs that span more than one page, page breaks are represented in the text as `</>`. The modern edition in question is specified at the start, as the value of the `pages` field:

- `SBN` for the Selby-Bigge and Nidditch editions of the *Treatise* and *Enquiries*
- `Beau` for Beauchamp's edition of the *Natural History* and the *Dissertation on the Passions*
- `KS` for Kemp Smith's edition of the *Dialogues*
- `Mil` for Miller's edition of the Essays (including *My Own Life*)

### 2.3. Footnote Numbering

Footnotes have been numbered, again for ease of reference.

### 2.3. Editorial Interventions

Our intention is to reproduce the source texts as accurately as possible, with very little editorial intervention. But it would be silly not to make a few changes, in cases where those changes were authorised by Hume himself, or where there is very obviously an error (and especially where other editions do not contain that error). Editorial interventions like these are marked in square brackets, like so: `[+new -old @comment]`, where `new` is the text we have added, `old` is the text we have deleted, and `comment` is some explanation of the change.
