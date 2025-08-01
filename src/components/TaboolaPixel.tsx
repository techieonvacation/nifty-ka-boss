"use client";

import Script from "next/script";

export default function TaboolaPixel() {
  return (
    <Script id="taboola-pixel-1784965" strategy="afterInteractive">
      {`
        window._tfa = window._tfa || [];
        window._tfa.push({notify: 'event', name: 'page_view', id: 1784965});
        !function (t, f, a, x) {
          if (!document.getElementById(x)) {
            t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
          }
        }(document.createElement('script'),
        document.getElementsByTagName('script')[0],
        '//cdn.taboola.com/libtrc/unip/1784965/tfa.js',
        'tb_tfa_script');
      `}
    </Script>
  );
}
