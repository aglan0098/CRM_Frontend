import { useEffect } from 'react';

export default function useUserway(position = 'bottom-right') {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.getElementById('userway-script')) return;

    const script = document.createElement('script');

    script.id = 'userway-script';

    script.type = 'text/javascript';

    script.innerHTML = `

      (function(d) {

        var s = d.createElement("script");

        s.setAttribute("data-position", 5);

        s.setAttribute("data-language", "ar");

        s.setAttribute("data-account", "0UYGxnoXJv");

        s.setAttribute("src", "https://cdn.userway.org/widget.js");

        (d.body || d.head).appendChild(s);

      })(document)

    `;

    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById('userway-script');

      if (existing) {
        document.body.removeChild(existing);
      }
    };
  }, [position]);
}
