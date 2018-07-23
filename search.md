---
layout: search
---
## Search Help

There are two kinds of search, _simple_ and _advanced_. The former is intended to help you find a passage or quotation from Hume's works, the location of which you cannot remember. It will look for the complete phrase that you enter, ignoring capitalisation and punctuation. More importantly, it will also broaden your search in straightforward and presumptively helpful ways, to maximise your chance of finding the passage. For example, "it is" will also match "’tis"; "though" will also match "tho'"; "-ed" at the end of a word will also match "-’d"; "-ction" and "-xion" at the end of a word will be treated as equivalent (as in "reflection"/"reflexion", "connection"/"connexion"); and so on.

Advanced search is intended for scholarship purposes, to interrogate Hume's texts for the terms that he used and how often he used them. This type of search treats your input query as a _regular expression_, which is a standard syntax for matching string patterns; if you look it up in your search engine of choice, you will find countless guides and tutorials on the web. For now, the following examples should be enough to get you started:

- "sceptic" - this matches all occurrences of these letters in that order, e.g. "sceptic", "sceptical", "scepticism"
- "\bsceptic\b" - "\b" represents a word boundary, hence this matches only occurrences of the word "sceptic" (i.e. it does not match "sceptical" or "scepticism")
- "govern(ed)?" - the question mark is for optional characters, and the brackets specify its scope, hence this matches both "govern" and "governed"
- "refle(ct\|x)ion" - the pipe symbol is for disjunction, and again the brackets specify its scope, hence this matches both "reflection" and "reflexion"
- "govern(ed\|ment)?" - question marks and pipes can be combined; this matches "govern", "governed", and "government"
- "(govern\|governed\|government)" - this is equivalent to the previous example, but easier to read; in some cases an explicit disjunction may get the job done just as well
- "hypothes.s" - a full stop is a wild-card that matches any character, hence this matches both "hypothesis" and "hypotheses" (as well as, in theory, "hypothesas", "hypothesbs", "hypothescs", etc.)

There is no easy way to perform conjunctive searches using regular expressions. To search for paragraphs containing two or more expressions, search for the first expression, and then search for subsequent expressions within the range of the current results.
