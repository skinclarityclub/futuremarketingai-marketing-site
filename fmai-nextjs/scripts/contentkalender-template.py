"""Build the free content calendar template + the inhaakkalender data for the K1 kennisbank article.

WHY one script: the article's "Inhaakkalender 2027" table and the downloadable .xlsx must show the
same dates. Both come from MOMENTS below, so a date fixed here is fixed in both.

Yearly update (every October, the 2026 calendar peaked in January): copy MOMENTS to the new year,
re-check every source URL, bump YEAR, run this script, then update the article's year and updatedAt.

Requires: pip install openpyxl   (dev-only, not a site dependency)
Run from fmai-nextjs/:            python scripts/contentkalender-template.py
Writes:  public/downloads/contentkalender-template-2027.xlsx
         content/data/inhaakkalender-2027.json   (imported by the K1 article)
"""

import json
from datetime import date, timedelta
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

YEAR = 2027
ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / "public" / "downloads" / f"contentkalender-template-{YEAR}.xlsx"
JSON_OUT = ROOT / "content" / "data" / f"inhaakkalender-{YEAR}.json"
ARTICLE_URL = "https://future-marketing.ai/nl/kennisbank/contentkalender-maken-meerdere-klanten"

D = date
# (start, end or None, name, kind, note). kind: Feestdag | Inhaakdag | Week | Vakantie | Verwacht | Klok
# Sources (checked 2026-11-06): rijksoverheid.nl schoolvakanties 2026-2027 + 2027-2028 (voorjaar/herfst =
# adviesdata), cpnb.nl Boekenweek 2027, onderwijs.coc.nl Paarse Vrijdag, weekvanhetgeld.nl, pannenkoekdag.nl,
# beleven.org Gedichtendag, islamic-relief.org.uk calendar (expected, moon sighting). The rest is computed.
MOMENTS = [
    (D(2027, 1, 1), None, "Nieuwjaarsdag", "Feestdag", ""),
    (D(2027, 1, 18), None, "Blue Monday", "Inhaakdag", ""),
    (D(2027, 1, 28), D(2027, 2, 3), "Gedichtendag en Poëzieweek", "Week", ""),
    (D(2027, 2, 7), D(2027, 2, 9), "Carnaval", "Feestdag", ""),
    (D(2027, 2, 8), None, "Begin ramadan", "Verwacht", "verwacht, hangt af van de maan"),
    (D(2027, 2, 13), D(2027, 2, 21), "Voorjaarsvakantie regio zuid", "Vakantie", "adviesdata"),
    (D(2027, 2, 14), None, "Valentijnsdag", "Inhaakdag", ""),
    (D(2027, 2, 20), D(2027, 2, 28), "Voorjaarsvakantie regio noord en midden", "Vakantie", "adviesdata"),
    (D(2027, 3, 1), None, "Nationale Complimentendag", "Inhaakdag", ""),
    (D(2027, 3, 8), None, "Internationale Vrouwendag", "Inhaakdag", ""),
    (D(2027, 3, 10), D(2027, 3, 21), "Boekenweek", "Week", ""),
    (D(2027, 3, 10), None, "Suikerfeest", "Verwacht", "verwacht, hangt af van de maan"),
    (D(2027, 3, 12), None, "Nationale Pannenkoekdag", "Inhaakdag", ""),
    (D(2027, 3, 15), D(2027, 3, 19), "Week van het Geld", "Week", ""),
    (D(2027, 3, 26), None, "Goede Vrijdag", "Feestdag", ""),
    (D(2027, 3, 28), None, "Eerste Paasdag", "Feestdag", ""),
    (D(2027, 3, 28), None, "Zomertijd: de klok een uur vooruit", "Klok", ""),
    (D(2027, 3, 29), None, "Tweede Paasdag", "Feestdag", ""),
    (D(2027, 4, 22), None, "Earth Day", "Inhaakdag", ""),
    (D(2027, 4, 24), D(2027, 5, 2), "Meivakantie", "Vakantie", "scholen kunnen tot 9 mei verlengen"),
    (D(2027, 4, 27), None, "Koningsdag", "Feestdag", ""),
    (D(2027, 5, 1), None, "Dag van de Arbeid", "Inhaakdag", ""),
    (D(2027, 5, 4), None, "Dodenherdenking", "Feestdag", "niet geschikt om commercieel op in te haken"),
    (D(2027, 5, 5), None, "Bevrijdingsdag", "Feestdag", ""),
    (D(2027, 5, 6), None, "Hemelvaartsdag", "Feestdag", ""),
    (D(2027, 5, 9), None, "Moederdag", "Inhaakdag", ""),
    (D(2027, 5, 16), None, "Eerste Pinksterdag", "Feestdag", ""),
    (D(2027, 5, 16), None, "Offerfeest", "Verwacht", "verwacht, hangt af van de maan"),
    (D(2027, 5, 17), None, "Tweede Pinksterdag", "Feestdag", ""),
    (D(2027, 6, 20), None, "Vaderdag", "Inhaakdag", ""),
    (D(2027, 7, 10), D(2027, 8, 22), "Zomervakantie regio noord", "Vakantie", ""),
    (D(2027, 7, 17), D(2027, 8, 29), "Zomervakantie regio midden", "Vakantie", ""),
    (D(2027, 7, 24), D(2027, 9, 5), "Zomervakantie regio zuid", "Vakantie", ""),
    (D(2027, 9, 21), None, "Prinsjesdag", "Feestdag", ""),
    (D(2027, 10, 4), None, "Dierendag", "Inhaakdag", ""),
    (D(2027, 10, 5), None, "Dag van de Leraar", "Inhaakdag", ""),
    (D(2027, 10, 8), None, "Paarse Vrijdag", "Inhaakdag", ""),
    (D(2027, 10, 10), None, "Wereld Mentale Gezondheidsdag", "Inhaakdag", ""),
    (D(2027, 10, 16), D(2027, 10, 24), "Herfstvakantie regio noord en midden", "Vakantie", "adviesdata"),
    (D(2027, 10, 23), D(2027, 10, 31), "Herfstvakantie regio zuid", "Vakantie", "adviesdata"),
    (D(2027, 10, 31), None, "Halloween", "Inhaakdag", ""),
    (D(2027, 10, 31), None, "Wintertijd: de klok een uur terug", "Klok", ""),
    (D(2027, 11, 11), None, "Sint-Maarten en Singles Day", "Inhaakdag", ""),
    (D(2027, 11, 26), None, "Black Friday", "Inhaakdag", ""),
    (D(2027, 11, 29), None, "Cyber Monday", "Inhaakdag", ""),
    (D(2027, 12, 5), None, "Pakjesavond", "Feestdag", ""),
    (D(2027, 12, 25), None, "Eerste Kerstdag", "Feestdag", ""),
    (D(2027, 12, 25), D(2028, 1, 9), "Kerstvakantie", "Vakantie", ""),
    (D(2027, 12, 26), None, "Tweede Kerstdag", "Feestdag", ""),
    (D(2027, 12, 31), None, "Oudejaarsdag", "Feestdag", ""),
]

DAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"]
MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september",
          "oktober", "november", "december"]


def easter(y: int) -> date:
    """Anonymous Gregorian algorithm."""
    a, b, c = y % 19, y // 100, y % 100
    d, e = b // 4, b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = c // 4, c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    return date(y, (h + l - 7 * m + 114) // 31, ((h + l - 7 * m + 114) % 31) + 1)


def nth_weekday(y: int, month: int, weekday: int, n: int) -> date:
    first = date(y, month, 1)
    return first + timedelta((weekday - first.weekday()) % 7 + 7 * (n - 1))


def last_weekday(y: int, month: int, weekday: int) -> date:
    last = (date(y, month + 1, 1) if month < 12 else date(y + 1, 1, 1)) - timedelta(1)
    return last - timedelta((last.weekday() - weekday) % 7)


def self_check() -> None:
    """Every rule-based date in MOMENTS must match its rule, so a typo cannot reach the page."""
    by_name = {name: start for start, _, name, _, _ in MOMENTS}
    e = easter(YEAR)
    assert easter(2026) == date(2026, 4, 5) and easter(2025) == date(2025, 4, 20), "easter() is wrong"
    expect = {
        "Goede Vrijdag": e - timedelta(2), "Eerste Paasdag": e, "Tweede Paasdag": e + timedelta(1),
        "Hemelvaartsdag": e + timedelta(39), "Eerste Pinksterdag": e + timedelta(49),
        "Tweede Pinksterdag": e + timedelta(50), "Carnaval": e - timedelta(49),
        "Blue Monday": nth_weekday(YEAR, 1, 0, 3), "Moederdag": nth_weekday(YEAR, 5, 6, 2),
        "Vaderdag": nth_weekday(YEAR, 6, 6, 3), "Prinsjesdag": nth_weekday(YEAR, 9, 1, 3),
        "Gedichtendag en Poëzieweek": last_weekday(YEAR, 1, 3),
        # Black Friday = the day after the fourth Thursday of November (US Thanksgiving).
        "Black Friday": nth_weekday(YEAR, 11, 3, 4) + timedelta(1),
        "Cyber Monday": nth_weekday(YEAR, 11, 3, 4) + timedelta(4),
        "Zomertijd: de klok een uur vooruit": last_weekday(YEAR, 3, 6),
        "Wintertijd: de klok een uur terug": last_weekday(YEAR, 10, 6),
        "Koningsdag": date(YEAR, 4, 27) if date(YEAR, 4, 27).weekday() != 6 else date(YEAR, 4, 26),
    }
    for name, want in expect.items():
        assert by_name[name] == want, f"{name}: {by_name[name]} != {want}"
    for start, end, name, _, _ in MOMENTS:
        assert start.year == YEAR, f"{name} is not in {YEAR}"
        assert end is None or end > start, f"{name}: end before start"
    assert [m[0] for m in MOMENTS] == sorted(m[0] for m in MOMENTS), "MOMENTS must be in date order"


def label(start: date, end: date | None) -> str:
    s = f"{DAYS[start.weekday()]} {start.day} {MONTHS[start.month - 1]}"
    if end is None:
        return s
    tail = f" {end.year}" if end.year != start.year else ""
    return f"{s} t/m {DAYS[end.weekday()]} {end.day} {MONTHS[end.month - 1]}{tail}"


def write_json() -> None:
    rows = [{"datum": label(s, e), "start": s.isoformat(), "moment": n, "soort": k, "noot": note}
            for s, e, n, k, note in MOMENTS]
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(rows, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


HEAD = Font(bold=True, color="FFFFFF")
HEAD_FILL = PatternFill("solid", fgColor="0A0D14")
TEAL = "00D4AA"
STATUSES = ["Idee", "In de maak", "Bij klant", "Aanpassen", "Goedgekeurd", "Ingepland", "Geplaatst"]
CHANNELS = ["Instagram", "LinkedIn", "Facebook", "TikTok", "YouTube", "Blog", "Nieuwsbrief", "Overig"]
FORMATS = ["Post", "Carrousel", "Reel of video", "Story", "Artikel", "Mail", "Overig"]
CLIENTS = ["Voorbeeldklant A", "Voorbeeldklant B", "Voorbeeldklant C"]


def header(ws, cols, widths) -> None:
    ws.append(cols)
    for i, w in enumerate(widths, start=1):
        cell = ws.cell(row=1, column=i)
        cell.font, cell.fill = HEAD, HEAD_FILL
        cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws.column_dimensions[cell.column_letter].width = w
    ws.freeze_panes = "A2"


def write_xlsx() -> None:
    wb = Workbook()

    ws = wb.active
    ws.title = "Uitleg"
    ws.column_dimensions["A"].width = 110
    lines = [
        (f"Contentkalender voor meerdere klanten, {YEAR}", Font(bold=True, size=16)),
        ("Gratis template van FutureMarketingAI. Gebruik het zoals je wilt, ook voor je klanten.", None),
        ("", None),
        ("Zo werkt het", Font(bold=True, size=12)),
        ("1. Vul op het tabblad Klanten per klant de basis in: merkstem, goedkeurder en hoeveel dagen die nodig heeft.", None),
        ("2. Zet al je posts, voor alle klanten, op het tabblad Planning. Eén regel per stuk content.", None),
        ("3. Filter de Planning op een klant voor de kalender van die klant. Zonder filter zie je de hele week van je team.", None),
        ("4. Houd de status bij. Status per klant telt vanzelf wat er bij elke klant ligt.", None),
        ("5. Kies op het tabblad Inhaakdagen alleen de momenten die bij een klant passen, en zet die in de Planning.", None),
        ("", None),
        ("Statussen", Font(bold=True, size=12)),
        ("Idee > In de maak > Bij klant > Aanpassen > Goedgekeurd > Ingepland > Geplaatst. Niets gaat naar Ingepland zonder Goedgekeurd.", None),
        ("", None),
        ("Google Sheets: Bestand > Importeren > Uploaden. Numbers en LibreOffice openen het bestand ook.", None),
        ("Datums van de inhaakdagen zijn gecontroleerd op 6 november 2026. Islamitische feestdagen zijn verwacht en hangen af van de maan.", None),
        (f"Uitleg en de inhaakkalender {YEAR} staan in het artikel: {ARTICLE_URL}", Font(color="0B7A63", underline="single")),
    ]
    for text, font in lines:
        ws.append([text])
        if font:
            ws.cell(row=ws.max_row, column=1).font = font
    ws.cell(row=ws.max_row, column=1).hyperlink = ARTICLE_URL

    wk = wb.create_sheet("Klanten")
    header(wk, ["Klant", "Merkstem in drie zinnen", "Doelgroep", "Kanalen", "Posts per week",
                "Goedkeurder bij de klant", "Dagen nodig voor goedkeuring", "Nooit gebruiken"],
           [22, 48, 30, 26, 14, 26, 16, 30])
    examples = [
        ("Warm en praktisch. Spreekt de lezer aan met je. Geen vakjargon.", "Ouders met jonge kinderen", "Instagram, Facebook", 3, "Marketingmanager", 2, "goedkoop, beste"),
        ("Zakelijk en kort. Cijfers boven beloftes.", "Inkopers in de bouw", "LinkedIn, Blog", 2, "Directeur", 3, "revolutionair"),
        ("Speels, met humor. Korte zinnen.", "Studenten", "Instagram, TikTok", 4, "Eigenaar", 1, ""),
    ]
    for client, row in zip(CLIENTS, examples):
        wk.append([client, *row])
    for r in wk.iter_rows(min_row=2, max_row=wk.max_row):
        for c in r:
            c.alignment = Alignment(vertical="top", wrap_text=True)

    wp = wb.create_sheet("Planning")
    header(wp, ["Datum", "Week", "Klant", "Kanaal", "Onderwerp", "Format", "Status", "Maker",
                "Naar klant op", "Goedgekeurd op", "Link naar het stuk", "Notitie"],
           [13, 7, 20, 14, 40, 15, 14, 14, 14, 14, 30, 30])
    first_monday = nth_weekday(YEAR, 1, 0, 1)
    plan = [
        (0, 0, "LinkedIn", "Vooruitblik op het nieuwe jaar", "Post", "Goedgekeurd"),
        (1, 0, "Instagram", "Blue Monday: tips voor een goede start van de week", "Carrousel", "Bij klant"),
        (2, 2, "TikTok", "Achter de schermen", "Reel of video", "In de maak"),
        (3, 1, "Blog", "Wat er in 2027 verandert voor je inkoop", "Artikel", "Idee"),
    ]
    for offset, ci, channel, topic, fmt, status in plan:
        wp.append([first_monday + timedelta(offset), None, CLIENTS[ci], channel, topic, fmt, status])
    for r in range(2, 501):
        wp.cell(row=r, column=1).number_format = "ddd d mmm yyyy"
        wp.cell(row=r, column=2).value = f'=IF(A{r}="","",ISOWEEKNUM(A{r}))'
        for col in (9, 10):
            wp.cell(row=r, column=col).number_format = "d mmm"
    wp.auto_filter.ref = "A1:L500"
    for col, values in (("C", "=Klanten!$A$2:$A$51"), ("D", f'"{",".join(CHANNELS)}"'),
                        ("F", f'"{",".join(FORMATS)}"'), ("G", f'"{",".join(STATUSES)}"')):
        dv = DataValidation(type="list", formula1=values, allow_blank=True)
        wp.add_data_validation(dv)
        dv.add(f"{col}2:{col}500")

    ws2 = wb.create_sheet("Status per klant")
    header(ws2, ["Klant", *STATUSES], [22] + [13] * len(STATUSES))
    for r in range(2, 52):
        ws2.cell(row=r, column=1).value = f'=IF(Klanten!A{r}="","",Klanten!A{r})'
        for i, status in enumerate(STATUSES, start=2):
            letter = ws2.cell(row=1, column=i).column_letter
            ws2.cell(row=r, column=i).value = (
                f'=IF($A{r}="","",COUNTIFS(Planning!$C:$C,$A{r},Planning!$G:$G,{letter}$1))'
            )

    wi = wb.create_sheet(f"Inhaakdagen {YEAR}")
    header(wi, ["Datum", "Tot en met", "Moment", "Soort", "Let op", "Past bij klant"], [16, 16, 40, 12, 40, 30])
    for start, end, name, kind, note in MOMENTS:
        wi.append([start, end, name, kind, note, ""])
        wi.cell(row=wi.max_row, column=1).number_format = "ddd d mmm yyyy"
        if end:
            wi.cell(row=wi.max_row, column=2).number_format = "ddd d mmm yyyy"
    wi.auto_filter.ref = f"A1:F{wi.max_row}"

    for sheet in wb.worksheets:
        sheet.sheet_properties.tabColor = TEAL
    XLSX.parent.mkdir(parents=True, exist_ok=True)
    wb.save(XLSX)


if __name__ == "__main__":
    self_check()
    write_json()
    write_xlsx()
    print(f"ok: {len(MOMENTS)} moments -> {JSON_OUT.relative_to(ROOT)} + {XLSX.relative_to(ROOT)}")
