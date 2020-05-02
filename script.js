let cart = [];
let modalQt;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//LISTAGEM DAS PIZZAS
pizzaJson.map((item, index)=>{
   //console.log(item);

   

   //clona tudo q existe dentro de .models .pizza-item
   let pizzaItem = c('.models .pizza-item').cloneNode(true); 

   //Acrescenta o data-key na div para armazenar qual a pizza clicada 
   pizzaItem.setAttribute('data-key', index);
   
   //adiciona o nome
   pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

   //adiciona a descrição
   pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

   //adiciona o preço
   pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

   //adiciona a imagem
   pizzaItem.querySelector('.pizza-item--img img').src = item.img;

   //adiciona o evento de clique no link da pizza
   pizzaItem.querySelector('a').addEventListener('click', (e)=>{
      e.preventDefault();
      //alert('clicou na pizza '+item.name);
      
      //procura o elemento mais próximo da classe pizza-item
      let key = e.target.closest('.pizza-item').getAttribute('data-key'); 
      modalQt = 1;
      modalKey = key;
      
      //popula as informações
      c('.pizzaBig img').src = pizzaJson[key].img;
      c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
      c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
      c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

      //reseta a classe selected dos tamanhos e deixa ativa somente a padrão que é a grande
      c('.pizzaInfo--size.selected').classList.remove('selected');

      cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{    
        if(sizeIndex == 2){
           size.classList.add('selected');
        }    
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
      });

      c('.pizzaInfo--qt').innerHTML = modalQt;

      //efeito de opacidade
      c('.pizzaWindowArea').style.opacity = 0; 

      //abre o modal
      c('.pizzaWindowArea').style.display = 'flex';

      //efeito de opacidade
      setTimeout(()=>{
         c('.pizzaWindowArea').style.opacity = 1; 
      },200);
   });

   //preenche as informações pizza-item
   c('.pizza-area').append(pizzaItem);


});

//EVENTOS DO MODAL
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0; 
    setTimeout(()=>{
      c('.pizzaWindowArea').style.display = 'none';     
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
 item.addEventListener('click', closeModal);
});

//diminui -1
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
   if(modalQt > 1){
      modalQt--;
      c('.pizzaInfo--qt').innerHTML = modalQt;
   }
});

//acrescenta +1
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});



cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{    
   size.addEventListener('click',(e)=>{
      c('.pizzaInfo--size.selected').classList.remove('selected');
      size.classList.add('selected');
   });
 });

 c('.pizzaInfo--addButton').addEventListener('click', ()=>{
     //Qual a pizza
     console.log("Pizza: "+modalKey);
     //Qual tamanho
     let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
     console.log("Tamanho "+size);
     //Quantas pizzas
     console.log("Quantidade: "+modalQt);

     let identifier = pizzaJson[modalKey].id+'@'+size;

     let key = cart.findIndex((item)=>item.identifier == identifier);

     if(key > -1){
         cart[key].qt += modalQt;
     }else{
         cart.push({
               identifier,
               id: pizzaJson[modalKey].id,
               size,
               qt:modalQt
         });
     }
     updateCart();
     closeModal();
 });

 c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
       c('aside').style.left = '0';
    }
 });

  c('.menu-closer').addEventListener('click', ()=>{
      c('aside').style.left = '100vw';  
  });

 function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
       c('aside').classList.add('show');
       c('.cart').innerHTML = '';

       let subtotal = 0;
       let desconto = 0;
       let total = 0;


       for(let i in cart){
          let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
          subtotal += pizzaItem.price * cart[i].qt;
          let cartItem = c('.models .cart--item').cloneNode(true);
          let pizzaSizeName;
          switch(cart[i].size){
            case 0:
               pizzaSizeName = 'P';
               break;
            case 1:
               pizzaSizeName = 'M';
               break;
            case 2:
                  pizzaSizeName = 'G';
                  break;
          }

          let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
          
          cartItem.querySelector('img').src = pizzaItem.img;
          cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
          cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
          cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
            if(cart[i].qt > 1){
               cart[i].qt--;
            }else{
               cart.splice(i, 1);
            }
            updateCart();
          });

          cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
              cart[i].qt++; 
              updateCart();    
          });

          c('.cart').append(cartItem);
          
         
         }
         desconto = subtotal * 0.1;
         total = subtotal - desconto;

         c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
         c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
         c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
      c('aside').classList.remove('show');
      c('aside').style.left = '100vw';
    }
 }



