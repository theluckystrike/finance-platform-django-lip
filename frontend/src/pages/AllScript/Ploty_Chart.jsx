import React, { useEffect } from "react";

const StockMultiChartPlot = ({ data, layout }) => {
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
          const layoutClone = JSON.parse(JSON.stringify({ ...layout }));

          // Set a fixed width in the layout if not provided
          layoutClone.width = 1000; // Set your desired width here
          
          // Initialize the plot
          window.Plotly.newPlot("plotDiv", dataClone, layoutClone); // Pass data and layout directly
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
  }, [data, layout]);

  return (
    <div style={{ width: "1000px", margin: "0 auto" }}> {/* Set a fixed width for the container */}
      {/* This div is where the Plotly chart will be rendered */}
      <div id="plotDiv" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default StockMultiChartPlot;
