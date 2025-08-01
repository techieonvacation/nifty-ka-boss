"use client";

import Script from "next/script";

export default function GoogleTagManagerPopup() {
  return (
    <Script id="sp-popups-widget" strategy="afterInteractive">
      {`
        (function () {
          var spPopupsScript = document.createElement('script');
          spPopupsScript.src = 'https://static.sppopups.com/assets/loader.js';
          spPopupsScript.async = true;
          spPopupsScript.setAttribute('data-chats-widget-id', '4d369048-6065-49bb-ad3d-d24f5fa9eacf');
          document.head.appendChild(spPopupsScript);
        })();
      `}
    </Script>
  );
}
