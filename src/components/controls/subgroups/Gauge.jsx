
import React from 'react'
import ReactHighcharts from 'react-highcharts'
import highchartsMore from 'highcharts-more'

highchartsMore(ReactHighcharts.Highcharts)

const propTypes = {
  value: React.PropTypes.number,
  title: React.PropTypes.string,
  units: React.PropTypes.string,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
}

class Guage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      config: {
        chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
        },

        title: {
          text: this.props.title,
        },

        pane: {
          startAngle: -150,
          endAngle: 150,
          background: [{
            backgroundColor: {
              radialGradient: { cx: 0.503, cy: 0.504, r: 0.5 },
              stops: [
                [0.70, 'rgba(0, 0, 0, 1)'],
                [0.97, 'rgba(0, 0, 0, 0)'],
              ],
            },
            borderWidth: 0,
            outerRadius: '115%',
          }, {
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#F9F9F9'],
                [1, '#EEE'],
              ],
            },
            borderWidth: 0,
            outerRadius: '109%',
          }],
        },

        // the value axis
        yAxis: {
          min: this.props.min,
          max: this.props.max,

          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            rotation: 'auto',
          },
          title: {
            text: this.props.units,
          },
          plotBands: [{
            from: this.props.min,
            to: (this.props.max - this.props.min) * 3 / 5,
            color: '#55BF3B', // green
          }, {
            from: (this.props.max - this.props.min) * 3 / 5,
            to: (this.props.max - this.props.min) * 4 / 5,
            color: '#DDDF0D', // yellow
          }, {
            from: (this.props.max - this.props.min) * 4 / 5,
            to: this.props.max,
            color: '#DF5353', // red
          }],
        },

        series: [{
          name: this.props.title,
          data: [props.value || 0],
          animation: false,
          tooltip: {
            valueSuffix: ` ${this.props.units}`,
          },
        }],

        credits: {
          enabled: false,
        },
      },
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      const chart = this.refs.chart.getChart()
      chart.series[0].setData([nextProps.value], true)
    }
  }

  render () {
    return (
      <ReactHighcharts ref="chart" config={this.state.config} isPureConfig />
    )
  }
}

Guage.propTypes = propTypes

export default Guage
