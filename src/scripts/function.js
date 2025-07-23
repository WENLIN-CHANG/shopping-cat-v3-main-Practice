import axios from 'axios';

const functionControl = () => {
  return {
    // data
    cart: JSON.parse(localStorage.getItem('shoppingCart')) || [],
    cats: [],
    isLoading: false,
    errorMessage: '',


    // methods
    addCart: async function (catId) {
      const cat = this.cats.find(c => c.id === catId);
      if (!cat) return;

      // 檢查購物車中是否已有此貓咪
      const existingItem = this.cart.find(item => item.id === catId);
      
      try {
        if (existingItem) {
          // 已存在，數量+1
          existingItem.quantity += 1;
          await axios.patch(`http://localhost:3002/cart/${catId}`, {
            quantity: existingItem.quantity
          });
        } else {
          // 不存在，新增到購物車
          const newItem = {
            id: cat.id,
            name: cat.name,
            price: cat.price,
            quantity: 1
          };
          this.cart.push(newItem);
          await axios.post('http://localhost:3002/cart', newItem);
        }
        
        this.saveCart(); // 保存到 localStorage 作為備份
      } catch (error) {
        console.error('加入購物車失敗:', error);
        // API 失敗時回滾本地狀態
        if (existingItem) {
          existingItem.quantity -= 1;
        } else {
          this.cart.pop();
        }
      }
    },

    totalPrice: function() {
      let total = 0;
      for (let item of this.cart) {
        total = total + (item.price * item.quantity);
      }
      return total.toFixed(2);
    },

    removeFromCart: async function(catId) {
      const index = this.cart.findIndex(item => item.id === catId);
      
      if (index === -1) return;
      
      const removedItem = this.cart[index]; // 備份被移除的項目
      
      try {
        this.cart.splice(index, 1);
        await axios.delete(`http://localhost:3002/cart/${catId}`);
        this.saveCart();
      } catch (error) {
        console.error('移除商品失敗:', error);
        // API 失敗時回滾本地狀態
        this.cart.splice(index, 0, removedItem);
      }
    },

    clearCart: async function() {
      if (!confirm('確定要清空所有認養清單嗎？')) return;
      
      const backupCart = [...this.cart]; // 備份購物車
      
      try {
        // 先清空本地狀態
        this.cart = [];
        
        // 逐一刪除後端資料
        for (const item of backupCart) {
          await axios.delete(`http://localhost:3002/cart/${item.id}`);
        }
        
        this.saveCart();
      } catch (error) {
        console.error('清空購物車失敗:', error);
        // API 失敗時回滾本地狀態
        this.cart = backupCart;
      }
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