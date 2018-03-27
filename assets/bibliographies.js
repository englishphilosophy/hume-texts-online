---
layout: null
---
const data = (() => {
  const ehusurvey = {{ site.data.bibliographies.ehusurvey | jsonify }};
  // const tweyman = {{ site.data.bibliographies.tweyman | jsonify }};
  return { ehusurvey };
})();
