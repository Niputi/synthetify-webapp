import { makeStyles, Theme } from '@material-ui/core/styles'
import { colors } from '@static/theme'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 200,
    [theme.breakpoints.down('sm')]: {
      minHeight: 320,
      flexWrap: 'wrap'
    }
  },
  available: {
    minWidth: 202,
    maxHeight: 60,
    overflow: 'hidden',
    '& *': {
      margin: 0
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 'unset',
      width: 'calc(100% - 111px)'
    }
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  secondHalf: {
    paddingTop: 22,
    maxWidth: 375,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 400,
      justifyContent: 'space-between',
      '& > *': {
        marginLeft: 5,
        marginRight: 5
      }
    }
  },
  amountInput: {
    maxWidth: 375
  },
  divider: {
    backgroundColor: colors.gray.light,
    height: 60
  },
  actionButton: {
    padding: '11px 40px',
    [theme.breakpoints.down('xs')]: {
      padding: '11px 15px'
    }
  },
  xsTextAlignCenter: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  xsItemCenter: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: 110,
      '& > *': {
        marginInline: 20
      }
    }
  }
}))

export default useStyles
