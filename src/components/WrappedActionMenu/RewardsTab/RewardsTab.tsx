import React from 'react'
import { Divider, Grid } from '@material-ui/core'
import { divUpNumber, transformBN } from '@consts/utils'
import { RewardsLine } from '@components/WrappedActionMenu/RewardsTab/RewardsLine/RewardsLine'
import { OutlinedButton } from '@components/OutlinedButton/OutlinedButton'
import { RewardsAmount } from '@components/WrappedActionMenu/RewardsTab/RewardsAmount/RewardsAmount'
import BN from 'bn.js'
import useStyles from './style'
import Rewards1 from '@static/svg/rewards1.svg'
import Rewards2 from '@static/svg/rewards2.svg'
import Rewards3 from '@static/svg/rewards3.svg'
import { Decimal } from '@synthetify/sdk/lib/exchange'
import { Placement } from '@components/MobileTooltip/MobileTooltip'

export type RoundType = 'next' | 'current' | 'finished'

export type RoundData = {
  [type in RoundType]: {
    roundPoints: BN
    roundAllPoints: BN
    roundStartSlot: BN
    roundAmount: Decimal
  }
}

export interface IRewardsProps {
  slot: number
  amountToClaim: Decimal
  roundLength: number
  stakedUserValue: BN,
  SNYPrice: Decimal,
  userDebtShares: BN
  rounds: RoundData
  onClaim: () => void
  onWithdraw: () => void
}

export const RewardsTab: React.FC<IRewardsProps> = ({
  slot = 0,
  amountToClaim,
  roundLength,
  stakedUserValue,
  SNYPrice,
  userDebtShares,
  rounds,
  onClaim,
  onWithdraw
}) => {
  const classes = useStyles()

  const estimateRounds = (): RoundData => {
    const { current, next } = rounds

    if (next.roundStartSlot.toNumber() >= slot) {
      return rounds
    }
    const slotDiff = slot - next.roundStartSlot.toNumber()
    const roundDiff = divUpNumber(slotDiff, roundLength)

    switch (roundDiff) {
      case 1: {
        return {
          finished: current,
          current: next,
          next: {
            roundStartSlot: next.roundStartSlot.add(new BN(roundLength)),
            roundAllPoints: next.roundAllPoints,
            roundPoints: userDebtShares,
            roundAmount: next.roundAmount
          }
        }
      }
      case 2: {
        return {
          finished: next,
          current: {
            roundStartSlot: next.roundStartSlot.add(new BN(roundLength)),
            roundAllPoints: next.roundAllPoints,
            roundPoints: userDebtShares,
            roundAmount: next.roundAmount
          },
          next: {
            roundStartSlot: next.roundStartSlot.add(new BN(roundLength).mul(new BN(2))),
            roundAllPoints: next.roundAllPoints,
            roundPoints: userDebtShares,
            roundAmount: next.roundAmount
          }
        }
      }
      default: {
        return {
          finished: {
            roundStartSlot: next.roundStartSlot.add(new BN(roundLength).mul(new BN(roundDiff - 2))),
            roundAllPoints: next.roundAllPoints,
            roundPoints: userDebtShares,
            roundAmount: next.roundAmount
          },
          current: {
            roundStartSlot: next.roundStartSlot.add(new BN(roundLength).mul(new BN(roundDiff - 1))),
            roundAllPoints: next.roundAllPoints,
            roundPoints: userDebtShares,
            roundAmount: next.roundAmount
          },
          next: {
            roundStartSlot: next.roundStartSlot.add(new BN(roundLength).mul(new BN(roundDiff))),
            roundAllPoints: next.roundAllPoints,
            roundPoints: userDebtShares,
            roundAmount: next.roundAmount
          }
        }
      }
    }
  }

  const { finished, current, next } = estimateRounds()
  const {
    roundAllPoints: finishedRoundAllPoints,
    roundPoints: finishedRoundPoints,
    roundAmount: finishedRoundAmount
  } = finished
  const {
    roundAllPoints: currentRoundAllPoints,
    roundPoints: currentRoundPoints,
    roundStartSlot: currentRoundStartSlot,
    roundAmount: currentRoundAmount
  } = current
  const {
    roundAllPoints: nextRoundAllPoints,
    roundPoints: nextRoundPoints,
    roundStartSlot: nextRoundStartSlot,
    roundAmount: nextRoundAmount
  } = next

  const isClaimDisabled = () => {
    const noPoints = finishedRoundPoints.eqn(0)
    const finishedRoundOver = currentRoundStartSlot.gtn(slot)

    return noPoints || !finishedRoundOver
  }

  const isWithdrawDisabled = () => {
    return amountToClaim.val.eq(new BN(0))
  }

  const calculateTokensBasedOnPoints = (roundPoints?: BN, allPoints?: BN, amount?: Decimal) => {
    if (!roundPoints || !allPoints || allPoints.eqn(0) || !amount) {
      return new BN(0)
    }
    return roundPoints.mul(amount.val).div(allPoints)
  }

  const APRNext: BN =
  !stakedUserValue.eq(new BN(0))
    ? (calculateTokensBasedOnPoints(
      nextRoundPoints,
      nextRoundAllPoints,
      nextRoundAmount
    ).mul(SNYPrice.val).mul(new BN(52))).div(stakedUserValue) : new BN(0)
  console.log(transformBN(APRNext))
  const APYNext = !stakedUserValue.eq(new BN(0))
    ? new BN(Math.pow((+transformBN(APRNext) / 100 / 52) + 1, 52) * 100)
    : new BN(0)
  const APRCurrent: BN =
    !stakedUserValue.eq(new BN(0))
      ? (calculateTokensBasedOnPoints(
        currentRoundPoints,
        currentRoundAllPoints,
        currentRoundAmount
      ).mul(SNYPrice.val).mul(new BN(52))).div(stakedUserValue) : new BN(0)

  const APYCurrent: BN = !stakedUserValue.eq(new BN(0))
    ? new BN(Math.pow((+transformBN(APRCurrent) / 100 / 52) + 1, 52) * 100)
    : new BN(0)

  const APRFinished: BN =
  !stakedUserValue.eq(new BN(0))
    ? (calculateTokensBasedOnPoints(
      finishedRoundPoints,
      finishedRoundAllPoints,
      finishedRoundAmount
    ).mul(SNYPrice.val).mul(new BN(52))).div(stakedUserValue) : new BN(0)

  const APYFinished: BN = !stakedUserValue.eq(new BN(0))
    ? new BN(Math.pow((+transformBN(APRFinished) / 100 / 52) + 1, 52) * 100)
    : new BN(0)
  const rewardsLines: {
    [index: number]: {
      name: string
      bracket?: string
      bracketValue?: BN
      nonBracket: string
      nonBracketValue: BN
      hint: string
      timeRemainingEndSlot: BN
      icon: string
      tooltipPlacement: Placement
    }
  } = [
    {
      name: 'Subscription round',
      nonBracket: 'SNY',
      nonBracketValue: calculateTokensBasedOnPoints(
        nextRoundPoints,
        nextRoundAllPoints,
        nextRoundAmount
      ),
      bracketValue: APYNext,
      bracket: nextRoundPoints.eqn(0) ? '' : '%',
      hint:
        'This round is in the Subscription phase. You will receive or lose points proportionally to the value of your debt when you mint or burn your xUSD.',
      timeRemainingEndSlot: nextRoundStartSlot,
      icon: Rewards1,
      tooltipPlacement: 'left-end'
    },
    {
      name: 'Staking round',
      nonBracketValue: calculateTokensBasedOnPoints(
        currentRoundPoints,
        currentRoundAllPoints,
        currentRoundAmount
      ),
      nonBracket: 'SNY',
      bracketValue: APYCurrent,
      bracket: currentRoundPoints.eqn(0) ? '' : '%',
      hint:
        'This round is in the Staking phase. You entered this round with points from the previous phase. You will lose points when you burn your xUSD.',
      timeRemainingEndSlot: nextRoundStartSlot,
      icon: Rewards2,
      tooltipPlacement: 'left'
    },
    {
      name: 'Claiming round',
      nonBracketValue: calculateTokensBasedOnPoints(
        finishedRoundPoints,
        finishedRoundAllPoints,
        finishedRoundAmount
      ),
      nonBracket: 'SNY',
      bracketValue: APYFinished,
      bracket: finishedRoundPoints.eqn(0) ? '' : '%',
      hint:
        'This round is in the Claiming phase. You entered this round with points from the previous phase. You can now Claim your reward proportional to the number of points in SNY tokens.',
      timeRemainingEndSlot: nextRoundStartSlot,
      icon: Rewards3,
      tooltipPlacement: 'left-start'
    }
  ]

  const lines = Object.keys(rewardsLines).map((key, index) => {
    const props = rewardsLines[+key]
    return (
      <Grid item key={index} className={classes.line}>
        <RewardsLine {...props} slot={slot} />
        <Divider className={classes.divider} />
      </Grid>
    )
  })

  return (
    <Grid container direction='column' justifyContent='space-around'>
      <Grid item className={classes.amount}>
        <RewardsAmount amountToClaim={amountToClaim} />
      </Grid>
      <Grid item container justifyContent='space-between' direction='column'>
        {lines}
      </Grid>
      <Grid
        item
        container
        alignItems='center'
        justifyContent='flex-end'
        wrap='nowrap'
        className={classes.buttonsWrapper}>
        <Grid item>
          <OutlinedButton
            color='secondary'
            name='Claim'
            disabled={isClaimDisabled()}
            className={classes.button}
            onClick={onClaim}
            labelClassName={classes.label}
          />
        </Grid>
        <Grid item style={{ marginLeft: 18 }}>
          <OutlinedButton
            color='primary'
            name='Withdraw'
            disabled={isWithdrawDisabled()}
            className={classes.button}
            onClick={onWithdraw}
            labelClassName={classes.label}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RewardsTab
