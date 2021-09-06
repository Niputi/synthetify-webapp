import { makeStyles, Theme } from '@material-ui/core/styles'
import { colors } from '@static/theme'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: colors.navy.component,
    width: 855,
    height: 333,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      height: 327,
      width: 855
    },
    [theme.breakpoints.down('xs')]: {
      width: 413,
      height: 500
    }
  },

  statsWrapper: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',

    [theme.breakpoints.down('xs')]: {
      height: 'calc(100% - 50px)',
      justifyContent: 'center',
      marginLeft: '10%'
    }
  },
  headerWrapper: {
    alignSelf: 'flex-start',
    position: 'relative',
    left: 24,
    top: 12,
    height: 80,
    width: 'calc(100% - 26px)',
    [theme.breakpoints.down('xs')]: {
      top: 4
    }
  },
  title: {
    fontSize: '22px',
    lineHeight: '40px',
    fontWeight: 600,
    color: colors.navy.veryLightGrey,
    position: 'relative'
  },
  subTitle: {
    fontSize: 16,
    lineHeight: '40px',
    fontWeight: 400,
    color: colors.navy.info,
    position: 'relative',
    width: 'calc(100% - 16px)',
    top: -8,
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
      lineHeight: '20px'
    }
  },

  chartWrapper: {
    width: 'calc(100% - 13.8px)',
    height: 85,
    backgroundColor: colors.navy.background,
    borderRadius: 10,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 8.06px)',
      height: 'calc(100% - 8px)'
    },
    [theme.breakpoints.down('xs')]: {
      width: 95,
      height: 'calc(100% - 10px)'
    },

    '& text': {
      fontWeight: 700,
      fontSize: 15
    }
  },

  border: {
    width: 'calc(100% - 48px)',
    height: 103,
    backgroundColor: colors.navy.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
    top: 12,
    [theme.breakpoints.down('sm')]: {
      height: 84,
      width: 'calc(100% - 32px)'
    },
    [theme.breakpoints.down('xs')]: {
      height: 404,
      width: 103,
      top: -4,
      left: '11%'
    }
  },
  legendWrapper: {
    height: 120,
    margin: 0,
    top: 20,
    fontSize: 18,
    position: 'relative',
    width: 'calc(100% - 20px)',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {

    },
    [theme.breakpoints.down('xs')]: {
      height: '100%',
      top: 0,
      right: 68,
      alignItems: 'flex-start'
    }
  },
  legendList: {
    margin: 0,
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      width: '55%',
      left: 120,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    }
  },

  legendItem: {
    marginBottom: -5,
    marginRight: 25,
    fontSize: 18,
    lineHeight: '40px',
    fontFamily: 'Inter',
    [theme.breakpoints.down('sm')]: {
      fontSize: 15
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: -3,
      fontSize: 16
    }
  }

}))

export default useStyles
