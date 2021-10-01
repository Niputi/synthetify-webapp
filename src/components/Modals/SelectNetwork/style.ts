import { makeStyles, Theme } from '@material-ui/core/styles'
import { colors, typography } from '@static/theme'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: colors.navy.component,
    width: 300,
    borderRadius: 10,
    marginTop: 13,
    padding: 20,

    [theme.breakpoints.down('md')]: {
      marginTop: 24
    }
  },
  listItem: {
    color: colors.navy.grey,
    borderRadius: 10,
    paddingLeft: 16,
    padding: 10,
    minWidth: 220,
    margin: 3,
    cursor: 'pointer',

    '&:hover': {
      background: colors.navy.navButton,
      color: colors.navy.veryLightGrey,

      '& $name': {
        ...typography.subtitle1
      }
    }
  },
  name: {
    textTransform: 'capitalize',
    ...typography.subtitle2
  },
  network: {
    ...typography.caption1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  paper: {
    background: 'transparent',
    boxShadow: 'none'
  },
  icon: {
    width: 18,
    height: 18,
    display: 'inline',
    float: 'left',
    marginRight: 8,
    marginTop: 3
  }
}))

export default useStyles
