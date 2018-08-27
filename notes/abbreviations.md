---
layout: notes
subsection: abbreviations
---
## Abbreviations for the Texts

It is standard practice to refer to Hume's texts using abbreviations, though not everyone uses the same abbreviations. Commonly the *Treatise of Human Nature*, *Enquiry Concerning Human Understanding*, and *Dialogues Concerning Natural Religion*, for example, are referred to using just the letters "T", "E", and "D" respectively, while other authors prefer "THN", "EHU", and "DNR". But on a website such as this, long abbreviations can be cumbersome and awkward to place neatly, especially when they need to include section and paragraph details (e.g "THN 1.3.14.24"). For this reason, we have adopted the convention of using single letter abbreviations for all of Hume's major works (including the *Abstract* and the *Letter from a Gentleman*), and longer abbreviations for his essays (including *My Own Life*). These are as follows:

### 1. Major works (in chronological order)

| T | _[Treatise of Human Nature]({{ site.baseurl }}/texts/t)_                    |
| A | _[Abstract of the Treatise]({{ site.baseurl }}/texts/a)_                    |
| L | _[Letter from a Gentleman]({{ site.baseurl }}/texts/l)_                     |
| E | _[Enquiry Concerning Human Understanding]({{ site.baseurl }}/texts/e)_      |
| M | _[Enquiry Concerning the Principles of Morals]({{ site.baseurl }}/texts/m)_ |
| P | _[Dissertation on the Passions]({{ site.baseurl }}/texts/p)_                |
| N | _[Natural History of Religion]({{ site.baseurl }}/texts/n)_                 |
| D | _[Dialogues Concerning Natural Religion]({{ site.baseurl }}/texts/d)_       |
| H | _[History of England]({{ site.baseurl }}/texts/h)_       |

### 2. Essays (as ordered in Miller's standard edition)

{% assign suis = 'su,is' | split: ',' %}
{% assign ids = site.data.texts.empl-1.texts | concat: site.data.texts.empl-2.texts | concat: site.data.texts.empw.texts | concat: suis %}
{% for id in ids %}
{%- assign text = site.data.texts[id] -%}
| {{ text.label }} | _[{{ text.title[0] }}]({{ site.baseurl }}/texts/{{ text.parent | replace: '-', '/' }}/{{ text.label | downcase }}/)_ |
{% endfor %}
