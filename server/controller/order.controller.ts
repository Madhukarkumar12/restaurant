import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
   cartItems: {
    menuId:string;
    name:string;
    image:string;
    price:number;
    quantity:number;
   }[],
   deliveryDetails:{
    name:string;
    email:string;
    address:string;
    city:string;
   },
    restaurantId:string;
}

type MenuItems = {
    menuId:string;
    name:string;
    image:string;
    price:number;
    quantity:number;
}

export const getOrders = async (req:Request, res:Response) => {
    try{
        const orders = await Order.find({user:req.id}.populate('user').populate('restaurant'));
        return res.status(200).json({
            success:true,
            orders
        })
    } catch(error){
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createCheckoutSession = async (req:Request, res:Response) => {
    try{
        const checkoutSessionRequest : CheckoutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menu');
        if(!restaurant){
            return res.status(404).json({ error: "Restaurant not found" });
        }
        const order:any = new Order({
            restaurant: restaurant._id,
            user: req._id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems:checkoutSessionRequest.cartItems,
            status: "pending"
        })

        // line items....
        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTENED_URL}/order/status`,
            cancel_url: `${process.env.FRONTENED_URL}/cart`,
            metadata: {
                orderId:order._id.toString(),
                images:JSON.stringify(menuItems.map((item:any) => item.image)),
            }
        })

        if(!session.url){
            return res.status(400).json({ success: false, message: "Error while creating session" });
        }

        await order.save();
        return res.status(200).json({
            session
        })
    } catch(error){
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createLineItems = (checkoutSessionRequest:CheckoutSessionRequest, menuItems:any) => {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem)=> {
        const menuItem = menuItems.find((item:any) => item._id ===cartItem.menuId);
        if(!menuItem){
            throw new Error(`Menu item with id ${cartItem.menuId} not found`);
        }
        return {
            price_data: {
                currency:'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount:menuItem.price * 100,
            },
            quantity: cartItem.quantity,
        }
    })

    return lineItems;
}

