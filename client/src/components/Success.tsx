
import Image from "@/assets/hero_pizza.png";
import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { Orders  } from "@/types/orderType";

const Success = () => {
    // const orders = [1,2,3];
    const { orders, getOrderDetails } = useOrderStore();
    if (orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">Order not found</h1>
            </div>
        )
    }
    useEffect(() => {
        getOrderDetails();
        console.log(orders);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg p-6 max-w-lg w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Order Status:{" "}
                        <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
                    </h1>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Order Summary
                    </h2>
                    {/* ordered item displayed here.... */}
                    {
                        orders.map((order: any) => (
                            <>
                                {
                                    order.cartItems.map((item: CartItem) => (
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <img src='' alt=""
                                                        className="w-14 h-14 rounded-md object-cover"
                                                    />
                                                    <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">Pizza</h3>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                                        <IndianRupee />
                                                        <span className="text-lg font-medium">80</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                        </div>
                                    ))
                                }
                            </>

                        ))
                    }
                </div>
                <Link to="/cart">
                    <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">Continue shopping</Button>
                </Link>
            </div>
        </div>
    )

}

export default Success