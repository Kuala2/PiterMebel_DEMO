from pathlib import Path
from shutil import copyfile

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "kitchen-electrics-checklist.pdf"
PUBLIC_COPY = ROOT / "public" / "downloads" / "kitchen-electrics-checklist.pdf"

CHARCOAL = HexColor("#22252A")
SLATE = HexColor("#E9ECEF")
MUTED = HexColor("#606775")
GREEN = HexColor("#72C324")
LINE = HexColor("#C8CDD4")


def wrap(text, font, size, width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if pdfmetrics.stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c, text, x, y, width, font="Arial", size=8, leading=10, max_lines=3):
    for index, line in enumerate(wrap(text, font, size, width)[:max_lines]):
        c.setFont(font, size)
        c.drawString(x, y - index * leading, line)


def checkbox(c, x, y, text, width):
    c.setStrokeColor(CHARCOAL)
    c.rect(x, y - 8, 9, 9, stroke=1, fill=0)
    draw_wrapped(c, text, x + 15, y, width - 15, size=8.4, leading=10, max_lines=2)


def section_title(c, y, number, title):
    c.setFillColor(GREEN)
    c.setFont("Arial-Bold", 9)
    c.drawString(36, y, number)
    c.setFillColor(CHARCOAL)
    c.setFont("Arial-Bold", 11)
    c.drawString(58, y, title)


def build_pdf(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", "C:/Windows/Fonts/arialbd.ttf"))

    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    width, height = A4
    c.setTitle("Чек-лист электрики для кухни - ПитерМебель")
    c.setAuthor("ПитерМебель")
    c.setSubject("Проверка исходных данных перед электромонтажом кухни")

    c.setFillColor(CHARCOAL)
    c.rect(0, height - 112, width, 112, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.rect(0, height - 112, 10, 112, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Arial-Bold", 20)
    c.drawString(36, height - 48, "Чек-лист электрики для кухни")
    c.setFont("Arial", 10)
    c.setFillColor(HexColor("#C7CCD4"))
    c.drawString(36, height - 70, "Заполняется после выбора планировки и моделей техники - до штробления")
    c.setFillColor(GREEN)
    c.setFont("Arial-Bold", 9)
    c.drawRightString(width - 36, height - 92, "ПИТЕРМЕБЕЛЬ / ПОДГОТОВКА ПРОЕКТА")
    c.setFillColor(HexColor("#C7CCD4"))
    c.setFont("Arial", 7.5)
    c.drawRightString(width - 36, height - 104, "Версия 1.0 / сентябрь 2026")

    y = height - 140
    c.setFillColor(MUTED)
    c.setFont("Arial", 8)
    labels = [(36, "Проект / помещение", 205), (255, "Версия плана / дата", 140), (409, "Ответственный", 150)]
    for x, label, line_width in labels:
        c.drawString(x, y, label)
        c.setStrokeColor(LINE)
        c.line(x, y - 18, x + line_width, y - 18)

    y -= 46
    section_title(c, y, "01", "Исходные данные подтверждены")
    checks = [
        "Указана отметка чистового пола", "Утверждена планировка кухни",
        "Выбраны точные модели техники", "Отмечены корпуса и выдвижные ящики",
        "Учтены фартук и толщина панелей", "Указаны выводы воды и вентиляции",
        "Схема передана дизайнеру мебели", "Нагрузки проверяет квалифицированный электрик",
    ]
    y -= 24
    for index, item in enumerate(checks):
        col = index % 2
        row = index // 2
        checkbox(c, 36 + col * 262, y - row * 22, item, 244)

    y -= 104
    section_title(c, y, "02", "Точки привязаны к конкретной технике и мебели")
    y -= 18
    table_x = 36
    col_widths = [102, 112, 150, 159]
    headers = ["Зона", "Модель / мощность", "Мебельное ограничение", "Точка, доступ и примечание"]
    rows = [
        ["Холодильник", "", "Ниша, вентиляционные зазоры", ""],
        ["Варочная панель", "", "Корпус, ящики, толщина столешницы", ""],
        ["Духовой шкаф", "", "Колонна или нижний модуль", ""],
        ["Вытяжка", "", "Шкаф, канал, высота установки", ""],
        ["Посудомоечная машина", "", "Не размещать точку прямо за корпусом", ""],
        ["СВЧ / кофемашина", "", "Ниша и доступ для обслуживания", ""],
        ["Розетки фартука", "", "Не попадать в рейлинги и подъёмники", ""],
        ["Подсветка", "", "Блок питания и сервисный доступ", ""],
        ["Остров / полуостров", "", "Маршрут до устройства пола", ""],
    ]
    header_h, row_h = 27, 31
    c.setFillColor(CHARCOAL)
    c.rect(table_x, y - header_h, sum(col_widths), header_h, stroke=0, fill=1)
    x = table_x
    for header, col_width in zip(headers, col_widths):
        c.setFillColor(white)
        draw_wrapped(c, header, x + 6, y - 11, col_width - 12, font="Arial-Bold", size=7.2, leading=8, max_lines=2)
        x += col_width
    y -= header_h
    for row_index, row in enumerate(rows):
        c.setFillColor(SLATE if row_index % 2 == 0 else white)
        c.rect(table_x, y - row_h, sum(col_widths), row_h, stroke=0, fill=1)
        x = table_x
        for cell_index, (cell, col_width) in enumerate(zip(row, col_widths)):
            c.setStrokeColor(LINE)
            c.rect(x, y - row_h, col_width, row_h, stroke=1, fill=0)
            if cell:
                c.setFillColor(CHARCOAL if cell_index == 0 else MUTED)
                draw_wrapped(c, cell, x + 6, y - 11, col_width - 12, font="Arial-Bold" if cell_index == 0 else "Arial", size=7.1, leading=8, max_lines=3)
            x += col_width
        y -= row_h

    y -= 18
    section_title(c, y, "03", "Финальная сверка до начала работ")
    y -= 22
    final_checks = [
        "Все высоты заданы от чистового пола", "Сверены инструкции именно выбранных моделей",
        "К соединениям сохранён сервисный доступ", "Защита, кабели и нагрузки согласованы электриком",
    ]
    for index, item in enumerate(final_checks):
        checkbox(c, 36 + (index % 2) * 262, y - (index // 2) * 23, item, 244)

    y -= 66
    c.setFillColor(HexColor("#F1F7EB"))
    c.setStrokeColor(GREEN)
    c.rect(36, y - 34, 523, 40, stroke=1, fill=1)
    c.setFillColor(CHARCOAL)
    c.setFont("Arial-Bold", 8.2)
    c.drawString(47, y - 7, "Важно:")
    draw_wrapped(c, "Этот лист фиксирует исходные данные для проекта мебели, но не заменяет электрический проект, инструкции производителей и проверку квалифицированным электриком.", 90, y - 7, 456, size=7.8, leading=9, max_lines=3)

    y -= 58
    c.setFillColor(MUTED)
    c.setFont("Arial", 7.6)
    for x, label, line_width in [(36, "Проектировщик мебели", 155), (212, "Электрик", 155), (388, "Заказчик", 171)]:
        c.drawString(x, y, label)
        c.setStrokeColor(LINE)
        c.line(x, y - 17, x + line_width, y - 17)
        c.drawString(x, y - 29, "подпись / дата")

    c.save()


build_pdf(OUTPUT)
PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
copyfile(OUTPUT, PUBLIC_COPY)
print(OUTPUT)
print(PUBLIC_COPY)
