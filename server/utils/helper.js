const jsonGenerate=(statusCode,message,data=null)=>{
    return {
        status:statusCode,
        message:message,
        data:data
    }
}

export default jsonGenerate;