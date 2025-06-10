// // import { Request, Response } from "express";
// // import { Restaurant } from "../models/restaurant.model";
// // import { Order } from "../models/order.model";
// // // import Stripe from "stripe";
// // import Razorpay from "razorpay";

// // const rzp = new Razorpay({
// //     key_id: process.env.RAZORPAY_KEY_ID!,
// //     key_secret: process.env.RAZORPAY_KEY_SECRET!
// // });

// // type CheckoutSessionRequest = {
// //     cartItems: {
// //         menuId: string;
// //         name: string;
// //         image: string;
// //         price: number;
// //         quantity: number
// //     }[],
// //     deliveryDetails: {
// //         name: string;
// //         email: string;
// //         address: string;
// //         city: string
// //     },
// //     restaurantId: string
// // }

// // export const getOrders = async (req: Request, res: Response) => {
// //     try {
// //         const orders = await Order.find({ user: req.id }).populate('user').populate('restaurant');
// //         console.log("Orders:",orders)
// //         return res.status(200).json({
// //             success: true,
// //             orders
// //         });
// //     } catch (error) {
// //         console.log(error);
// //         return res.status(500).json({ success: false, message: "Internal server error" });
// //     }
// // }

// // export const createCheckoutSession = async (req: Request, res: Response) => {
// //     try {
// //         const checkoutSessionRequest: CheckoutSessionRequest = req.body;
// //         const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
// //         if (!restaurant) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Restaurant not found."
// //             })
// //         };
// //         const order: any = new Order({
// //             restaurant: restaurant._id,
// //             user: req.id,
// //             deliveryDetails: checkoutSessionRequest.deliveryDetails,
// //             cartItems: checkoutSessionRequest.cartItems,
// //             status: "pending"
// //         });

// //         // line items
// //         const menuItems = restaurant.menus;
// //         const lineItems = createLineItems(checkoutSessionRequest, menuItems);

// //         // Calculate total amount in paise
// //         const totalAmount = lineItems.reduce((sum: number, item: any) => sum + (item.price_data.unit_amount * item.quantity), 0);

// //         // Create Razorpay order
// //         const razorpayOrder = await rzp.orders.create({
// //             amount: totalAmount,
// //             currency: "INR",
// //             receipt: order._id.toString(),
// //             notes: {
// //                 orderId: order._id.toString(),
// //                 restaurantId: restaurant._id.toString(),
// //             }
// //         });

// //         if (!razorpayOrder || !razorpayOrder.id) {
// //             return res.status(400).json({ success: false, message: "Error while creating Razorpay order" });
// //         }
// //         order.razorpayOrderId = razorpayOrder.id;
// //         await order.save();
// //         return res.status(200).json({
// //             orderId: order._id,
// //             razorpayOrderId: razorpayOrder.id,
// //             amount: razorpayOrder.amount,
// //             currency: razorpayOrder.currency,
// //             key: process.env.RAZORPAY_KEY_ID,
// //             restaurant: {
// //                 name: restaurant.name,
// //                 image: restaurant.image
// //             }
// //         });
// //     } catch (error) {
// //         console.log(error);
// //         return res.status(500).json({ message: "Internal server error" })

// //     }
// // }

// // export const stripeWebhook = async (req: Request, res: Response) => {
// //     let event;

// //     try {
// //         const signature = req.headers["stripe-signature"];

// //         // Construct the payload string for verification
// //         const payloadString = JSON.stringify(req.body, null, 2);
// //         const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

// //         // Generate test header string for event construction
// //         const header = stripe.webhooks.generateTestHeaderString({
// //             payload: payloadString,
// //             secret,
// //         });

// //         // Construct the event using the payload string and header
// //         event = stripe.webhooks.constructEvent(payloadString, header, secret);
// //     } catch (error: any) {
// //         console.error('Webhook error:', error.message);
// //         return res.status(400).send(`Webhook error: ${error.message}`);
// //     }

// //     // Handle the checkout session completed event
// //     if (event.type === "checkout.session.completed") {
// //         try {
// //             const session = event.data.object as Stripe.Checkout.Session;
// //             const order = await Order.findById(session.metadata?.orderId);

// //             if (!order) {
// //                 return res.status(404).json({ message: "Order not found" });
// //             }

// //             // Update the order with the amount and status
// //             if (session.amount_total) {
// //                 order.totalAmount = session.amount_total;
// //             }
// //             order.status = "confirmed";

// //             await order.save();
// //         } catch (error) {
// //             console.error('Error handling event:', error);
// //             return res.status(500).json({ message: "Internal Server Error" });
// //         }
// //     }
// //     // Send a 200 response to acknowledge receipt of the event
// //     res.status(200).send();
// // };

// // export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
// //     // 1. create line items
// //     const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
// //         const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
// //         if (!menuItem) throw new Error(`Menu item id not found`);

// //         return {
// //             price_data: {
// //                 currency: 'inr',
// //                 product_data: {
// //                     name: menuItem.name,
// //                     images: [menuItem.image],
// //                 },
// //                 unit_amount: menuItem.price * 100
// //             },
// //             quantity: cartItem.quantity,
// //         }
// //     })
// //     // 2. return lineItems
// //     return lineItems;
// // }


// import { Request, Response } from "express";
// import { Restaurant } from "../models/restaurant.model";
// import { Order } from "../models/order.model";
// import Razorpay from "razorpay";
// import crypto from "crypto";

// const rzp = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID!,
//     key_secret: process.env.RAZORPAY_KEY_SECRET!
// });

// type CheckoutSessionRequest = {
//     cartItems: {
//         menuId: string;
//         name: string;
//         image: string;
//         price: number;
//         quantity: number;
//     }[];
//     deliveryDetails: {
//         name: string;
//         email: string;
//         address: string;
//         city: string;
//     };
//     restaurantId: string;
// };

// export const getOrders = async (req: Request, res: Response) => {
//     try {
//         const orders = await Order.find({ user: req.id })
//             .populate('user')
//             .populate('restaurant');
        
//         return res.status(200).json({
//             success: true,
//             orders
//         });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         return res.status(500).json({ 
//             success: false, 
//             message: "Internal server error" 
//         });
//     }
// };

// export const createCheckoutSession = async (req: Request, res: Response) => {
//     try {
//         const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        
//         // Validate request body
//         if (!checkoutSessionRequest.cartItems || checkoutSessionRequest.cartItems.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Cart items are required"
//             });
//         }

//         const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId)
//             .populate('menus');
        
//         if (!restaurant) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Restaurant not found."
//             });
//         }

//         // Create order in database first
//         const order = new Order({
//             restaurant: restaurant._id,
//             user: req.id,
//             deliveryDetails: checkoutSessionRequest.deliveryDetails,
//             cartItems: checkoutSessionRequest.cartItems,
//             status: "pending"
//         });

//         await order.save();

//         // Calculate total amount in paise (Razorpay expects amount in smallest currency unit)
//         const totalAmount = checkoutSessionRequest.cartItems.reduce(
//             (sum, item) => sum + (item.price * item.quantity * 100), 
//             0
//         );

//         // Create Razorpay order
//         const razorpayOrder = await rzp.orders.create({
//             amount: totalAmount,
//             currency: "INR",
//             receipt: order._id.toString(),
//             notes: {
//                 orderId: order._id.toString(),
//                 restaurantId: restaurant._id.toString(),
//                 userId: req.id
//             },
//             payment_capture: 1 // Auto-capture payment
//         });

//         if (!razorpayOrder || !razorpayOrder.id) {
//             return res.status(500).json({ 
//                 success: false, 
//                 message: "Failed to create Razorpay order" 
//             });
//         }

//         // Update order with Razorpay order ID
//         order.razorpayOrderId = razorpayOrder.id;
//         await order.save();

//         return res.status(200).json({
//             success: true,
//             data: {
//                 orderId: order._id,
//                 razorpayOrderId: razorpayOrder.id,
//                 amount: razorpayOrder.amount,
//                 currency: razorpayOrder.currency,
//                 key: process.env.RAZORPAY_KEY_ID,
//                 name: restaurant.name,
//                 image: restaurant.image,
//                 deliveryDetails: checkoutSessionRequest.deliveryDetails
//             }
//         });

//     } catch (error) {
//         console.error("Error in checkout session:", error);
//         return res.status(500).json({ 
//             success: false,
//             message: "Internal server error" 
//         });
//     }
// };

// export const verifyPayment = async (req: Request, res: Response) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid payment verification data"
//             });
//         }

//         // Create the expected signature
//         const generatedSignature = crypto
//             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//             .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//             .digest('hex');

//         // Verify the signature
//         if (generatedSignature !== razorpay_signature) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Payment verification failed"
//             });
//         }

//         // Update order status in database
//         const order = await Order.findOneAndUpdate(
//             { razorpayOrderId: razorpay_order_id },
//             { 
//                 status: "paid",
//                 paymentId: razorpay_payment_id,
//                 paymentSignature: razorpay_signature,
//                 paidAt: new Date()
//             },
//             { new: true }
//         );

//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Payment verified successfully",
//             order
//         });

//     } catch (error) {
//         console.error("Error verifying payment:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };

// // Helper function to create line items (if still needed for other purposes)
// export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
//     return checkoutSessionRequest.cartItems.map((cartItem) => {
//         const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
//         if (!menuItem) throw new Error(`Menu item not found: ${cartItem.menuId}`);

//         return {
//             id: menuItem._id,
//             name: menuItem.name,
//             image: menuItem.image,
//             price: menuItem.price,
//             quantity: cartItem.quantity
//         };
//     });
// };



import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order, IOrder, CartItems } from "../models/order.model";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

type CheckoutSessionRequest = {
    cartItems: CartItems[];
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
    };
    restaurantId: string;
};

// Utility function to calculate total amount
const calculateTotalAmount = (cartItems: CartItems[]): number => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity * 100), 0);
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.id })
            .populate('user')
            .populate('restaurant')
            .sort({ createdAt: -1 }); // Newest first

        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch orders" 
        });
    }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { cartItems, deliveryDetails, restaurantId }: CheckoutSessionRequest = req.body;

        // Validate input
        if (!cartItems?.length) {
            return res.status(400).json({
                success: false,
                message: "Cart cannot be empty"
            });
        }

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID"
            });
        }

        const restaurant = await Restaurant.findById(restaurantId).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        // Create order with calculated total amount
        const totalAmount = calculateTotalAmount(cartItems) / 100; // Convert back to rupees for storage

        const order = new Order({
            user: req.id,
            restaurant: restaurant._id,
            deliveryDetails,
            cartItems,
            totalAmount,
            status: "pending"
        });

        await order.save();

        // Create Razorpay order (amount in paise)
        const razorpayOrder = await rzp.orders.create({
            amount: calculateTotalAmount(cartItems),
            currency: "INR",
            receipt: order._id.toString(),
            notes: {
                orderId: order._id.toString(),
                restaurantId: restaurant._id.toString(),
                userId: req.id.toString()
            },
            payment_capture: 1
        });

        // Update order with Razorpay reference
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(200).json({
            success: true,
            data: {
                order: {
                    id: order._id,
                    amount: order.totalAmount,
                    status: order.status,
                    createdAt: order.createdAt
                },
                payment: {
                    id: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    key: process.env.RAZORPAY_KEY_ID
                },
                restaurant: {
                    name: restaurant.name,
                    image: restaurant.image
                }
            }
        });

    } catch (error) {
        console.error("Checkout error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create checkout session"
        });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification data"
            });
        }

        // Generate signature for verification
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Update order status
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { 
                status: "confirmed",
                paymentDetails: {
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    date: new Date()
                }
            },
            { new: true }
        ).populate('restaurant');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                order: {
                    id: order._id,
                    status: order.status,
                    amount: order.totalAmount,
                    restaurant: {
                        name: order.restaurant.name,
                        image: order.restaurant.image
                    }
                },
                payment: {
                    id: razorpay_payment_id,
                    status: "verified"
                }
            }
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify payment"
        });
    }
};

// Webhook handler for Razorpay
export const razorpayWebhook = async (req: Request, res: Response) => {
    const body = req.body;
    const signature = req.headers['x-razorpay-signature'] as string;

    try {
        // Verify webhook signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(JSON.stringify(body))
            .digest('hex');

        if (generatedSignature !== signature) {
            console.warn("Invalid webhook signature");
            return res.status(400).send('Invalid signature');
        }

        // Handle payment captured event
        if (body.event === 'payment.captured') {
            const payment = body.payload.payment.entity;
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: payment.order_id },
                { 
                    status: "confirmed",
                    paymentDetails: {
                        paymentId: payment.id,
                        method: payment.method,
                        amount: payment.amount / 100, // Convert to rupees
                        date: new Date(payment.created_at * 1000)
                    }
                },
                { new: true }
            );

            if (!order) {
                console.warn(`Order not found for Razorpay order ID: ${payment.order_id}`);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send('Internal Server Error');
    }
};