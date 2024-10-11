from matplotlib.colors import to_hex, to_rgba
import numpy as np
from .helpers import (
    get_subplot_grid_dimensions,
    get_marker_name_from_path,
    line_style_verbose_names
)
import plotly.graph_objects as go
import plotly.matplotlylib.mpltools as mpltls
import matplotlib
import plotly
import json


class MpltToPlotly:
    '''<b>** Work in Progress **</b>
    Tool for converting matplotlib Figure objects into Plotly JSON/HTML
    '''
    def __init__(self, fig: matplotlib.figure.Figure) -> None:
        self.mplfig = fig
        # self.layout = get_subplot_grid_dimensions(fig)
        self.subplots = self.get_subplots(fig)
        self.fig = go.Figure()

        self.x_ct = 0
        self.y_ct = 0
        self.x_ax_dates = False
        self.current_mpl_ax = None

        self.fig.update_layout(
            width=self.mplfig.get_size_inches()[0]*100,
            height=self.mplfig.get_size_inches()[1]*100,
            # try do this better
            plot_bgcolor=to_hex(fig.axes[0].get_facecolor()),
            paper_bgcolor=to_hex(fig.get_facecolor()),
            showlegend=False
        )
        self.fig.layout['hoverlabel']['namelength'] = -1

        self.mpl_x_bounds, self.mpl_y_bounds = mpltls.get_axes_bounds(fig)
        margin = go.layout.Margin(
            l=int(self.mpl_x_bounds[0] * self.fig["layout"]["width"]),
            r=int((1 - self.mpl_x_bounds[1]) *
                  self.fig["layout"]["width"]),
            t=int((1 - self.mpl_y_bounds[1]) *
                  self.fig["layout"]["height"]),
            b=int(self.mpl_y_bounds[0] * self.fig["layout"]["height"]),
            pad=0,
        )
        self.fig["layout"]["margin"] = margin

    def setup_layout(self):
        pass

    def compare_positions(self, pos1, pos2, threshold=1e-2):
        # move to utils
        return (np.abs(pos1.y0 - pos2.y0) < threshold and
                np.abs(pos1.y1 - pos2.y1) < threshold and
                np.abs(pos1.x0 - pos2.x0) < threshold and
                np.abs(pos1.x1 - pos2.x1) < threshold)

    def get_subplots(self, fig):
        visited = set()
        ax_list = []
        for ax in fig.axes:
            if ax in visited:
                continue
            xsibs = ax.get_shared_x_axes().get_siblings(ax)
            ysibs = ax.get_shared_y_axes().get_siblings(ax)

            new_xsibs = []
            for x in xsibs:
                if x == ax:
                    continue
                if self.compare_positions(ax.get_position(), x.get_position()):
                    # print("twinx")
                    new_xsibs.append(x)

            this = {
                'root': ax,
                'xsibs': [x for x in new_xsibs if x != ax],
                'ysibs': [y for y in ysibs if y != ax]
            }
            ax_list.append(this)
            for s in new_xsibs:
                visited.add(s)
            for s in ysibs:
                visited.add(s)
        return ax_list

    def get_subplot_titles(self):
        if not self.subplots:
            raise ValueError("No subplots found")
        return [ax['root'].get_title() for ax in self.subplots]

    def draw_line(self, line, mode='lines'):
        x = self.convert_xaxis_date(line.get_xdata())
        self.fig.add_trace(
            go.Scatter(
                x=x,
                y=line.get_ydata(),
                mode=mode,
                name=line.get_label(),
                line=dict(
                    color=to_hex(line.get_color()),
                    dash=line_style_verbose_names.get(
                        line.get_linestyle(), None),
                    width=line.get_linewidth(),
                ),
                xaxis=f'x{self.x_ct}',
                yaxis=f'y{self.y_ct}',
            ),
        )

    def marker_size(self, size):
        # move to utils
        return (size**0.5)*1.33

    def draw_scatter(self, collection, mode='markers'):
        x = self.convert_xaxis_date(collection.get_offsets()[:, 0])
        markersize = collection.get_sizes()
        if len(markersize) > 0:
            markersize = self.marker_size(markersize[0])
        else:
            markersize = None
        self.fig.add_trace(
            go.Scatter(
                x=x,
                y=collection.get_offsets()[:, 1],
                mode=mode,
                name=collection.get_label(),
                # line=dict(
                #     color=to_hex(
                #         collection.get_facecolors()[0]),
                #     width=1,
                # ),
                marker=dict(
                    color=to_hex(
                        collection.get_facecolors()[0]),
                    size=markersize,
                    symbol=get_marker_name_from_path(
                        collection.get_paths()[0]),
                ),
                xaxis=f'x{self.x_ct}',
                yaxis=f'y{self.y_ct}',
            ),
        )

    def draw_bars(self, bars):
        x = self.convert_xaxis_date(
            [b.get_width()/2 + b.get_x() for b in bars])

        self.fig.add_trace(
            go.Bar(
                x=x,
                y=[b.get_height()for b in bars],
                # mode=mode,
                name=bars.get_label(),
                marker_color=[to_hex(
                    b.get_facecolor()) for b in bars],
                xaxis=f'x{self.x_ct}',
                yaxis=f'y{self.y_ct}',
            ),
        )

    def draw_text(self, text):
        # this is just for drawing titles
        x_px, y_px = text.get_transform(
        ).transform(text.get_position())
        x, y = plotly.matplotlylib.mpltools.display_to_paper(
            x_px, y_px, self.fig.layout)
        annotation = go.layout.Annotation(
            text=text.get_text(),
            font=go.layout.annotation.Font(
                color=to_hex(text.get_color()), size=18, weight='bold', family=text.get_fontfamily()[0], style=text.get_fontstyle().lower()
            ),
            xref="paper",
            yref="paper",
            x=x,
            y=y,
            xanchor="center",
            yanchor="bottom",
            showarrow=False,  # no arrow for a title!
        )
        self.fig["layout"]["annotations"] += (annotation,)

    def convert_xaxis_date(self, data):
        if self.x_ax_dates:
            return mpltls.mpl_dates_to_datestrings(data, self.current_mpl_ax.get_xaxis().get_major_formatter().__class__.__name__)
        else:
            return data

    def crawl_ax(self, ax, xsib=False, ysib=False):
        if 'date' in self.current_mpl_ax.get_xaxis().get_major_formatter().__class__.__name__.lower():
            self.x_ax_dates = True
        else:
            self.x_ax_dates = False
        for line in ax.lines:
            self.draw_line(line)

        for scatter in ax.collections:
            self.draw_scatter(scatter)

        for container in ax.containers:
            self.draw_bars(container)

        self.draw_text(ax.title)

        if not xsib:
            xticks = self.convert_xaxis_date(ax.get_xticks())

            self.fig.layout[f'xaxis{self.x_ct}'] = dict(
                title=ax.get_xlabel(),
                titlefont=dict(color=to_hex(
                    ax.xaxis.label.get_color())),
                tickvals=xticks,
                ticktext=[tick.get_text() for tick in ax.get_xticklabels()],
                tickfont=dict(color=None if len(
                    ax.get_xticklabels()) == 0 else to_hex(
                    ax.get_xticklabels()[0].get_color())),
                showticklabels=False if len(
                    ax.get_xticklabels()) == 0 else True,
                ticks='outside',
                range=self.convert_xaxis_date(
                    [ax.get_xlim()[0], ax.get_xlim()[1]]),
                showline=True,
                linewidth=1,
                linecolor=to_hex(
                    ax.spines['bottom'].get_edgecolor()),
                overlaying=self.basex if ysib else None,
                side='top' if ysib else 'bottom',
                domain=mpltls.convert_x_domain([ax.get_position().x0, ax.get_position(
                ).y0, ax.get_position().x1-ax.get_position().x0, ax.get_position().y1 - ax.get_position().y0], self.mpl_x_bounds),
                anchor=self.basey if ysib else f'y{self.y_ct}',
                mirror=True,
                showgrid=ax.xaxis.get_gridlines()[0].get_visible(),
                gridcolor=self.mpl_col_to_rgba(
                    ax.xaxis.get_gridlines()[0].get_color(), ax.xaxis.get_gridlines()[0].get_alpha()),
                griddash=line_style_verbose_names.get(
                    ax.xaxis.get_gridlines()[0].get_linestyle(), None)
            )
        if not ysib:
            self.fig.layout[f'yaxis{self.y_ct}'] = dict(
                title=ax.get_ylabel(),
                tickvals=ax.get_yticks(),
                ticktext=[tick.get_text() for tick in ax.get_yticklabels()],
                titlefont=dict(color=to_hex(
                    ax.yaxis.label.get_color())),
                showticklabels=False if len(
                    ax.get_yticklabels()) == 0 else True,
                tickfont=dict(color=None if len(
                    ax.get_yticklabels()) == 0 else to_hex(
                    ax.get_yticklabels()[0].get_color())),
                ticks='outside',
                range=[ax.get_ylim()[0], ax.get_ylim()[1]],
                showline=True,
                linewidth=1,
                linecolor=to_hex(
                    ax.spines['right'].get_edgecolor()),
                overlaying=self.basey if xsib else None,
                side='right' if xsib else 'left',
                # side=ax.yaxis.get_ticks_position(),
                domain=mpltls.convert_y_domain([ax.get_position().x0, ax.get_position(
                ).y0, ax.get_position().x1-ax.get_position().x0, ax.get_position().y1 - ax.get_position().y0], self.mpl_y_bounds),
                anchor=self.basex if xsib else f'x{self.x_ct}',
                mirror=True,
                showgrid=ax.yaxis.get_gridlines()[0].get_visible(),
                gridcolor=self.mpl_col_to_rgba(
                    ax.yaxis.get_gridlines()[0].get_color(), ax.yaxis.get_gridlines()[0].get_alpha()),
                griddash=line_style_verbose_names.get(
                    ax.yaxis.get_gridlines()[0].get_linestyle(), None),
                zeroline=False
            )

    def mpl_col_to_rgba(self, mplcol, a=1.0):
        rgb = to_rgba(mplcol, a)
        return f"rgba({rgb[0]},{rgb[1]},{rgb[2]},{rgb[3]})"

    def crawl_fig(self):
        for subplot in self.subplots:
            self.x_ct += 1
            self.y_ct += 1
            self.basex = f"x{self.x_ct}"
            self.basey = f"y{self.y_ct}"
            self.current_mpl_ax = subplot['root']
            self.crawl_ax(subplot['root'])

            if subplot['xsibs']:
                self.y_ct += 1
                self.current_mpl_ax = subplot['xsibs'][0]
                self.crawl_ax(subplot['xsibs'][0], xsib=True)
            elif subplot['ysibs']:
                self.x_ct += 1
                self.current_mpl_ax = subplot['ysibs'][0]
                self.crawl_ax(subplot['ysibs'][0], ysib=True)

    @property
    def json(self):
        return json.loads(self.fig.to_json())
