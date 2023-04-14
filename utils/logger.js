require("dotenv").config()
// const logging = process.env.NODE_ENV!=='production'
const logging = true
const seprator= "-------------------------------------------------------------------"
const spacer= `
`

function info(...all){
    if(logging){
        console.log(spacer)
        console.log(...all)
        console.log(seprator)
    }
    return
}
function err(...all){
    if(logging){
        console.log(spacer)
        console.error(...all)
        console.log(seprator)
    }
    return
}
function warn(...all){
    if(logging){
        console.log(spacer)
        console.warn(...all)
        console.log(seprator)
    }
    return
}

info("Enviroment mode:",process.env.NODE_ENV)

module.exports={
    info,
    err,
    warn
}