from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, KeepTogether, PageBreakIfNotEmpty, PageBreak
from reportlab.lib.units import inch
from io import BytesIO
from django.core.files import File
from django.utils import timezone
from .styles import styles, subheading_style, subtitle_style, chart_title_style, table_style, caption_style, table_text_style, TABLE_FONTNAME, TABLE_FONTSIZE
import pandas as pd
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage


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
        if len(self.flowables) > 3:
            self.flowables.append(PageBreak())

    def add_pagebreak_if_not_empty(self):
        if len(self.flowables) > 3:
            self.flowables.append(PageBreakIfNotEmpty())

    def add_subheading1_new_page(self, subheading, spacer: bool = True):
        self.add_pagebreak_if_not_empty()
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

        # Handle both Django ImageFile and BytesIO buffer
        if hasattr(image, 'open'):  # Django ImageFile
            img_file = image.open()
            pil_image = PILImage.open(img_file)
            img_width, img_height = pil_image.size
            img_file.close()
        else:  # BytesIO buffer
            pil_image = PILImage.open(image)
            img_width, img_height = pil_image.size
            image.seek(0)  # Rewind the buffer for future use

        # Calculate scaling factor
        scale_factor = self.pdf.width / img_width
        scaled_height = img_height * scale_factor
        scaled_width = self.pdf.width

        # Adjust scaling if the image is too tall
        if scaled_height > self.pdf.height - 50:
            scaled_height = self.pdf.height - 50
            scale_factor = scaled_height / img_height
            scaled_width = scale_factor * img_width

        # Create ReportLab Image object
        if hasattr(image, 'open'):  # Django ImageFile
            img = Image(image.open(), width=scaled_width, height=scaled_height)
            image.close()
        else:  # BytesIO buffer
            img = Image(image, width=scaled_width,
                        height=scaled_height)

        image_flow.append(img)

        # Add caption if provided
        if caption:
            caption_text = self._caption(caption)
            image_flow.append(caption_text)

        # Add the image flow to the document
        self.flowables.append(KeepTogether(image_flow))

    def _string_width(self, string, fontname, fontsize):
        return pdfmetrics.stringWidth(string, fontname, fontsize)

    def _df_to_table(self, df):
        data = [df.columns.tolist()] + \
            df.values.tolist()
        header_width = max([sum(
            [self._string_width(c, TABLE_FONTNAME, TABLE_FONTSIZE) for c in row]) for row in data])

        def tStyle(x): return Paragraph(
            x, table_text_style) if header_width > self.pdf.width else x

        data = [[tStyle(c) for c in row] for row in data]
        table = Table(data, repeatRows=1, longTableOptimize=True)
        table.setStyle(table_style)
        return table

    def add_table(self, csv_file: File | pd.DataFrame, title, caption=None):
        if type(csv_file) is pd.DataFrame:
            table_dataframe = csv_file.astype(str)
        else:
            table_dataframe = pd.read_csv(csv_file).astype(str)
        table_flow = list()
        image_title = self._chart_title(title)
        table_flow.append(image_title)
        table = self._df_to_table(table_dataframe)
        table_flow.append(table)
        if caption:
            caption_text = self._caption(caption)
            table_flow.append(caption_text)
        self.flowables.append(KeepTogether(table_flow))
