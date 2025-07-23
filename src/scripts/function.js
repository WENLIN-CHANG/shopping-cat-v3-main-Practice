import axios from 'axios';

const functionControl = () => {
  return {
    // data
    cart: JSON.parse(localStorage.getItem('shoppingCart')) || [],
    cats: [],
    isLoading: false,
    errorMessage: '',


    // methods
    addCart: function (catId) {

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

      this.saveCart()
    },

    totalPrice: function() {
      let total = 0;
      for (let item of this.cart) {
        total = total + (item.price * item.quantity);
      }
      return total.toFixed(2);
    },

    removeFromCart: function(catId) {
      const index = this.cart.findIndex(item => item.id === catId)

      if(index != -1) {
        this.cart.splice(index, 1)
      }

      this.saveCart()
    },

    clearCart: function() {
      if (confirm('確定要清空所有認養清單嗎？')) {
        this.cart = [];
      }

      this.saveCart()
    },

    // localStorage
    saveCart: function() {
      localStorage.setItem('shoppingCart', JSON.stringify(this.cart))
    },


    // 防止亂輸入數字
    validateQuantity: function(item) {
      if(item.quantity < 1 || isNaN(item.quantity) || item.quantity == null) {
        item.quantity = 1
      }

      item.quantity = Math.floor(item.quantity)

      this.saveCart()
    },

    // API 相關方法
    fetchCats: async function() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const response = await axios.get('http://localhost:3002/cats');
        this.cats = response.data;
      } catch (error) {
        this.errorMessage = '無法載入貓咪資料，請檢查網路連線';
        console.error('API 呼叫失敗:', error);
      } finally {
        this.isLoading = false;
      }
    },

    loadCart: async function() {
      try {
        const response = await axios.get('http://localhost:3002/cart');
        // 如果 API 有資料，使用 API 資料，否則保持 localStorage
        if (response.data && response.data.length > 0) {
          this.cart = response.data;
          this.saveCart(); // 同步到 localStorage
        }
      } catch (error) {
        console.error('API 載入購物車失敗，使用本地資料:', error);
      }
    },

    // 初始化方法
    init: function() {
      this.fetchCats();
      this.loadCart();
    }

    
  }
}


export { functionControl }