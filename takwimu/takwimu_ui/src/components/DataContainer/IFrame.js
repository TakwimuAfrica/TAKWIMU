import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '28.03125rem' // .75 of lg
    },
    [theme.breakpoints.up('lg')]: {
      width: '37.375rem'
    },
    minHeight: 450
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '26.71875rem' // .75 of lg
    },
    [theme.breakpoints.up('lg')]: {
      width: '33.875rem'
    },
    border: 0,
    '& .census-chart-embed': {
      background: theme.palette.data.light
    },
    '& #census-chart .column-set': {
      overflowX: 'scroll'
    }
  }
});

function IFrame({ id, classes, data }) {
  const [iframeChartLoaded, setIframeChartLoaded] = useState(false);
  useEffect(
    () => {
      let charttimer;
      if (iframeChartLoaded) {
        charttimer = setTimeout(() => setIframeChartLoaded(true), 1000);
      }
      return () => {
        if (charttimer) {
          clearTimeout(charttimer);
        }
      };
    },
    [iframeChartLoaded] // useEffect will run only one time
  );

  const handleFrameLoad = e => {
    const iframe = e.target;

    // add domtoimage
    const frameHead = iframe.contentDocument
      .getElementsByTagName('head')
      .item(0);
    const script = iframe.contentDocument.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js';
    frameHead.appendChild(script);
    // eslint-disable-next-line no-return-assign, no-param-reassign
    const hideFooter = n => (n.style = 'display: none');
    iframe.contentWindow.document.body.style.background = '#F5F5F5';
    iframe.contentWindow.document
      .querySelectorAll('.embed-footer')
      .forEach(hideFooter);
    if (iframe.contentDocument.getElementById('census-chart')) {
      setIframeChartLoaded(true);
    }
  };

  if (iframeChartLoaded) {
    const iframe = document.getElementById(id);
    iframe.height = iframe.contentWindow.document.body.scrollHeight;
  }
  const params = {
    geoID: `country-${data.data_country}`,
    geoVersion: 2009,
    chartDataID: data.data_id,
    dataYear: 2011,
    chartHeight: 300,
    chartType: data.chart_type,
    chartTitle: data.title,
    initialSort: '',
    statType: data.data_stat_type,
    chartSourceLink: data.data_source_link,
    chartSourceTitle: data.data_source_title,
    chartQualifier: data.chart_qualifier
      .replace(/<br[ /]*>/g, '\n')
      .replace(/<[^>]*>/g, '')
  };
  const queryString = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

  return (
    <div className={classNames(['cr-embed', classes.container])}>
      <iframe
        id={id}
        title={data.title}
        onLoad={handleFrameLoad}
        src={`/embed/iframe.html?${queryString}&stylesheet=/static/css/embedchart.css`}
        allowFullScreen
        className={classNames(['census-reporter-embed', classes.iframe])}
      />
    </div>
  );
}

IFrame.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(IFrame);
