import React, { useState } from 'react'
import { Fade, Grid, Typography } from '@material-ui/core'
import { WrappedSwaplineComponent } from '@containers/WrappedSwaplineComponent/WrappedSwaplineComponent'
import { useSelector } from 'react-redux'
import { swaplinePairs } from '@selectors/solanaWallet'
import useStyles from './style'
import { SwapInfo } from '@components/SwapInfo/SwapInfo'
import { printDecimal } from '@consts/utils'

export const SwaplinePage: React.FC = () => {
  const classes = useStyles()

  const pairs = useSelector(swaplinePairs)

  const [pairIndex, setPairIndex] = useState<number | null>(null)

  return (
    <Fade in={true} >
      <Grid container classes={{ root: classes.root }} className={classes.slide} justifyContent='center'>
        <Grid item className={classes.exchange}>
          <Typography className={classes.title}>Swapline</Typography>
          <Grid container direction='row' className={classes.row}>
            <WrappedSwaplineComponent
              pairs={pairs}
              onSelectPair={setPairIndex}
            />
            <Grid item className={classes.plotWrapper}>
              <SwapInfo
                syntheticName={pairs[pairIndex === null ? 0 : pairIndex].syntheticData.symbol}
                collateralName={pairs[pairIndex === null ? 0 : pairIndex].collateralData.symbol}
                fee={+printDecimal(pairs[pairIndex === null ? 0 : pairIndex].fee)}
                accumulatedFee={+printDecimal(pairs[pairIndex === null ? 0 : pairIndex].accumulatedFee)}
                balance={+printDecimal(pairs[pairIndex === null ? 0 : pairIndex].balance)}
                limit={+printDecimal(pairs[pairIndex === null ? 0 : pairIndex].limit)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fade>
  )
}
