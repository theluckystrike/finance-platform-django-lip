import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <Helmet>
          <title>Oland Investments </title>
          <meta
            name="description"
            content="Explore Oland Investments, a leading platform for stock market data analysis. View insightful Python-generated charts and tables to make informed investment decisions."
          />
          <meta
            name="keywords"
            content="Oland Investments, stock market analysis, data analysis, Python charts, investment insights, stock tables, market trends, financial analysis, stock data visualization, trading insights"
          />
        </Helmet>
        <Outlet />
      </div>
    </HelmetProvider>
  );
}

export default App;
