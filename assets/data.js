---
layout: compress
---
const paragraphs = [
  {% for section_hash in site.data %}
    {% assign section = section_hash[1] %}
    {% for paragraph in section.paragraphs %}
      {% if paragraph.type != 'title' %}
        {
          "id": "{{ section.id }}.{{ paragraph.id }}",
          "text": "{{ paragraph.text }}"
        },
      {% endif %}
    {% endfor %}
  {% endfor %}
];
