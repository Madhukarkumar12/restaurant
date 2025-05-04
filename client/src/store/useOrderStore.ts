import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:3000/api/v1/order";

export const useOrderStore = create<OrderState>()(persist((set => ({
   loading:false,
   orders:[],
   createCheckoutSession: async(checkoutSession:CheckoutSessionRequest) => {
      try{
        set({loading:true});
        const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkoutSession, {
            headers:{
                'Content-Type':'application/json'
            }
        })
        window.location.href = response.data.session.url;
        set({loading:false})
      }catch(error){
         set({loading:false});
      }
   },
   getOrderDetails: async() => {

   }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))