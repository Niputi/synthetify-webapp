import { makeStyles } from '@material-ui/core/styles'
import { colors } from '@static/theme'

const useStyles = makeStyles(() => ({
  amountInput: {
    background: colors.gray.mid,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 16,
    lineHeight: '40px',
    fontSize: 22,
    color: colors.gray.veryLight,
    fontWeight: 700
  }
}))

export default useStyles
