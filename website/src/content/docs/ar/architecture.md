---
title: البنية
description: كيف تتكامل الأجزاء معًا، للمساهمين.
order: 12
---

RTW صغير عن قصد: أمر shell واحد، وإعدادات خادم ويب، وبضع صفحات ثابتة، وخدمة Python تعتمد على المكتبة القياسية فقط. كل الأعمال الثقيلة تقوم بها أدوات راسخة.

## المكوّنات

```
 readers ──Wi-Fi──▶ nginx :8080 (http) / :8443 (https, self-signed)
                       │
                       ├─ /            home page and viewers   (web/)
                       ├─ /wiki/  ───▶ kiwix-serve 127.0.0.1:8081
                       ├─ /data/  ───  content files + JSON listings
                       ├─ /sites/ ───  content/www
                       └─ /admin/ ───▶ admin_server.py 127.0.0.1:8082
                                       (behind nginx basic auth)
```

| الجزء | الدور |
|---|---|
| `rtw` | أمر واحد للإعداد والتشغيل والإيقاف وكلمة المرور والجلب والتحديث. السكربت نفسه على macOS وTermux. |
| `server/nginx.conf.in` | قالب يولّده `server/configure.sh` لكل جهاز. |
| `server/start.sh`، `stop.sh` | تشغيل الخدمات وتتبّع معرّفات العمليات — فلا يوجد systemd على Android. |
| `server/admin_server.py` | الرفع وإعادة التسمية والنقل والحذف والتحرير. يكتب الملفات المرفوعة مباشرة إلى القرص، ويقصر كل قسم على أنواع ملفاته. |
| `web/` | HTML وCSS وJavaScript عادية، دون خطوة بناء. |
| `scripts/` | تنزيل المحتوى (Mac وAndroid) والنسخ عبر USB. |

## قرارات التصميم

- **أعد الاستخدام، لا تعِد البناء.** يقدّم Kiwix ملفات ZIM، ويقدّم nginx كل ما عداها، ويعرض MapLibre الخرائط من ملف PMTiles واحد دون خادم بلاطات.
- **المجلدات هي قاعدة البيانات.** المحتوى ملفات عادية، وقوائم المجلدات تأتي من nginx بصيغة JSON، لذا فأي مدير ملفات هو أيضًا مدير محتوى.
- **سطح موثوق صغير.** nginx وحده يستمع على الشبكة. واجهة الإدارة مرتبطة بـlocalhost ولا يُوصل إليها إلا عبر تحقق nginx من كلمة المرور، وترويسة طلب مخصصة تمنع الطلبات من مواقع أخرى.
- **الشيفرة نفسها في كل مكان.** تقتصر الفروق بين المنصات على الإعداد: Homebrew على macOS و`pkg` في Termux.

## تخطيط وقت التشغيل

```
state/conf/    rtw.env · nginx.conf · htpasswd · tls.crt/key · config.js
state/logs/    nginx, kiwix and admin logs
state/run/     PID files and nginx temp folders
state/bin/     downloaded tools (kiwix on macOS, pmtiles on Linux)
```
