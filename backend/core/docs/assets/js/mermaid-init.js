(function () {
  function run() {
    if (typeof mermaid === 'undefined') return;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: { markdownAutoWrap: false }
    });
    var mermaidDivs = [];
    [].slice.call(document.querySelectorAll('div.language-mermaid')).forEach(function (wrapper) {
      var code = wrapper.querySelector('code');
      var source = (code ? code.textContent : wrapper.textContent).trim();
      if (!source) return;
      var div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = source;
      wrapper.parentNode.replaceChild(div, wrapper);
      mermaidDivs.push(div);
    });
    [].slice.call(document.querySelectorAll('pre code.language-mermaid')).forEach(function (code) {
      if (code.closest('.mermaid')) return;
      var wrapper = code.closest('.highlight') || code.closest('pre') || code.parentElement;
      var source = code.textContent.trim();
      if (!source) return;
      var div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = source;
      wrapper.parentNode.replaceChild(div, wrapper);
      mermaidDivs.push(div);
    });
    if (mermaidDivs.length) mermaid.run({ nodes: mermaidDivs, suppressErrors: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
