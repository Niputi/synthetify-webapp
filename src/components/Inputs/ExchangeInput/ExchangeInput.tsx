import { Input } from '@material-ui/core'
import React from 'react'
import useStyles from './style'

interface IProps {
  setValue: (value: string) => void
  error?: string | null
}

export const ExchangeInput: React.FC<IProps> = ({ setValue, error }) => {
  const classes = useStyles()
  return (
    <Input
      error={!!error}
      className={classes.amountInput}
      placeholder='0.0000'
      color='primary'
      type='number'
      disableUnderline={true}
      onChange={e => {
        setValue(e.target.value)
      }}
    />
  )
}
export default ExchangeInput
