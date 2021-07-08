import React, { useState } from 'react'
import { ClickAwayListener, Grid, Hidden, Icon, Tooltip, Typography } from '@material-ui/core'
import HintIcon from '@static/svg/questionMarkCircle.svg'
import useStyles from './style'

export const ClaimAmount: React.FC = () => {
  const classes = useStyles()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const hint =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque posuere neque et laoreet sollicitudin.'

  return (
    <Grid container alignItems='center' className={classes.root}>
      <Grid item style={{ marginRight: 15 }}>
        <Typography className={classes.text}>999.99 M points</Typography>
      </Grid>
      <Grid item>
        <Grid item>
          <Hidden mdDown>
            <Icon>
              <Tooltip classes={{ tooltip: classes.tooltip }} title={hint} placement='bottom'>
                <img src={HintIcon} alt='' className={classes.questionMark} />
              </Tooltip>
            </Icon>
          </Hidden>
          <Hidden lgUp>
            <ClickAwayListener onClickAway={() => setIsPopoverOpen(false)}>
              <Icon onClick={() => setIsPopoverOpen(true)}>
                <Tooltip
                  classes={{ tooltip: classes.tooltip }}
                  title={hint}
                  placement='bottom'
                  open={isPopoverOpen}
                  onClose={() => setIsPopoverOpen(false)}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener>
                  <img src={HintIcon} alt='' className={classes.questionMark} />
                </Tooltip>
              </Icon>
            </ClickAwayListener>
          </Hidden>
        </Grid>
      </Grid>
    </Grid>
  )
}
