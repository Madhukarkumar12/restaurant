import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import axios from 'axios'
import { LoginInputState, SignupInputState } from '@/schema/userSchema';
import { toast } from 'sonner';

const API_END_POINT = 'http://localhost:3000/api/v1/user';
axios.defaults.withCredentials = true;
type User = {
    fullname: string;
    email:string;
    contact:number;
    address:string;
    country:string;
    profilePicture:string;
    admin:boolean;
    isVerified:boolean
}
// type given 
type UserState = {
    user:User | null;
    isAuthenticated:boolean;
    isCheckingAuth: boolean;
    loading:boolean;
    signup: (input:SignupInputState) => Promise<void>;
    login: (input:LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email:string) => Promise<void>;
    resetPassword: (token:string, newPassword:string) => Promise<void>;
    updateProfile: (input:any) => Promise<void>;
}

export const useUserStore = create<UserState>()(persist((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    //    signup api implementation...
    signup: async (input: SignupInputState) => {

        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/signup`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                console.log(response.data);
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    // login api implementation...
    login: async (input: LoginInputState) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                console.log(response.data);
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    // verify email....
    verifyEmail: async (verificationCode: string) => {
        try{
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/verify-email`, {verificationCode}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false, user:response.data.user, isAuthenticated:true});

            }
            return response.data;
        } catch(error:any){
            toast.error("Error verifying email");
            set({loading:false});
        }
    },
    // authentication check....
    checkAuthentication: async () => {
        try{
            set({isCheckingAuth:true});
            const response = await axios.get(`${API_END_POINT}/check-auth`);
            console.log("Response",response);
            if(response.data.success){
                set({ user:response.data.user, isAuthenticated:true ,isCheckingAuth:false});
            }
        } catch(error:any){
            set({ isAuthenticated:false, isCheckingAuth:false});
        }
    },                                                                                                                                                                                                                              
    // logout api implementation...
    logout: async() => {
        try{
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/logout`);
            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false, user:null, isAuthenticated:false})
            }
        } catch(error:any){
            set({loading:false});
        }
    },
    // forgotpassword
    forgotPassword : async (email:string) => {
        try{
             set({loading:true});
             const response = await axios.post(`${API_END_POINT}/forgot-password`, {email});
             if(response.data.success){
                toast.success(response.data.message);
                set({loading:false});
             }
        } catch(error:any){
            toast.error(error.response.data.message);
            set({loading:false});
        }
    },
    // reset password
    resetPassword: async (token:string, newPassword:string) => {
        try{
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, {newPassword});
            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false});
            }
        } catch(error:any){
            toast.error(error.response.data.message);
            set({loading:false});
        }
    },
    // update user
    updateProfile:async (input:any) => {
        try{
            // set({loading:true});
            const response = await axios.put(`${API_END_POINT}/profile/update`, input, {
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(response.data.success){
                toast.success(response.data.message);
                set({user:response.data.user, isAuthenticated:true})
            }
        } catch(error:any){
            toast.error(error.response.data.message);
            // set({loading:false});
        }
    }
}),
    {
        name: 'user-name',
        storage: createJSONStorage(() => localStorage),
    }
))