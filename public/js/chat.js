const socket = io()

//Elements
const msgform = document.querySelector('form')
const msginput = document.querySelector('input')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')
const sendlocationbutton = document.querySelector('#sendlocation')
const { Username, Room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// templates
const msg_template = document.querySelector('#msg_template').innerHTML
const locationmsg_template = document.querySelector('#locationlink_template').innerHTML
const sidebar_template = document.querySelector('#sidebar_template').innerHTML


const autoscroll = ()=>{
// New message element
    const $newMessage = messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = messages.offsetHeight

    // Height of messages container
    const containerHeight = messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }

}

socket.emit('join',Username,Room,(acknoledgement)=>{
    if(acknoledgement)
    {
        alert(acknoledgement)
        location.href = '/'  //redirect to root of the site(index.html page)
    }
})


msgform.addEventListener('submit',(e)=>{
    e.preventDefault()
    msgform.setAttribute('disabled','disabled')
    const message =e.target.elements.msgtosend.value 
    
    socket.emit('sendmsgtoserver',message,(acknoledgement)=>{
        if(acknoledgement === "bad words are not allowed")
        {
            alert('bad words are not allowed')
        }
        msgform.removeAttribute('disabled')
        msginput.value=''
        msginput.focus()
    }) 
})

socket.on('sendmsgtoclients',(msg)=>{
    const receivedby = socket.id
    if(msg.id === receivedby){
            const html = Mustache.render(msg_template,{
            username : 'Me',
            message: msg.text,
            createdAt: moment(msg.createdAt).format('h:mm a')
            })
            messages.insertAdjacentHTML('beforeend',html)
    }
    else{
        const html = Mustache.render(msg_template,{
            username1 : msg.username,
            message1: msg.text,
            createdAt1: moment(msg.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    }
    
    
    autoscroll()
})

socket.on('sendtoclients1',(msg)=>{
    const receivedby = socket.id
    if(msg.id === receivedby){
        const html = Mustache.render(msg_template,{
            username : 'Me',
            message: msg.text,
            createdAt: moment(msg.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    }
    else{
        const html = Mustache.render(msg_template,{
            username1 : msg.username,
            message1: msg.text,
            createdAt1: moment(msg.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    }
    autoscroll()
})

socket.on('message',(welcomemessage)=>{
    const receivedby = socket.id
    if(welcomemessage.id === receivedby){
        const html = Mustache.render(msg_template,{
            username : welcomemessage.username,
            message: welcomemessage.text,
            createdAt: moment(welcomemessage.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    }
    else{
        const html = Mustache.render(msg_template,{
            username1 : welcomemessage.username,
            message1: welcomemessage.text,
            createdAt1: moment(welcomemessage.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    }
    
    
    
    
})
sendlocationbutton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser')
    }
    sendlocationbutton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        socket.emit('sendlocation',lat,lon)
    })  
    sendlocationbutton.removeAttribute('disabled')
})

socket.on('sendlocationtoclients',(urlobject)=>{
    const receivedby = socket.id
    if(receivedby === urlobject.id)
    {
        const html = Mustache.render(locationmsg_template,{
            Location: "My current Location",
            url: urlobject.url,
            username : 'Me',
            createdAt: moment(urlobject.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    }
    else{
        const html = Mustache.render(locationmsg_template,{
            Location1: "My current Location",
            url1: urlobject.url,
            username1 : urlobject.username,
            createdAt1: moment(urlobject.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    }
    autoscroll()      
})

socket.on('roomdata',({room,userslist})=>{
    
    const html = Mustache.render(sidebar_template,{
        room,
        users : userslist,
    })
    sidebar.innerHTML = html
    
})


