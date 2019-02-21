---
---
export default (id) => {
  const href = lookup[id.toLowerCase().replace(/\s/g, '.')]
  if (href) {
    window.location.href = href
  } else {
    window.alert('This does not appear to be a valid reference.')
  }
}

const lookup = {
  {%- for id in site.data.all -%}
    {% include assign/text.html id=id %}
    {% include json/urls.html text=text url=url %}
  {%- endfor -%}
}
