import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema"
import { useMenuStore } from "@/store/useMenuStore"
import { Loader2 } from "lucide-react"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"


const EditMenu = ({ selectedMenu, editOpen, setEditOpen }: { selectedMenu: MenuFormSchema, editOpen: boolean, setEditOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [input, setInput] = useState<MenuFormSchema>({
      name:"",
      description:"",
      price:0,
      image:undefined
    })
    const [error, setError] = useState<Partial<MenuFormSchema>>({});
    // const loading = false;
    const {loading, editMenu} = useMenuStore();

  const changeEventHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
      const {name, value, type} = e.target;
      setInput({...input, [name]:type==='number' ? Number(value) : value})
  }
  const submitHandler = async(e:FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const result = menuSchema.safeParse(input);
      if(!result.success){
        const fieldErrors = result.error.formErrors.fieldErrors;
        setError(fieldErrors as Partial<MenuFormSchema>);
        return;
      }
      // api start hoga yaaha se..
      try{
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("price", input.price.toString());
        if(input.image){
         formData.append("image", input.image);
        }
        await editMenu(selectedMenu._id, formData);
     }catch(error){
       console.log(error);
     }
  }

  useEffect(() => {
    setInput({
      name: selectedMenu?.name || "",
      description: selectedMenu?.description || "",
      price: selectedMenu?.price || 0,
      image: undefined,
    });
  }, [selectedMenu]);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Update your menu to keep your offerings fresh and exciting!
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
            {error && <span className="text-xs font-medium text-red-600">{error.image?.name || "Image is required.."}</span>}
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
  )
}

export default EditMenu