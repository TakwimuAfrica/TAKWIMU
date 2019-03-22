import React from 'react';

import { Typography, Grid, withStyles } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import Section from './Section';

import reasearchIcon from './assets/a-chart.svg';
import downloadIcon from './assets/cloud-download-93.svg';
import presentIcon from './assets/computer-upload.svg';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.iceBlue
  },
  box: {
    width: '19rem',
    height: '17.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.25rem'
  },
  label: {
    fontWeight: 'bold'
  }
});

function WhatCanYouDo({ classes }) {
  return (
    <Section title="What can you do with Takwimu" titleVariant="h1">
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.container}
      >
        <Grid item>
          <div className={classes.box}>
            <img alt="research" src={reasearchIcon} />
            <Typography variant="body1" className={classes.label}>
              Research
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, adipiscing elitauris con lorem ipsum
              dolor sit amet.
            </Typography>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.box}>
            <img alt="download" src={downloadIcon} />
            <Typography variant="body1" className={classes.label}>
              Download
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, adipiscing elitauris con lorem ipsum
              dolor sit amet.
            </Typography>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.box}>
            <img alt="present" src={presentIcon} />
            <Typography variant="body1" className={classes.label}>
              Present
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, adipiscing elitauris con lorem ipsum
              dolor sit amet.
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Section>
  );
}

WhatCanYouDo.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(WhatCanYouDo);
