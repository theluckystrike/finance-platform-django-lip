from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import TableStyle

styles = getSampleStyleSheet()

TABLE_FONTSIZE = 10
TABLE_FONTNAME = 'Helvetica'

table_style = TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), TABLE_FONTSIZE),
    ('FONTNAME', (0, 1), (-1, -1), TABLE_FONTNAME),
    ('FONTSIZE', (0, 1), (-1, -1), TABLE_FONTSIZE),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('BOX', (0, 0), (-1, -1), 1, colors.black),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
])

# table_text_style = styles['BodyText']
# table_text_style.wordWrap = "LTR"
# table_text_style.alignment = "LTR"

table_text_style = ParagraphStyle(
    "Subtitle", parent=styles['Normal'], wordWrap="LTR", alignment=1, fontName=TABLE_FONTNAME, fontSize=TABLE_FONTSIZE)

subtitle_style = ParagraphStyle(
    "Subtitle", parent=styles['BodyText'], alignment=1)

subheading_style = ParagraphStyle(
    "Subtitle", parent=styles['Heading2'])

chart_title_style = ParagraphStyle(
    "Subtitle", parent=styles['Heading3'], alignment=1)

caption_style = ParagraphStyle(
    "Caption", parent=styles['Italic'], alignment=1, fontSize=9)
