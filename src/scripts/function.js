import axios from 'axios';
import catsData from '../data/cats.json';

const functionControl = () => {
  return {
    // data
    cart: [],
    cats: catsData.cats,


    // methods
    addCart(catId) {

      const cat = this.cats.find(c => c.id === catId);
      if (!cat) return;

      // 檢查購物車中是否已有此貓咪
      const existingItem = this.cart.find(item => item.id === catId);
      if (existingItem) {
      // 已存在，數量+1
        existingItem.quantity += 1;
      } else {
      // 不存在，新增到購物車
        this.cart.push({
        id: cat.id,
        name: cat.name,
        price: cat.price,
        quantity: 1
       });
      }
    },

    totalPrice() {
      let total = 0;
      for (let item of this.cart) {
        total = total + (item.price * item.quantity);
      }
      return total.toFixed(2);
    },



    
  }
}


export { functionControl }