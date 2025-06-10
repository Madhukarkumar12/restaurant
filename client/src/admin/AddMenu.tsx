import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useState, FormEvent } from "react"
import Heroimage from "@/assets/hero_pizza.png"
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";//zod se aaya hai ye.....
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

// just for practice concept....
// const menus = [
//   {
//     name: "Biryani",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//     price: 80,
//     image: Heroimage
//   },
//   {
//     name: "Biryani",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//     price: 80,
//     image: Heroimage
//   }
// ]

const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined
  })
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  // const loading = false;
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMenu, setselectedMenu] = useState<any>();
  const [editOpen, seteditOpen] = useState<boolean>(false);
  const{loading, createMenu} = useMenuStore();

  const {restaurant} = useRestaurantStore();
  console.log(restaurant);

  const changeEventHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  }

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    try{
       const formData = new FormData();
       formData.append("name", input.name);
       formData.append("description", input.description);
       formData.append("price", input.price.toString());
       if(input.image){
        formData.append("image", input.image);
       }
      //  console.log(formData);
       await createMenu(formData);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">Available Menus</h1>

        <Dialog open={open} onOpenChange={setOpen} >
          <DialogTrigger>
            <Button className="bg-orange hover:bg-hoverOrange">
              <Plus className="mr-2" />
              Add Menus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out .
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={input.name}
                  placeholder="Enter Menu Name"
                  name="name"
                  onChange={changeEventHandler}
                />
                {error && <span className="text-xs font-medium text-red-600">{error.name}</span>}
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  value={input.description}
                  placeholder="Enter description menu"
                  name="description"
                  onChange={changeEventHandler}
                />
                {error && <span className="text-xs font-medium text-red-600">{error.description}</span>}
              </div>
              <div>
                <Label>Price in (Rupees)</Label>
                <Input
                  type="number"
                  value={input.price}
                  placeholder="Enter menu price"
                  name="price"
                  onChange={changeEventHandler}
                />
                {error && <span className="text-xs font-medium text-red-600">{error.price}</span>}
              </div>
              <div>
                <Label>Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setInput((prev: any) => ({
                      ...prev,
                      image: e.target.files?.[0] || undefined
                    }))
                  }
                />
                {error && <span className="text-xs font-medium text-red-600">{error.image?.name }</span>}
              </div>
              <DialogFooter className="mt-5">
                {
                  loading ? (
                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Pleade Wait
                    </Button>
                  ) : (
                    <Button className="bg-orange hover:bg-hoverOrange">submit</Button>
                  )
                }

              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {
        restaurant?.menus.map((menu: any, idx: number) => (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg ">
              <img
                src={menu.image}
                alt="menu"
                className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-800">{menu.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
                <h2 className="text-md font-semibold mt-2">
                  Price: <span className="text-[#D19254]">{menu.price}</span>
                </h2>
              </div>
              <Button onClick={() => {
                setselectedMenu(menu),
                  seteditOpen(true)
              }} size={'sm'} className="bg-orange hover:bg-hoverOrange mt-2">Edit</Button>
            </div>
          </div>
        ))
      }
      <EditMenu selectedMenu={selectedMenu} editOpen={editOpen} setEditOpen={seteditOpen} />
    </div>
  )
}

export default AddMenu