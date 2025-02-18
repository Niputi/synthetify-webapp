import { Divider, Input, InputAdornment, Typography } from '@material-ui/core'
import React, { CSSProperties, useState, useRef } from 'react'
import classNames from 'classnames'
import SelectTokenModal from '@components/Modals/SelectModals/SelectTokenModal/SelectTokenModal'
import { BN } from '@project-serum/anchor'
import { blurContent, unblurContent } from '@consts/uiUtils'
import icons from '@static/icons'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import useStyles from './style'

interface IProps {
  setValue: (value: string) => void
  currency: string | null
  value?: string
  error?: string | null
  className?: string
  placeholder?: string
  style?: CSSProperties
  tokens?: Array<{ symbol: string, balance?: BN, decimals?: number }>
  onSelectToken?: (chosen: number) => void
  showArrow?: boolean
  walletConnected?: boolean
  noWalletHandler?: () => void
  emptyTokensHandler?: () => void
}

export const AmountInput: React.FC<IProps> = ({
  currency,
  value,
  setValue,
  error,
  className,
  placeholder,
  style,
  tokens,
  onSelectToken,
  showArrow,
  walletConnected,
  noWalletHandler,
  emptyTokensHandler
}) => {
  const classes = useStyles({ onSelectToken })

  const [open, setOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const allowOnlyDigitsAndTrimUnnecessaryZeros: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const regex = /^\d*\.?\d*$/
    if (e.target.value === '' || e.target.value === 'Max' || regex.test(e.target.value)) {
      const startValue = e.target.value
      const caretPosition = e.target.selectionStart

      let parsed = e.target.value
      const zerosRegex = /^0+\d+\.?\d*$/
      if (zerosRegex.test(parsed)) {
        parsed = parsed.replace(/^0+/, '')
      }

      const dotRegex = /^\.\d*$/
      if (dotRegex.test(parsed)) {
        parsed = `0${parsed}`
      }

      const diff = startValue.length - parsed.length

      setValue(parsed)
      if (caretPosition !== null && parsed !== startValue) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = Math.max(caretPosition - diff, 0)
            inputRef.current.selectionEnd = Math.max(caretPosition - diff, 0)
          }
        }, 0)
      }
    } else if (!regex.test(e.target.value)) {
      setValue('')
    }
  }

  const currencyAdornment = (
    <InputAdornment
      position='end'
      className={classNames(classes.currency, classes.select)}
      onClick={() => {
        if (!walletConnected && noWalletHandler) {
          noWalletHandler()
          return
        }

        if (!!walletConnected && !tokens?.length && emptyTokensHandler) {
          emptyTokensHandler()
          return
        }

        if (tokens?.length && onSelectToken) {
          blurContent()
          setOpen(true)
        }
      }}
    >
      <Divider orientation='vertical' className={classes.divider} />
      <img alt='' src={icons[currency ?? 'SNY']} className={classes.avatarIcon}/>
      <Typography className={classes.currencyText}>{currency}</Typography>
      {(showArrow) ? <ExpandMoreIcon style={{ marginRight: -5 }} /> : null}
    </InputAdornment>
  )

  return (
    <>
      <Input
        inputRef={inputRef}
        error={!!error}
        className={classNames(classes.amountInput, className)}
        classes={{
          input: classes.input
        }}
        style={style}
        type={'text'}
        value={value}
        disableUnderline={true}
        placeholder={placeholder}
        endAdornment={!currency ? null : currencyAdornment}
        onChange={allowOnlyDigitsAndTrimUnnecessaryZeros}
      />
      {(tokens?.length && onSelectToken)
        ? (
          <SelectTokenModal
            tokens={tokens}
            open={open}
            centered={true}
            anchorEl={null}
            onSelect={onSelectToken}
            handleClose={() => {
              unblurContent()
              setOpen(false)
            }}
          />
        )
        : null
      }
    </>
  )
}
export default AmountInput
