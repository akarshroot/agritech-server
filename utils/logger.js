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

module.exports={
    info,
    err,
    warn
}