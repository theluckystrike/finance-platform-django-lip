import numpy as np
import matplotlib
from matplotlib.figure import Figure
from matplotlib.path import Path
import plotly.graph_objects as go

__all__ = [
    'get_subplot_grid_dimensions',
    'line_style_verbose_names',
    'get_row_col',
    'convert_marker_to_plotly',
    'get_marker_name_from_path',
]


def get_subplot_grid_dimensions(fig: Figure) -> tuple:
    # Extract all axes in the figure
    axes = fig.get_axes()

    # Store the subplot positions (left, bottom, width, height)
    positions = np.array([ax.get_position().bounds for ax in axes])

    # Define a threshold to consider positions similar (axes could have small positional differences)
    threshold = 1e-3

    # Sort positions by "bottom" coordinate (y-position)
    sorted_positions = positions[np.argsort(positions[:, 1])]

    # Identify unique rows based on the "bottom" coordinate
    rows = []
    for pos in sorted_positions:
        if len(rows) == 0 or np.abs(pos[1] - rows[-1][1]) > threshold:
            rows.append(pos)

    # Identify the number of columns based on unique "left" coordinates within each row
    row_positions = positions[np.argsort(
        positions[:, 0])]  # Sort by x-position
    cols = []
    for pos in row_positions:
        if len(cols) == 0 or np.abs(pos[0] - cols[-1][0]) > threshold:
            cols.append(pos)

    # The number of rows and columns
    num_rows = len(rows)
    num_columns = len(cols)

    return num_rows, num_columns


line_style_verbose_names = {
    '-': 'solid',
    '--': 'dash',
    '-.': 'dashdot',
    ':': 'dot',
    '': 'none',
    'None': 'none'
}

marker_styles = {
    'o': 'circle',
    's': 'square',
    '^': 'triangle-up',
    'v': 'triangle-down',
    '>': 'triangle-right',
    '<': 'triangle-left',
    'D': 'diamond',
    'd': 'diamond',
    'X': 'x-thin',
    'x': 'x-thin',
    '+': 'cross',
    'P': 'pentagon',  # Matplotlib '+' does not have a perfect match in Plotly
    '*': 'star'
}


def get_row_col(rows: int, cols: int, index: int) -> tuple[int, int]:
    return (index // cols) + 1, (index % cols) + 1


def convert_marker_to_plotly(mpl_marker: str) -> str:
    return marker_styles.get(mpl_marker, 'circle')


def get_marker_name_from_path(path: Path) -> str:
    """
    Function to identify the marker name from a given Path object.
    """
    for marker, name in marker_styles.items():
        marker_path = matplotlib.markers.MarkerStyle(marker).get_path()

        if marker_path.vertices.shape != path.vertices.shape:
            continue
        if np.all(marker_path.codes == path.codes):
            return name

    return None


def get_tickfont() -> dict:
    pass


def get_markerstyle() -> dict:
    pass


def get_linestyle() -> dict:
    pass


def get_ax_domain() -> list[float]:
    pass


def get_text_font() -> go.layout.Font:
    pass
