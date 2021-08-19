function removeCart(proId,cartId){
    $.ajax({
        url:'/removeProduct/',
        data:{
            product:proId,
            cart:cartId
        },
        method:'post',
        success:(response)=>{
            location.reload();
        }
    })
}