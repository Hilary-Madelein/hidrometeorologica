import React, { useEffect } from 'react';
import * as echarts from 'echarts';

function Graficas() {
  useEffect(() => {
    // Obtener el elemento DOM donde se renderizará el gráfico
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    // Declarar la variable 'option'
    var yearCount = 7;
    var categoryCount = 30;
    var xAxisData = [];
    var customData = [];
    var legendData = [];
    var dataList = [];
    legendData.push('trend');
    var encodeY = [];
    
    // Crear los datos para el gráfico
    for (var i = 0; i < yearCount; i++) {
      legendData.push(2010 + i + '');
      dataList.push([]);
      encodeY.push(1 + i);
    }
    for (var i = 0; i < categoryCount; i++) {
      var val = Math.random() * 1000;
      xAxisData.push('category' + i);
      var customVal = [i];
      customData.push(customVal);
      for (var j = 0; j < dataList.length; j++) {
        var value =
          j === 0
            ? echarts.number.round(val, 2)
            : echarts.number.round(
                Math.max(0, dataList[j - 1][i] + (Math.random() - 0.5) * 200),
                2
              );
        dataList[j].push(value);
        customVal.push(value);
      }
    }

    // Configuración del gráfico en la variable 'option'
    var option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: legendData,
      },
      dataZoom: [
        {
          type: 'slider',
          start: 50,
          end: 70,
        },
        {
          type: 'inside',
          start: 50,
          end: 70,
        },
      ],
      xAxis: {
        data: xAxisData,
      },
      yAxis: {},
      series: [
        {
          type: 'custom',
          name: 'trend',
          renderItem: function (params, api) {
            var xValue = api.value(0);
            var currentSeriesIndices = api.currentSeriesIndices();
            var barLayout = api.barLayout({
              barGap: '30%',
              barCategoryGap: '20%',
              count: currentSeriesIndices.length - 1,
            });
            var points = [];
            for (var i = 0; i < currentSeriesIndices.length; i++) {
              var seriesIndex = currentSeriesIndices[i];
              if (seriesIndex !== params.seriesIndex) {
                var point = api.coord([xValue, api.value(seriesIndex)]);
                point[0] += barLayout[i - 1].offsetCenter;
                point[1] -= 20;
                points.push(point);
              }
            }
            var style = api.style({
              stroke: api.visual('color'),
              fill: 'none',
            });
            return {
              type: 'polyline',
              shape: {
                points: points,
              },
              style: style,
            };
          },
          itemStyle: {
            borderWidth: 2,
          },
          encode: {
            x: 0,
            y: encodeY,
          },
          data: customData,
          z: 100,
        },
        ...dataList.map(function (data, index) {
          return {
            type: 'bar',
            animation: false,
            name: legendData[index + 1],
            itemStyle: {
              opacity: 0.5,
            },
            data: data,
          };
        }),
      ],
    };

    // Establecer la opción en el gráfico
    myChart.setOption(option);
    
    // Limpiar el gráfico al desmontar el componente
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    // Crear el contenedor del gráfico con id "main"
    <div id="main" style={{ width: '100%', height: '500px' }}></div>
  );
}

export default Graficas;
