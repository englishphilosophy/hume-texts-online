# Data

The main purpose of this web site is to make available digital editions of Hume's philosophical writings. The text of these editions is stored in several YAML files in this folder. Each file represents a *text*, which is either

  1. a complete short work (e.g. an essay, *My Own Life*, the *Abstract* of the *Treatise*);
  2. a section of a longer work (e.g. of the *Treatise* or the *Enquiries*);
  3. a collection of texts.

The point of the third of these is, in the first instance, to group sections of longer works together into the complete work. For example, there are files `e-1.yml`, `e-2.yml`, `e-3.yml`, etc. for each of the sections of the first *Enquiry*, and then a file `e.yml` which has references to each of the section files in order, and thus represents the *Enquiry* as a whole. Similarly, but a little more elaborate, the sections of the *Treatise* are collected together into parts (e.g. `t-1-1.yml`, `t-1-2.yml`), the parts are collected together into Books (e.g. `t-1.yml`, `t-2.yml`), and the Books (together with the advertisements, introduction, and appendix) are collected together into the *Treatise* as a whole (`t.yml`).

The simplicity of the setup makes this extremely flexible, and there are also other collections of texts, some of them overlapping. The various essays are collected together into three mutually exclusive groups: part 1 of the 1777 edition (`ess1.yml`), part 2 of the 1777 edition (`ess2.yml`), and posthumous and withdrawn essays (`ess3.yml`). There is also a collection representing volume 1 of the 1777 *Essays and Treatises on Several Subjects* (`etss.yml`), containing the first *Enquiry*, the *Dissertation on the Passions*, the moral *Enquiry*, and the *Natural History*; and another representing the *Four Dissertations* of 1757, containing the *Natural History*, the *Dissertation on the Passions*, *Of Tragedy*, and *Of the Standard of Taste*.

Each text consists of a small amount of meta-data (see below), and then some content. In the case of collections, the content is an array of identifiers pointing to the component texts. In the case of sections or short works, it is an array of paragraphs.

## 1. The Original Text

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



## 2. Supplementary Data

In addition to digitising the original texts, the files also include a small amount of additional data, as follows.

### 2.1. Identifying Labels

Every section and every paragraph has been given a unique identifier, for ease of reference. These labels follow the more or less standard practice (insofar as there is one) among Hume scholars. See the notes on the web site itself for details.

### 2.2. Page References to Modern Editions

Page references to the most commonly cited modern editions are included in the meta-data for each paragraph. For paragraphs that span more than one page, page breaks are represented in the text as `|`. The modern edition in question is specified at the start, as the value of the `pages` field:

- `SBN` for the Selby-Bigge and Nidditch editions of the *Treatise* and *Enquiries*
- `Beau` for Beauchamp's edition of the *Natural History* and the *Dissertation on the Passions*
- `KS` for Kemp Smith's edition of the *Dialogues*
- `Mil` for Miller's edition of the Essays (including *My Own Life*)

### 2.3. Footnote Numbering

Footnotes have been numbered, again for ease of reference.

### 2.3. Editorial Interventions

Our intention is to reproduce the source texts as accurately as possible, with very little editorial intervention. But it would be silly not to make a few changes, in cases where those changes were authorised by Hume himself, or where there is very obviously an error (and especially where other editions do not contain that error). Editorial interventions like these are marked in square brackets, like so: `[+new -old @comment]`, where `new` is the text we have added, `old` is the text we have deleted, and `comment` is some explanation of the change.
