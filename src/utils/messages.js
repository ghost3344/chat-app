const generateMessage = (text,username,userid) => {
    return {
        id : userid,
        text,
        createdAt: new Date().getTime(),
        username
    }
}


const generatelocationMessage = (url,username,userid)=>{
    return {
        id : userid,
        url,
        createdAt: new Date().getTime(),
        username
            }
    }
   
   
module.exports = {
        generateMessage,
        generatelocationMessage
    }