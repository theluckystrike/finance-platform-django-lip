from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, KeepTogether, PageBreakIfNotEmpty
from reportlab.lib.units import inch
from io import BytesIO
from django.core.files import File
from django.utils import timezone
from .styles import styles, subheading_style, subtitle_style, chart_title_style, table_style, caption_style
import pandas as pd


class PDFBuilder:
    def __init__(self) -> None:
        self.buffer = BytesIO()
        self.pdf = SimpleDocTemplate(self.buffer, pagesize=A4,
                                     leftMargin=0.7*inch, rightMargin=0.7*inch)
        self.flowables = list()

    def add_title(self, title, subtitle: bool = True):
        title_text = Paragraph(title, styles['Title'])
        self.flowables.append(title_text)
        if subtitle:
            self.add_subtitle(
                f"Created on {timezone.now().strftime('%d %B %Y at %H:%M')}")

    def to_file(self):
        self.pdf.build(self.flowables)
        f = File(self.buffer)
        return f

    def add_subtitle(self, subtitle, spacer: bool = True):
        title_subtitle_text = Paragraph(
            subtitle, style=subtitle_style)
        self.flowables.append(title_subtitle_text)
        if spacer:
            self.flowables.append(Spacer(1, 12))

    def add_pagebreak(self):
        self.flowables.append(PageBreakIfNotEmpty())

    def add_pagebreak_if_not_empty(self):
        if len(self.flowables) > 3:
            self.flowables.append(PageBreakIfNotEmpty())

    def add_subheading1_new_page(self, subheading, spacer: bool = True):
        self.add_pagebreak()
        self.add_subheading1(subheading, spacer)

    def add_subheading1(self, subheading, spacer: bool = True):
        title_subtitle_text = Paragraph(
            f"<u>{subheading}</u>", style=subheading_style)
        self.flowables.append(title_subtitle_text)
        if spacer:
            self.flowables.append(Spacer(1, 12))

    def _chart_title(self, title):
        return Paragraph(
            title, style=chart_title_style)

    def add_chart_title(self, title, spacer: bool = True):
        chart_title = self._chart_title(title)
        self.flowables.append(chart_title)
        if spacer:
            self.flowables.append(Spacer(1, 12))

    def _caption(self, caption):
        return Paragraph(
            caption, style=caption_style)

    def add_caption(self, caption, spacer: bool = True):
        caption_text = self._caption(caption)
        self.flowables.append(caption_text)
        if spacer:
            self.flowables.append(Spacer(1, 12))

    def cleanup(self):
        self.buffer.close()
        self.flowables = list()

    def add_image(self, image, title, caption=None):
        image_flow = list()
        image_title = self._chart_title(title)
        image_flow.append(image_title)
        scale_factor = self.pdf.width/image.width
        scaled_height = image.height * scale_factor
        scaled_width = self.pdf.width
        if scaled_height > self.pdf.height - 50:
            scaled_height = self.pdf.height - 50
            scale_factor = scaled_height / image.height
            scaled_width = scale_factor * image.width
        
        img = Image(image, width=scaled_width, height=scaled_height)
        image_flow.append(img)
        if caption:
            caption_text = self._caption(caption)
            image_flow.append(caption_text)
        self.flowables.append(KeepTogether(image_flow))

    def add_table(self, csv_file, title, caption=None):
        table_dataframe = pd.read_csv(csv_file).round(3)
        table_flow = list()
        image_title = self._chart_title(title)
        table_flow.append(image_title)
        data = [table_dataframe.columns.tolist()] + \
            table_dataframe.values.tolist()
        table = Table(data, repeatRows=1, longTableOptimize=True)
        table.setStyle(table_style)
        table_flow.append(table)
        if caption:
            caption_text = self._caption(caption)
            table_flow.append(caption_text)
        self.flowables.append(KeepTogether(table_flow))
