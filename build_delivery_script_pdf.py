import re
src = open("MilJustice_Delivery_Script.html", encoding="utf-8").read()
body  = src[src.index('<!-- ================= SCRIPT ================= -->'):src.index('</div>\n\n<script>')]
cards = src[src.index('<div class="cards">'):src.index('<!-- ================= SCRIPT ================= -->')]

CSS = """
@page { size: 5.5in 8.5in; margin: 0.42in 0.45in 0.5in 0.45in;
  @bottom-center { content: counter(page) " / " counter(pages);
    font-family: "Liberation Sans", sans-serif; font-size: 7.5pt; color: #777; } }
body { font-family: "Liberation Serif", Georgia, serif; font-size: 12.5pt;
  line-height: 1.62; color: #14181F; margin: 0; }
h1.doc { font-family:"Liberation Sans",sans-serif; font-size:19pt; font-weight:bold;
  color:#1F3A5F; margin:0 0 3pt; line-height:1.15; }
p.sub { font-family:"Liberation Sans",sans-serif; font-size:8.5pt; color:#5C6675;
  margin:0 0 12pt; letter-spacing:.04em; text-transform:uppercase;
  border-bottom:2pt solid #1F3A5F; padding-bottom:7pt; }
.card { border:0.75pt solid #DFE3EA; border-radius:4pt; padding:8pt 10pt; margin:0 0 8pt;
  break-inside:avoid; }
.card.hold { background:#F9ECEC; border-color:#7A2222; }
.card h3 { font-family:"Liberation Sans",sans-serif; font-size:7.5pt; font-weight:bold;
  letter-spacing:.1em; text-transform:uppercase; color:#5C6675; margin:0 0 5pt; }
.card.hold h3 { color:#7A2222; }
.card ul { margin:0; padding-left:12pt; font-size:10pt; line-height:1.45; }
.card li { margin-bottom:3pt; }
.card p { margin:0; font-size:10.5pt; line-height:1.45; font-weight:bold; }
.slide { padding-top:11pt; }
.slide-head { border-bottom:1.5pt solid #1F3A5F; padding-bottom:3.5pt; margin-bottom:7pt;
  break-after:avoid; break-inside:avoid; }
.slide-head .num { font-family:"Liberation Sans",sans-serif; font-weight:bold;
  font-size:15pt; color:#1F3A5F; }
.slide-head h3 { font-family:"Liberation Sans",sans-serif; font-weight:bold; font-size:11pt;
  margin:2pt 0 0; line-height:1.25; }
.slide-head .time { font-family:"Liberation Sans",sans-serif; font-size:8.5pt; color:#5C6675;
  float:right; font-weight:normal; }
.slide p { margin:0 0 7pt; orphans:2; widows:2; }
.edited { background:#FBF3E4; border-left:2.5pt solid #D9A63F; padding:6pt 9pt;
  break-inside:avoid; }
.optional { background:transparent; border-left:2.5pt dashed #C9CDD4; }
.tag { font-family:"Liberation Sans",sans-serif; font-size:6.5pt; font-weight:bold;
  letter-spacing:.1em; text-transform:uppercase; color:#8A5300; border:0.75pt solid #D9A63F;
  border-radius:2pt; padding:0 3pt; margin-right:5pt; }
.tag.opt { color:#5C6675; border-color:#C9CDD4; }
.keep { font-family:"Liberation Sans",sans-serif; font-size:8pt; font-weight:bold;
  color:#7A2222; letter-spacing:.08em; text-transform:uppercase; margin-bottom:5pt !important; }
.end { margin-top:16pt; padding-top:9pt; border-top:1pt solid #DFE3EA; break-inside:avoid; }
.end h2 { font-family:"Liberation Sans",sans-serif; font-size:12pt; margin:0 0 6pt; color:#1F3A5F; }
table { border-collapse:collapse; width:100%; font-family:"Liberation Sans",sans-serif;
  font-size:8.5pt; }
th,td { text-align:left; padding:3pt 5pt; border-bottom:0.5pt solid #EDF0F5; }
th { font-size:7pt; letter-spacing:.08em; text-transform:uppercase; color:#5C6675;
  border-bottom:0.75pt solid #DFE3EA; }
td.n { color:#5C6675; white-space:nowrap; }
td.c { text-align:right; font-weight:bold; }
"""

def fix_head(m):
    num, title, time = m.group(1), m.group(2), m.group(3)
    return ('<div class="slide-head"><span class="time">%s</span>'
            '<span class="num">%s</span><h3>%s</h3></div>' % (time, num, title))
body = re.sub(r'<div class="slide-head"><span class="num">(.*?)</span><h3>(.*?)</h3>'
              r'<span class="time">(.*?)</span></div>', fix_head, body, flags=re.S)

html = ('<html><head><meta charset="utf-8"><title>Military Justice Delivery Script</title>'
        '</head><body><h1 class="doc">Military Justice Delivery Script</h1>'
        '<p class="sub">071-OAXXD012 &middot; online &middot; 39 slides &middot; 40 min</p>'
        + cards + body + '</body></html>')

from weasyprint import HTML, CSS as WCSS
doc = HTML(string=html).render(stylesheets=[WCSS(string=CSS)])
out = "/home/user/wake/MilJustice_Delivery_Script.pdf"
doc.write_pdf(out)
print("pages:", len(doc.pages))

import pymupdf
d = pymupdf.open(out)
txt = " ".join(p.get_text() for p in d)
print("em/en dashes in PDF:", sum(txt.count(c) for c in "–—"))
