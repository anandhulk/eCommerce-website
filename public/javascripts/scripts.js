function updateQuant(proId, count, price) {
    const request = new XMLHttpRequest();
    request.open('PUT', '/cart', true);

    request.setRequestHeader('Content-Type','application/json')
    const data={
        id:proId,
        count:count,
        price:price
    }
    
    request.send(JSON.stringify(data));
    
    request.onload = function () {
        if (request.status === 200) {
            const data = JSON.parse(request.responseText);
            if(data.count<=1){
                document.getElementById('dec_'+proId).disabled=true;
            }else{
                document.getElementById('dec_'+proId).disabled=false;
            }
            document.getElementById(proId+'count').innerHTML = data.count;
            presentCount=data.count;
            document.getElementById(proId+'price').innerHTML = data.price;
            document.getElementById('subTotal').innerHTML = data.totalPrice;
            document.getElementById('totalPrice').innerHTML = data.totalPrice;

        } else {
            console.error('Request failed:', request.status);
        }
    };
}

function search(){
    let product=document.getElementById('searchbar').value;
    let xhr=new XMLHttpRequest()
    xhr.open('GET','/admin/search/'+product);
    xhr.send()
    xhr.onload=()=>{
        if(xhr.status===200){
            console.log('success')
        }
    }

}