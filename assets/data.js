---
layout: compress
---
const data = {
  "t0": [
    {% for id in site.data.texts.t0 %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='t0' %}
    {% endfor %}
  ],
  "t1": [
    {% for ids in site.data.texts.t1 %}
      {% for id in ids %}
        {% assign section = site.data.sections[id] %}
        {% include paragraph.json section=section page='t1' %}
      {% endfor %}
    {% endfor %}
  ],
  "t2": [
    {% for ids in site.data.texts.t2 %}
      {% for id in ids %}
        {% assign section = site.data.sections[id] %}
        {% include paragraph.json section=section page='t2' %}
      {% endfor %}
    {% endfor %}
  ],
  "t3": [
    {% for ids in site.data.texts.t3 %}
      {% for id in ids %}
        {% assign section = site.data.sections[id] %}
        {% include paragraph.json section=section page='t3' %}
      {% endfor %}
    {% endfor %}
  ],
  "tapp": [
    {% for id in site.data.texts.tapp %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='tapp' %}
    {% endfor %}
  ],
  "a": [
    {% for id in site.data.texts.a %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='a' %}
    {% endfor %}
  ],
  "l": [
    {% for id in site.data.texts.l %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='l' %}
    {% endfor %}
  ],
  "e": [
    {% for id in site.data.texts.e %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='e' %}
    {% endfor %}
  ],
  "m": [
    {% for id in site.data.texts.m %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='m' %}
    {% endfor %}
  ],
  "n": [
    {% for id in site.data.texts.n %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='n' %}
    {% endfor %}
  ],
  "p": [
    {% for id in site.data.texts.p %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='p' %}
    {% endfor %}
  ],
  "d": [
    {% for id in site.data.texts.d %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page='d' %}
    {% endfor %}
  ],
  "ess1": [
    {% for id in site.data.texts.ess1 %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page=id %}
    {% endfor %}
  ],
  "ess2": [
    {% for id in site.data.texts.ess2 %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page=id %}
    {% endfor %}
  ],
  "ess3": [
    {% for id in site.data.texts.ess3 %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page=id %}
    {% endfor %}
  ],
  "other": [
    {% for id in site.data.texts.other %}
      {% assign section = site.data.sections[id] %}
      {% include paragraph.json section=section page=id %}
    {% endfor %}
  ]
};
