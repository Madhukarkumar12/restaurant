import { Loader2 } from "lucide-react";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { FormEvent, useState } from "react";
import { RestaurantFormSchema, restaurantFromSchema } from "@/schema/restaurantSchema";

const Restaurant = () => {
    // killer technique hai yeh...
    const [input, setInput] = useState<RestaurantFormSchema>({
        restaurantName:"",
        city:"",
        country:"",
        deliveryTime:0,
        cuisines:[],
        imageFile:undefined
    })

    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({})

    const changeEventHandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name,value, type} = e.target;
        setInput({...input, [name]: type === 'number' ? Number(value):value})
    }

    const submitHandler = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = restaurantFromSchema.safeParse(input);
        if(!result.success){
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<RestaurantFormSchema>);
            return;
        }
        console.log(input);
    }

    const loading = false;
    const restaurantHai = false;
  return (
    <div className="max-w-6xl mx-auto my-10">
        <div>
            <div>
                <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>
                <form onSubmit={submitHandler}>
                    <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                       <div>
                        <Label>Restaurant Name</Label>
                        <Input
                          type="text"
                          name="restaurantName"
                          placeholder="Enter Your Restaurant Name"
                          value={input.restaurantName}
                          onChange={changeEventHandler}
                        />
                        {errors && <span className="text-xs text-red-500 font-medium">{errors.restaurantName}</span>}
                       </div>
                       <div>
                        <Label>City</Label>
                        <Input
                          type="text"
                          name="city"
                          placeholder="Enter Your city Name"
                          value={input.city}
                          onChange={changeEventHandler}
                        />
                        {errors && <span className="text-xs text-red-500 font-medium">{errors.city}</span>}
                       </div>
                       <div>
                        <Label>Country</Label>
                        <Input
                          type="text"
                          name="country"
                          placeholder="Enter Your Country Name"
                          value={input.country}
                          onChange={changeEventHandler}
                        />
                        {errors && <span className="text-xs text-red-500 font-medium">{errors.country}</span>}
                       </div>
                       <div>
                        <Label>Delivery Time</Label>
                        <Input
                          type="number"
                          name="deliveryTime"
                          placeholder="Enter Your Delivery Time"
                          value={input.deliveryTime}
                          onChange={changeEventHandler}
                        />
                        {errors && <span className="text-xs text-red-500 font-medium">{errors.deliveryTime}</span>}
                       </div>
                       <div>
                        <Label>Cuisines</Label>
                        <Input
                          type="text"
                          name="cuisines"
                          placeholder="e.g. Momos, Biryani"
                          value={input.cuisines}
                          onChange={(e) => setInput({...input, cuisines:e.target.value.split(",")})}

                        />
                        {errors && <span className="text-xs text-red-500 font-medium">{errors.cuisines}</span>}
                       </div>
                       <div>
                        <Label>Upload Restaurant Banner</Label>
                        <Input
                          onChange={(e) => setInput({...input, imageFile:e.target.files?.[0] || undefined})}
                          type="file"
                          accept="image/*"
                          name="imageFile"
                        />
                        {errors && <span className="text-xs text-red-500 font-medium">
                            {errors.imageFile?.name || "Image File is required"}
                            </span>}
                       </div>
                    </div>
                    <div className="my-5 w-fit">
                        {
                            loading  ? (
                                <Button disabled className="bg-orange hover:bg-hoverOrange">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                </Button>
                            ): (
                                <Button className="bg-orange hover:bg-hoverOrange">
                                    {
                                        restaurantHai ? 'Update Your Restaurant' : 'Add Your Restaurant'
                                    }
                                    
                                </Button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Restaurant