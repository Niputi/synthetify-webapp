import { Input, InputAdornment } from '@material-ui/core'
import React from 'react'
import useStyles from './style'

interface IProps {
  setValue: (value: string) => void
  currency: string
  value?: string
  error?: string | null
}

export const AmountInputExchange: React.FC<IProps> = ({ setValue, currency, value, error }) => {
  const classes = useStyles()
  return (
    <Input
      error={!!error}
      className={classes.amountInput}
      color='primary'
      type={'text'}
      value={value}
      disableUnderline={true}
      onChange={e => {
        setValue(e.target.value)
        value = e.target.value
      }}
    />
  )
}
export default AmountInputExchange
