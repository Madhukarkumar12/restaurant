// import { Restaurant, SearchedRestaurant } from "@/types/restaurantType";
import { MenuItem, RestaurantState, Restaurant } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:3000/api/v1/restaurant";
axios.defaults.withCredentials = true;




export const useRestaurantStore = create<RestaurantState>()(persist((set) => ({
  loading: false,
  restaurant: null,
  searchedRestaurant: null,
  appliedFilter:[],
  singleRestaurant: null,
  createRestaurant: async (formData: FormData) => {
    try {
      set({ loading: true });
      const response = await axios.post(`${API_END_POINT}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false, restaurant:response.data });
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },

  getRestaurant: async () => {
    try {
      set({ loading: true });
      const response = await axios.get(`${API_END_POINT}/`);
      if (response.data.success) {
        set({ loading: false, restaurant: response.data.restaurant });
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        set({ restaurant: null });
      }
      set({ loading: false });
    }
  },
  updateRestaurant: async (formData: FormData) => {
    try {
      set({ loading: true });
      const response = await axios.put(`${API_END_POINT}/`, formData, {
        headers: {
          'Content-Type': 'multipart-formData'
        }
      })
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false });
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },
  searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
    try {
      set({ loading: true });
      const params = new URLSearchParams();
      console.log(params);
      params.set("searchQuery", searchQuery);
      params.set("selectedCuisines", selectedCuisines.join(","));
      console.log("afterParams",params);
      // dealy provide karenge thoda sa idhar....
      // await new Promise((resolve)=> setTimeout(resolve, 2000));
      const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
      if (response.data.success) {
        console.log(response.data);
        set({ loading: false, searchedRestaurant: response.data });
      }
    } catch (error) {
      set({ loading: false });
    }
  },
  addMenuToRestaurant: (menu: MenuItem) => {
    set((state: any) => ({
      restaurant: state.restaurant ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] } : null
    }))
  },
  updateMenuToRestaurant: (updateMenu: MenuItem) => {
    set((state: any) => {
      if (!state.restaurant) return state; // No change if restaurant doesn't exist

      const updatedMenuList = state.restaurant.menus.map((menu: any) =>
        menu._id === updateMenu._id ? updateMenu : menu
      );

      return {
        restaurant: {
          ...state.restaurant,
          menus: updatedMenuList
        }
      };
    });
  },
  setAppliedFilter:(value:string) => {
     set((state) => {
      const isAlreadyApplied = state.appliedFilter.includes(value);
      console.log(isAlreadyApplied);
      const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
      return {appliedFilter:updatedFilter};
     })
  },
  resetAppliedFilter: () => {
    set({appliedFilter:[]})
  },
  getSingleRestaurant: async (restaurantId: string) => {
    try{
       const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
       console.log(response);
       if(response.data.success){
        set({singleRestaurant: response.data.restaurant});
       }

    } catch(error){
      
    }
  } 

}), {
  name: 'restaurant-name',
  storage: createJSONStorage(() => localStorage)
}))