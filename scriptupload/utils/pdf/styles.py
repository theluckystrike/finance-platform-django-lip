from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import TableStyle

styles = getSampleStyleSheet()

table_style = TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('BOX', (0, 0), (-1, -1), 1, colors.black),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
])

subtitle_style = ParagraphStyle(
    "Subtitle", parent=styles['BodyText'], alignment=1)

subheading_style = ParagraphStyle(
    "Subtitle", parent=styles['Heading2'])

chart_title_style = ParagraphStyle(
    "Subtitle", parent=styles['Heading3'], alignment=1)

caption_style = ParagraphStyle(
    "Caption", parent=styles['Italic'], alignment=1, fontSize=9)
