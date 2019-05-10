import React from 'react';

import { Typography, Grid, withStyles } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import Section from './Section';

import reasearchIcon from '../assets/images/a-chart.svg';
import downloadIcon from '../assets/images/cloud-download-93.svg';
import presentIcon from '../assets/images/computer-upload.svg';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.info.main,
    padding: '2.438rem 0.625rem',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    },
    [theme.breakpoints.up('lg')]: {
      padding: '2.438rem 2.5rem 2.9375rem 5.375rem'
    }
  },
  box: {
    width: '19rem',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: '1.25rem',
    [theme.breakpoints.up('md')]: {
      margin: '0'
    }
  },
  label: {
    fontWeight: 'bold',
    padding: '17px 0 22px'
  },
  title: {
    marginBottom: '3.0625rem'
  },
  description: {
    fontSize: theme.typography.body1.fontSize
  }
});

// These icons will be reused in the order written here if there are more
// than three uses
const icons = [reasearchIcon, downloadIcon, presentIcon];

function WhatYouCanDoWithTakwimu({
  classes,
  takwimu: {
    page: {
      what_you_can_do_with_takwimu: { value: whatYouCanDo }
    }
  }
}) {
  if (!whatYouCanDo) {
    return null;
  }

  const { title, uses_of_takwimu: usesOfTakwimu } = whatYouCanDo;

  return (
    <Section title={title}>
      {usesOfTakwimu && usesOfTakwimu.length > 0 && (
        <Grid container justify="flex-start" className={classes.container}>
          {usesOfTakwimu.map((u, i) => (
            <Grid key={u.value.title} item>
              <div className={classes.box}>
                <img alt="research" src={icons[i]} />
                <Typography
                  variant="body1"
                  className={classes.label}
                  dangerouslySetInnerHTML={{ __html: u.value.title }}
                />
                <Typography
                  variant="body2"
                  className={classes.description}
                  dangerouslySetInnerHTML={{ __html: u.value.description }}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </Section>
  );
}

WhatYouCanDoWithTakwimu.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  takwimu: PropTypes.shape({
    page: PropTypes.shape({
      what_you_can_do_with_takwimu: PropTypes.shape({
        value: PropTypes.shape({
          title: PropTypes.string,
          uses_of_takwimu: PropTypes.arrayOf(
            PropTypes.shape({
              value: PropTypes.shape({
                title: PropTypes.string,
                description: PropTypes.string
              })
            })
          )
        })
      }).isRequired
    }).isRequired
  }).isRequired
};

export default withStyles(styles)(WhatYouCanDoWithTakwimu);