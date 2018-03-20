---
layout: notes
subsection: help
---
## Help

At the top of each text is a tool box with a breadcrumb, various options, a search box, and icons for switching between different parts of the page. We hope the features here are as self-explanatory as possible, but please take a moment to read through these help notes, to ensure you are getting the most out of this site.

### Breadcrumb and Icons

When viewing structured texts (such as the *Treatise*, which is divided into Books, parts, and sections), a "breadcrumb" trail is shown in the red bar at the top of the tool box. Use this navigate between sections.

At the bottom right of the tool box are various icons representing different parts of the page. Note that not every icon shows up on every page, since some features are not available or relevant to every text.

| <span class="icon"><i class="fas fa-search"></i></span> | Click on this icon to see search results from within the current text.<br> |
| <span class="icon"><i class="fas fa-list"></i></span> | Click on this icon to see a table of contents for the current text. This icon is only available for collections and larger texts made up of more than one part or section.<br> |
| <span class="icon"><i class="fas fa-file-alt"></i></span> | Click on this icon to see the text itself. This icon is not available for collections or larger texts, where you will see the icon for the table of contents instead.<br> |
| <span class="icon"><i class="fas fa-copy"></i></span> | Click on this icon to see any textual variants for the current text, i.e. substantive differences from different editions of the text.<br> |
| <span class="icon"><i class="fas fa-file-image"></i></span> | Click on this icon to see manuscript images for the current text. This only applies to the *Dialogues concerning Natural Religion*, which is sadly the only one of Hume's works for which the manuscript survives.<br> |
| <span class="icon"><i class="fas fa-edit"></i></span> | Click on this icon to see editorial notes pertaining to the current text. |

### Options

By default, the edited version of the text is shown (see the notes on the [Edited Versions]({{ 'notes/edited' | relative_url }})). When displaying the edited text, check "Show Changes" to see the editorial interventions we have made. Deletions will appear with a line through them, and additions underlined; by hovering your mouse over the change, you will see a brief explanation of the edit. Our interventions are minimal, consisting mostly of changes sanctioned by Hume himself, together with corrections of just a few very obvious errors.

Alternatively, you can deselect the "Edited Text" checkbox to see the original edition, a faithful reproduction of the copytext save for some systematic and insignificant changes intended to make the text easier to read and navigate (see the notes on the [Original Editions]({{ '/notes/original' | relative_url }})). Note that this will effect the text against which your search queries are tested as well as the text shown on the screen.

Page numbers from standard editions are shown alongside each paragraph. For paragraphs that range over more than one page, page breaks can be displayed in the text as a pipe (|), by checking "Show Page Breaks".

### Simple and Advanced Search

There are two kinds of search, _simple_ and _advanced_. The former is intended to help you find a passage or quotation from Hume's works, the location of which you cannot remember. It will look for the complete phrase that you enter, ignoring capitalisation and punctuation. More importantly, it will also broaden your search in straightforward and presumptively helpful ways, to maximise your chance of finding the passage. For example, "it is" will also match "'tis"; "though" will also match "tho'"; "-ed" at the end of a word will also match "-'d"; "-ction" and "-xion" at the end of a word will be treated as equivalent (as in "reflection"/"reflexion", "connection"/"connexion"); and so on.

Advanced search is intended for scholarship purposes, to interrogate Hume's texts for the terms that he used and how often he used them. This type of search treats your input query as a _regular expression_, which is a standard syntax for matching string patterns; if you look it up in your search engine of choice, you will find countless guides and tutorials on the web. For now, the following examples should be enough to get you started:

- "sceptic" - this matches all occurrences of these letters in that order, e.g. "sceptic", "sceptical", "scepticism"
- "\bsceptic\b" - "\b" represents a word boundary, hence this matches only occurrences of the word "sceptic" (i.e. it does not match "sceptical" or "scepticism")
- "govern(ed)?" - the question mark is for optional characters, and the brackets specify its scope, hence this matches both "govern" and "governed"
- "refle(ct\|x)ion" - the pipe symbol is for disjunction, and again the brackets specify its scope, hence this matches both "refection" and "reflexion"
- "govern(ed\|ment)?" - question marks and pipes can be combined; this matches "govern", "governed", and "government"
- "(govern\|governed\|government)" - this is equivalent to the previous example, but easier to read; in some cases an explicit disjunction may get the job done just as well
- "hypothes.s" - a full stop is a wild-card that matches any character, hence this matches "hypothesis" and "hypotheses" (as well as, in theory, "hypothesas", "hypothesbs", "hypothescs", etc.)
