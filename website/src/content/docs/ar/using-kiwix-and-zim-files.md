---
title: استخدام Kiwix وملفات ZIM
description: كيف يقدّم RTW ويكيبيديا والمجموعات الأخرى عبر Kiwix.
order: 6
---

يحزم [Kiwix](https://kiwix.org) مواقع ويب — ويكيبيديا وويكاموس وStack Exchange وغيرها الكثير — في ملفات **ZIM** مضغوطة يمكن قراءتها دون اتصال. يشغّل RTW خادم Kiwix نفسه، `kiwix-serve`، ويعرض كل ملفات ZIM الموجودة في مجلد `wikipedia/` تحت `/wiki/`.

## الحصول على ملفات ZIM

تصفّح [مكتبة Kiwix](https://library.kiwix.org) أو [دليل التنزيل](https://download.kiwix.org/zim/). أسماء الملفات تصف محتواها:

```
wikipedia_ar_all_nopic_2026-08.zim
│         │  │   │     └ release (year-month)
│         │  │   └ variant: maxi (images) · nopic (no images) · mini (intros only)
│         │  └ scope: all, top, or a topic
│         └ language
└ project
```

أي: المشروع، ثم اللغة، ثم النطاق (`all` للكل، أو `top` للأهم، أو موضوع)، ثم النوع (`maxi` بالصور، و`nopic` دون صور، و`mini` للمقدمات فقط)، ثم تاريخ الإصدار.

## جلب ويكيبيديا عبر RTW

```bash
rtw fetch wikipedia
```

ينزّل أحدث ملف `wikipedia_ar_all_nopic`، ويتحقق منه بمقارنته بمجموع SHA-256 الذي ينشره Kiwix، ويحتفظ بأحدث نسخة فقط. للغة أو نوع آخر، حدّد نمطًا:

```bash
ZIM_PATTERN=wikipedia_en_all_nopic rtw fetch wikipedia
```

## إضافة أي ملف ZIM يدويًا

ضع ملف `.zim` في مجلد `wikipedia/`، ثم أعد التحميل:

```bash
rtw restart
```

رفع ملف ZIM أو حذفه عبر `/admin/` يعيد تحميل ويكيبيديا تلقائيًا.

## الرخص

تحمل ملفات ZIM رخصة مصدرها. محتوى ويكيبيديا مرخّص بـCC BY-SA، وتختلف المجموعات الأخرى. Kiwix وأدواته برمجيات حرة — راجع [kiwix.org](https://kiwix.org).
