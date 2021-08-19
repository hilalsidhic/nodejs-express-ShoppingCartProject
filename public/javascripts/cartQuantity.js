    function changeCart(proId,cartId,count){
        let quantity = parseInt(document.getElementById(proId).innerHTML)
        $.ajax({
            url:'/changeProductQuantity',
            data:{
                cart:cartId,
                product:proId,
                count:count,
                quantity:quantity
            },
            method:'post',
            success:(response)=>{
                if(response.removeProduct){
                    alert("product Removed from the cart")
                    location.reload();
                }
                else{
                    document.getElementById(proId).innerHTML=quantity+parseInt(count)
                }
                
            }

        })
    }
    

