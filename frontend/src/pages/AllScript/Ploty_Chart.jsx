import React, { useEffect, useState } from "react";

const StockMultiChartPlot = ({ data, layout }) => {
  // Set the screen width as a state so the component can re-render when it changes
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to handle resizing of the screen
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add the event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Create a script tag to load the Plotly library
    const script = document.createElement("script");
    script.src = "https://cdn.plot.ly/plotly-2.35.2.min.js";
    script.async = true;
    script.crossOrigin = "anonymous"; // Prevent cross-origin issues

    script.onload = () => {
      try {
        // Ensure Plotly is available
        if (window.Plotly && data && layout) {
          // Deep clone data and layout to avoid immutability issues
          const dataClone = JSON.parse(JSON.stringify(data));
          const layoutClone = JSON.parse(JSON.stringify(layout));
const chartSize =  screenWidth * 0.8
          // Set layout width to 70% of the screen width
          layoutClone.width = screenWidth * 0.8 < 762 ? screenWidth+120: screenWidth * 0.8; 
if ( screenWidth < 762) {
  layoutClone.height =  550
  
}


// layoutClone.showlegend = true;
// layoutClone.legend = {
//   x: 0,
//   y: 1,
//   orientation: "v",
//   bgcolor: "#00000000",
//   bordercolor: "#21252999",
//   borderStyle: 'outset',
//   // marginLeft:'-10px',

//   borderwidth: 2,
//   font: {
//     family: "Arial",
//     size: 10,
//     color: "#000"
//   }
// };

console.log(layoutClone,[...dataClone,{
  "x": ['1970-01-01 00:00:00', '1970-01-02 00:00:00'],  // Same range as first dataset
  "y": [0,  0.04420795408615419],
  "line": {
      "dash": "solid",
      "color": "#0000ff",
      "width": 1.5
  },
  "mode": "lines",
  "name": "child1",
  "type": "scatter",
  "xaxis": "x",
  "yaxis": "y"
}]);

          // Adjust the height proportionally to the width (e.g., 50% of width)

          // Initialize the plot
          window.Plotly.newPlot("plotDiv", [...dataClone,{
           "x": ['1970-01-01 00:00:00', '1970-01-02 00:00:00'],  // Same range as first dataset
  "y": [0,  0.04420795408615419],
            "line": {
                "dash": "solid",
                "color": "#0000ff",
                "width": 1.5
            },
            "mode": "lines",
            "name": "child1",
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        }], layoutClone);
        } else {
          console.error("Plotly failed to load.");
        }
      } catch (error) {
        console.error("Error rendering Plotly chart:", error);
      }
    };

    script.onerror = () => {
      console.error("Failed to load Plotly script.");
    };

    // Append the script to the document head
    document.head.appendChild(script);

    // Clean up by removing the script when the component is unmounted
    return () => {
      document.head.removeChild(script);
    };
  }, [data, layout, screenWidth]); // Re-run useEffect when screenWidth changes

  return (
    <div style={{ width: "100%", margin: "0 auto" }}> {/* 70% width container */}
      <div id="plotDiv" style={{ width: "100%", height: "100%"   ,  marginLeft: `${screenWidth * 0.8 < 720? '-75px' :''}` }}></div>
    </div>
  );
};

export default StockMultiChartPlot;
