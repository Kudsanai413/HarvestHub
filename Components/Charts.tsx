import React from "react";
import { View, Text, Dimensions } from "react-native";
import { Svg, Rect, G, Text as SvgText } from "react-native-svg";

const data = [
  { label: "Carrots", value: 50 },
  { label: "Cabbage", value: 30 },
  { label: "Tomatoes", value: 80 },
];

const screenWidth = Dimensions.get("window").width;
const BAR_WIDTH = 40;
const CHART_HEIGHT = 200;
const CHART_WIDTH = Math.min(screenWidth - 40, 300);
const MAX_VALUE = Math.max(...data.map((item) => item.value));

const HarvestChart = () => {
  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Harvest Quantity</Text>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <G transform={`translate(20, ${CHART_HEIGHT - 20})`}>
          {data.map((item, index) => {
            const barHeight = (item.value / MAX_VALUE) * (CHART_HEIGHT - 50);
            return (
              <G key={index} transform={`translate(${index * (CHART_WIDTH / data.length)}, 0)`}>
                <Rect
                  x="0"
                  y={-barHeight}
                  width={BAR_WIDTH}
                  height={barHeight}
                  fill="#007AFF"
                />
                <SvgText x={BAR_WIDTH / 2} y={25} textAnchor="middle" fontSize="12" fill="black">
                  {item.label}
                </SvgText>
                <SvgText x={BAR_WIDTH / 2} y={-barHeight - 5} textAnchor="middle" fontSize="12" fill="black">
                  {item.value}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default HarvestChart;
