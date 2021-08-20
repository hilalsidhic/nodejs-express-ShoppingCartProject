function getTotalPrice(){
    $.ajax({
    url:'/cartTotal',
    method:'get',
    success:(response)=>{
        document.getElementById('totalprice').innerHTML=response
    }
})
}