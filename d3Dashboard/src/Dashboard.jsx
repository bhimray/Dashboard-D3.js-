import React from "react";
import BarCharts from "./Charts.tsx/BarCharts";
import { Box, Typography } from "@mui/material";
import HorizontalDivergedBarChart from "./Charts.tsx/HorizontalDivergedBarChart";


const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h2">DashBoard</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
        <HorizontalDivergedBarChart />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
        <BarCharts />
      </Box>
    </Box>
  );
};

export default Dashboard;
