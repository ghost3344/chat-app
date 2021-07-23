const users = []

const addUser = (id,username,room)=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
    if(!username || !room)
    {
        return {error: "Username and room required"}
    }

    //check for existing user
    const existing = users.find((user)=>{
        return user.username === username && user.room === room
    })
    console.log(existing)
    //validate username
    if(existing)
    {
        return {error: "Username is already in use"}
    }
    else{
        const user = {id, username ,room}
        users.push(user)
        console.log('users' ,users)
        return {user}
    }
    
}


const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index !== -1)
    {
        const removeduser = users.splice(index,1)[0]   // 1 item and [0] because it will return object array for deleted items
        return removeduser
    }

}

const getUser = (id)=>{
    const user = users.find((user)=>{
        return user.id === id
    })
        
    return user
   
}

const getUsers = (room)=>{
    const users1 = users.filter((user)=>{
        return user.room === room
    })
    return users1
    
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsers
}
