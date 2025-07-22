import "@fortawesome/fontawesome-free/css/all.css"
// 實作寫在這裡！

import Alpine from 'alpinejs'
import { functionControl } from './function'



window.Alpine = Alpine
Alpine.data('functionControl', functionControl)



Alpine.start()