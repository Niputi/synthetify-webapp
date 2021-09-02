import React, { useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { ExchangeTokensWithBalance } from '@selectors/solanaWallet'
import { BN } from '@project-serum/anchor'
import { printBNtoBN, printBN } from '@consts/utils'
import { Decimal } from '@synthetify/sdk/lib/exchange'
import { CardMedia, Divider, Grid, Typography, useMediaQuery } from '@material-ui/core'
import Swap from '@static/svg/swap.svg'
import Arrows from '@static/svg/swapArrows.svg'
import { OutlinedButton } from '@components/OutlinedButton/OutlinedButton'
import AnimatedNumber from '@components/AnimatedNumber'
import MobileTooltip from '@components/MobileTooltip/MobileTooltip'
import Output from '@static/svg/output.svg'
import ExclamationMark from '@static/svg/exclamationMark.svg'
import RedExclamationMark from '@static/svg/redExclamationMark.svg'
import { docs, pyth } from '@static/links'
import { colors, theme } from '@static/theme'
import QuestionMark from '@static/svg/questionMark.svg'
import Fee from '@static/svg/fee.svg'
import SelectToken from '@components/Inputs/SelectToken/SelectToken'
import AmountWithMaxInput from '@components/Inputs/AmountWithMaxInput/AmountWithMaxInput'
import useStyles from './style'

export const calculateSwapOutAmount = (
  assetIn: ExchangeTokensWithBalance,
  assetFor: ExchangeTokensWithBalance,
  amount: string,
  effectiveFee: Decimal
) => {
  const amountOutBeforeFee = assetIn.price.val
    .mul(printBNtoBN(amount, assetIn.supply.scale))
    .div(assetFor.price.val)

  const amountAfterFee = amountOutBeforeFee.sub(
    amountOutBeforeFee.mul(effectiveFee.val).div(new BN(10 ** effectiveFee.scale))
  )
  const decimalChange = 10 ** (assetFor.supply.scale - assetIn.supply.scale)

  if (decimalChange < 1) {
    return printBN(amountAfterFee.div(new BN(1 / decimalChange)), assetFor.supply.scale)
  } else {
    return printBN(amountAfterFee.mul(new BN(decimalChange)), assetFor.supply.scale)
  }
}

export const calculateSwapOutAmountReversed = (
  assetIn: ExchangeTokensWithBalance,
  assetFor: ExchangeTokensWithBalance,
  amount: string,
  effectiveFee: Decimal
) => {
  const amountAfterFee = printBNtoBN(amount, assetFor.supply.scale).add(
    printBNtoBN(amount, assetFor.supply.scale).mul(effectiveFee.val).div(new BN(10 ** effectiveFee.scale))
  )
  const amountOutBeforeFee = assetFor.price.val.mul(amountAfterFee).div(assetIn.price.val)

  const decimalChange = 10 ** (assetFor.supply.scale - assetIn.supply.scale)

  if (decimalChange < 1) {
    return printBN(amountOutBeforeFee.mul(new BN(1 / decimalChange)), assetIn.supply.scale)
  } else {
    return printBN(amountOutBeforeFee.div(new BN(decimalChange)), assetIn.supply.scale)
  }
}

export interface IExchangeComponent {
  tokens: ExchangeTokensWithBalance[]
  onSwap: (fromToken: PublicKey, toToken: PublicKey, amount: BN) => void
  fee: Decimal
  discountPercent?: number
  nextDiscountThreshold?: number
  onSelectTokenTo: (index: number | null) => void
}
export const ExchangeComponent: React.FC<IExchangeComponent> = ({
  tokens,
  onSwap,
  fee,
  discountPercent,
  nextDiscountThreshold,
  onSelectTokenTo
}) => {
  const classes = useStyles()

  const isXs = useMediaQuery(theme.breakpoints.down('xs'))

  const [tokenFromIndex, setTokenFromIndex] = React.useState<number | null>(tokens.length ? 0 : null)
  const [tokenToIndex, setTokenToIndex] = React.useState<number | null>(null)
  const [amountFrom, setAmountFrom] = React.useState<string>('')
  const [amountTo, setAmountTo] = React.useState<string>('')

  const [rotates, setRotates] = React.useState<number>(0)

  useEffect(() => {
    updateEstimatedAmount()

    if (tokenFromIndex !== null && tokenToIndex === null) {
      setAmountFrom('0.000000')
    }
  }, [tokenToIndex, tokenFromIndex])

  const updateEstimatedAmount = (amount: string | null = null) => {
    if (tokenFromIndex !== null && tokenToIndex !== null) {
      setAmountTo(calculateSwapOutAmount(tokens[tokenFromIndex], tokens[tokenToIndex], amount ?? amountFrom, fee))
    }
  }
  const updateFromEstimatedAmount = (amount: string | null = null) => {
    if (tokenFromIndex !== null && tokenToIndex !== null) {
      setAmountFrom(calculateSwapOutAmountReversed(tokens[tokenFromIndex], tokens[tokenToIndex], amount ?? amountFrom, fee))
    }
  }

  const formatNumbers = (value: string) => {
    const num = Number(value)

    if (num < 10) {
      return num.toFixed(4)
    }

    if (num < 1000) {
      return num.toFixed(2)
    }

    if (num < 10000) {
      return num.toFixed(1)
    }

    if (num < 1000000) {
      return (num / 1000).toFixed(2)
    }

    return (num / 1000000).toFixed(2)
  }

  const formatExchangeRateOnXs = (value: string) => {
    const num = Number(value)

    if (num < 100) {
      return num.toFixed(6)
    }

    if (num < 10000) {
      return num.toFixed(4)
    }

    if (num < 100000) {
      return num.toFixed(2)
    }

    return (num).toFixed(1)
  }

  const getButtonMessage = (
    amountFrom: string,
    tokenFrom: ExchangeTokensWithBalance | null,
    amountTo: string,
    tokenTo: ExchangeTokensWithBalance | null
  ) => {
    if (!tokenFrom) return 'Select input token'
    if (!tokenTo) {
      return 'Select output token'
    }
    if (tokenFrom.symbol === tokenTo.symbol) {
      return 'Choose another token'
    }
    if (amountTo.match(/^0\.0*$/)) {
      return 'Enter value of swap'
    }
    if (amountTo.match(`^\\d+\\.\\d{${tokenTo.supply.scale + 1},}$`)) {
      return 'Incorrect output token amount'
    }
    if (printBNtoBN(amountFrom, tokenFrom.supply.scale).gt(tokenFrom.balance)) {
      return 'Invalid swap amount'
    }
    if (tokenToIndex !== null && printBNtoBN(amountTo, tokenTo.supply.scale).gt(tokenTo.maxSupply.val.sub(tokenTo.supply.val))) {
      return (
        <>
          Max supply reached
          <MobileTooltip
            hint={(
              <>
                <img src={ExclamationMark} alt='' className={classes.circleIcon} />
                <Typography className={classes.tooltipTitle} style={{ marginBottom: 10 }}>Max supply</Typography>
                Your amount exceeded current supply of token. Available to trade:
                <b style={{ wordWrap: 'break-word' }}>{` ${printBN(tokens[tokenToIndex].maxSupply.val.sub(tokens[tokenToIndex].supply.val), tokens[tokenToIndex].supply.scale)} ${tokens[tokenToIndex].symbol}`}</b>
              </>
            )}
            anchor={<img src={RedExclamationMark} alt='' className={classes.exclamationMark} style={{ marginLeft: 16 }} />}
            tooltipClasses={{ tooltip: classes.supplyTooltip }}
            mobilePlacement='top-end'
            desktopPlacement='top-end'
          />
        </>
      )
    }
    return 'Swap'
  }

  return (
    <Grid container className={classes.root} direction='column'>
      <Grid item container direction='column' className={classes.tokenComponent}>
        <Grid item container wrap='nowrap' justifyContent='space-between' alignItems='center' className={classes.tokenComponentInfo}>
          <Typography className={classes.tokenComponentText}>From</Typography>
          <Typography className={classes.tokenMaxText}>
            {tokenFromIndex !== null
              ? (
                <>
                  Balance:{' '}
                  <AnimatedNumber
                    value={printBN(tokens[tokenFromIndex].balance, tokens[tokenFromIndex].supply.scale)}
                    duration={300}
                    formatValue={formatNumbers}
                  />
                  {+printBN(tokens[tokenFromIndex].balance, tokens[tokenFromIndex].supply.scale) >= 10000
                    ? 'K'
                    : (+printBN(tokens[tokenFromIndex].balance, tokens[tokenFromIndex].supply.scale) >= 1000000 ? 'M' : '')
                  }
                  {` ${tokens[tokenFromIndex].symbol}`}
                </>
              )
              : ''}
          </Typography>
        </Grid>

        <Grid item container wrap='nowrap' alignItems='center'>
          <SelectToken
            tokens={tokens.map(({ symbol, balance, supply }) => ({ symbol, balance, decimals: supply.scale }))}
            current={tokenFromIndex !== null ? tokens[tokenFromIndex].symbol : null}
            centered={true}
            onSelect={(chosen: string) =>
              setTokenFromIndex(tokens.findIndex(t => t.symbol === chosen) ?? null)
            }
          />

          <AmountWithMaxInput
            value={amountFrom}
            setValue={value => {
              if (value.match(/^\d*\.?\d*$/)) {
                setAmountFrom(value)
                updateEstimatedAmount(value)
              }
            }}
            placeholder={'0.0'}
            className={classes.input}
            onMaxClick={() => {
              if (tokenFromIndex !== null) {
                setAmountFrom(printBN(tokens[tokenFromIndex].balance, tokens[tokenFromIndex].supply.scale))
                updateEstimatedAmount(printBN(tokens[tokenFromIndex].balance, tokens[tokenFromIndex].supply.scale))
              }
            }}
          />
        </Grid>
      </Grid>

      <Grid item container direction='row' justifyContent='center'>
        <div
          className={classes.swapIconSquare}
          onClick={() => {
            setRotates(rotates + 1)
            if (tokenToIndex === null || tokenFromIndex === null) return
            setTokenFromIndex(tokenToIndex)
            onSelectTokenTo(tokenFromIndex)
            setTokenToIndex(tokenFromIndex)
          }}
        >
          <CardMedia className={classes.swapIcon} image={Swap} component='img' style={{ transform: `rotate(${rotates * 180}deg)` }} />
        </div>
      </Grid>

      <Grid item container direction='column' className={classes.tokenComponent}>
        <Grid item container wrap='nowrap' justifyContent='space-between' alignItems='center' className={classes.tokenComponentInfo}>
          <Grid item container wrap='nowrap' justifyContent='space-between' alignItems='center' className={classes.toText}>
            <Typography className={classes.tokenComponentText}>To (Estimate)</Typography>
            <MobileTooltip
              hint={(
                <>
                  <img src={Output} alt='' className={classes.outputIcon} />
                  <Typography className={classes.tooltipTitle}>Estimated output amount</Typography>
                  <p style={{ marginBlock: 10 }}>Output amount is calculated based on the most up-to-date data from price oracles, so it can change due to the sub-second update intervals of the oracles.</p>
                  Find out more about oracles on <a href={pyth} className={classes.tooltipLink} target='_blank' rel='noopener noreferrer'>Pyth Network website.</a>
                </>
              )}
              anchor={<img src={ExclamationMark} alt='' className={classes.exclamationMark} />}
              mobilePlacement='top-end'
              desktopPlacement='top-end'
              isInteractive
            />
          </Grid>
          <Typography className={classes.tokenMaxText}>
            {tokenFromIndex !== null && tokenToIndex !== null
              ? (
                <>
                  Balance:{' '}
                  <AnimatedNumber
                    value={printBN(tokens[tokenToIndex].balance, tokens[tokenToIndex].supply.scale)}
                    duration={300}
                    formatValue={formatNumbers}
                  />
                  {+printBN(tokens[tokenToIndex].balance, tokens[tokenToIndex].supply.scale) >= 10000
                    ? 'K'
                    : (+printBN(tokens[tokenToIndex].balance, tokens[tokenToIndex].supply.scale) >= 1000000 ? 'M' : '')
                  }
                  {` ${tokens[tokenToIndex].symbol}`}
                </>
              )
              : ''}
          </Typography>
        </Grid>

        <Grid item container wrap='nowrap' alignItems='center'>
          <SelectToken
            tokens={tokens.map(({ symbol, balance, supply }) => ({ symbol, balance, decimals: supply.scale }))}
            current={tokenToIndex !== null ? tokens[tokenToIndex].symbol : null}
            centered={true}
            onSelect={(chosen: string) => {
              const index = tokens.findIndex(t => t.symbol === chosen) ?? null
              setTokenToIndex(index)
              onSelectTokenTo(index)
              setTimeout(() => updateEstimatedAmount(), 0)
            }}
          />

          <AmountWithMaxInput
            value={amountTo}
            setValue={value => {
              if (value.match(/^\d*\.?\d*$/)) {
                setAmountTo(value)
                updateFromEstimatedAmount(value)
              }
            }}
            placeholder={'0.0'}
            className={classes.input}
            onMaxClick={() => {
              if (tokenFromIndex !== null && tokenToIndex !== null) {
                setAmountFrom(printBN(tokens[tokenFromIndex].balance, tokens[tokenFromIndex].supply.scale))
                updateEstimatedAmount(printBN(tokens[tokenFromIndex].balance, tokens[tokenFromIndex].supply.scale))
              }
            }}
          />
        </Grid>
      </Grid>

      <Grid container item className={classes.numbersField}>
        <Grid item>
          <Grid container item justifyContent='space-between' alignItems='center'>
            <Typography className={classes.numbersFieldTitle}>Fee</Typography>
            <MobileTooltip
              hint={(
                <>
                  <img src={Fee} alt='' className={classes.circleIcon} />
                  <Typography className={classes.tooltipTitle}>Fee tiers</Typography>
                  <p style={{ marginBlock: 10 }}>
                    You can gain discounts on the swap fee by depositing SNY to Synthetify Exchange.
                    Your current discount on the fee is <b>{discountPercent ?? 0}%</b>.
                    {typeof nextDiscountThreshold !== 'undefined' && <> You can lower your fee by depositing <b>{+nextDiscountThreshold.toFixed(3)} SNY</b> more.</>}
                  </p>
                    Find out more about fee tiers in our <a href={docs} className={classes.tooltipLink} target='_blank' rel='noopener noreferrer'>documentation.</a>
                </>
              )}
              anchor={<img src={QuestionMark} alt='' className={classes.questionMark} />}
              mobilePlacement='top-start'
              desktopPlacement='top-end'
              isInteractive
            />
          </Grid>

          <Grid container item justifyContent='space-between' alignItems='center'>
            <Typography className={classes.numbersFieldAmount} style={{ marginRight: 12 }}>{+printBN(fee.val.mul(new BN(100)), fee.scale)}%</Typography>
            <Typography
              className={classes.discount}
              style={{
                color: !discountPercent
                  ? colors.navy.grey
                  : colors.green.main
              }}
            >
              ({discountPercent ?? 0}%)
            </Typography>
          </Grid>
        </Grid>

        <Divider className={classes.amountDivider} orientation='vertical' />

        <Grid item>
          <Grid container item alignItems='center'>
            <Typography className={classes.numbersFieldTitle}>Exchange rate</Typography>
            <Grid item className={classes.arrowsBg}>
              <CardMedia className={classes.arrowsIcon} image={Arrows} component='img' />
            </Grid>
          </Grid>
          <Typography className={classes.numbersFieldAmount}>
            <AnimatedNumber
              value={(() => {
                if (tokenFromIndex === null || tokenToIndex === null) return '0.0000'
                return calculateSwapOutAmount(tokens[tokenFromIndex], tokens[tokenToIndex], '1', fee)
              })()}
              duration={300}
              formatValue={
                isXs
                  ? formatExchangeRateOnXs
                  : (value: string) => Number(value).toFixed(6)
              }
            />
            {' '}{tokenToIndex === null ? '' : `${tokens[tokenToIndex].symbol} per `}{tokenFromIndex !== null ? tokens[tokenFromIndex].symbol : 'xUSD'}
          </Typography>
        </Grid>
      </Grid>

      <OutlinedButton
        name={getButtonMessage(amountFrom, tokenFromIndex !== null ? tokens[tokenFromIndex] : null, amountTo, tokenToIndex !== null ? tokens[tokenToIndex] : null)}
        color='secondary'
        disabled={getButtonMessage(amountFrom, tokenFromIndex !== null ? tokens[tokenFromIndex] : null, amountTo, tokenToIndex !== null ? tokens[tokenToIndex] : null) !== 'Swap'}
        className={classes.swapButton}
        onClick={() => {
          if (tokenFromIndex === null || tokenToIndex === null) return

          onSwap(
            tokens[tokenFromIndex].assetAddress,
            tokens[tokenToIndex].assetAddress,
            printBNtoBN(amountFrom, tokens[tokenFromIndex].supply.scale)
          )
        }}
      />
    </Grid>
  )
}
export default ExchangeComponent
