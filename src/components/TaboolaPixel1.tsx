"use client";

import Script from "next/script";

export default function TaboolaPixel1() {
  return (
    <Script id="taboola-pixel-1814655" strategy="afterInteractive">
      {`
        window._tfa = window._tfa || [];
        window._tfa.push({notify: 'event', name: 'page_view', id: 1814655});
        !function (t, f, a, x) {
          if (!document.getElementById(x)) {
            t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
          }
        }(document.createElement('script'),
        document.getElementsByTagName('script')[0],
        '//cdn.taboola.com/libtrc/unip/1814655/tfa.js',
        'tb_tfa_script');
      `}
    </Script>
  );
}
