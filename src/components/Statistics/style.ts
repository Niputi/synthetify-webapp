import { makeStyles, Theme } from '@material-ui/core/styles'
import { colors } from '@static/theme'
import { color } from '@storybook/addon-knobs'

const useStyles = makeStyles((theme:Theme) => ({
    reset:{
        padding:0,
        margin:0,
        boxSizing:"border-box"
    },
    GridContainer:{
        width:"77%",
        margin:"0 auto",
        [theme.breakpoints.down('md')]:{
            width:"89%"
        }
    },
    container:{
        width:"100%",
        margin:"0 auto"
    },
    root:{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        '&:last-child':{
            padding:"10.5px 16px",
            [theme.breakpoints.down('sm')]:{
                padding:"5.5px 8px"
            }
        }
    },
    Card:{
        background:colors.navy.component,
        borderRadius:10,
        width:"100%",
        '& *': {
            padding:0,
            margin:0
        },
        
    },
    CardContent:{
        padding:"10.5px 16px",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        
    },
    Header:{
        width:"100%",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
    },
    CardName:{
        fontSize:24,
        lineHeight:"40px",
        fontWeight:"bold",
        color:colors.navy.veryLightGrey,
        [theme.breakpoints.down('md')]:{
            fontSize:20,
        },
        [theme.breakpoints.down('sm')]:{
            fontSize:14,
            lineHeight:"24px"
        },
        [theme.breakpoints.down('xs')]:{
            fontSize:10,
        }
    },
    CardTime:{
        fontSize:22,
        lineHeight:"40px",
        fontWeight:"normal",
        color:colors.navy.info,
        [theme.breakpoints.down('md')]:{
            fontSize:20,
        },
        [theme.breakpoints.down('sm')]:{
            fontSize:12,
            lineHeight:"16px"
        },
        [theme.breakpoints.down('xs')]:{
            fontSize:8,
        }
    },
    CardValue:{
        color:colors.navy.button,
        fontSize:48,
        lineHeight:"40px",
        textAlign:"center",
        fontWeight:"bold",
        margin:"25.5px 0 18px 0",
        [theme.breakpoints.down('md')]:{
            margin:"16.5px 0 11px 0",
            fontSize:38,
            
        },
        [theme.breakpoints.down('sm')]:{
            fontSize:25,
            margin:"10.5px 0 10px 0",
            lineHeight:"28px"
        },
        [theme.breakpoints.down('xs')]:{
            fontSize:16,
            margin:"10.5px 0 10px 0",
            lineHeight:"12px"
        }
    },
    CardDesc:{
        color:colors.navy.info,
        fontSize:16,
        lineHeight:"22px",
        textAlign:"center",
        [theme.breakpoints.down('md')]:{
            fontSize:13,
            fontWeight:400,
            lineHeight:"24px"
        },
        [theme.breakpoints.down('sm')]:{
            fontSize:9,
            fontWeight:400,
            lineHeight:"12px"
        },
        [theme.breakpoints.down('xs')]:{
            fontSize:6,
            lineHeight:"6px"
        }
    }
}))

export default useStyles