import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type FilterOptionsState = {
  id: string;
  label: string;
}
//  agar applied filter ke andar ye item exist karta hai to item checked hai..
const filterOptions: FilterOptionsState[] = [
  { id: "burger", label: "Burger"},
  { id: "thali", label: "Thali"},
  { id: "biryani", label: "Biryani"},
  { id: "momos", label: "Momos"},
]
const FilterPage = () => {
  const {setAppliedFilter, appliedFilter, resetAppliedFilter} = useRestaurantStore();
  const appliedFilterHandler = (value:string) => {
    setAppliedFilter(value);
  }
  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by Cuisines</h1>
        <Button variant={"link"} onClick={resetAppliedFilter}>Reset</Button>
      </div>
      {
        filterOptions.map((option)=> (
          <div key={option.id} className="flex items-center space-x-2 my-5">
            <Checkbox
              id={option.id}
              checked={appliedFilter.includes(option.label)} // ya pe refresh ke baad bhi checked hogaa.
              onClick={()=>appliedFilterHandler(option.label)}
            />
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option.label}</Label>

          </div>
        ))
      }
    </div>
  )
}

export default FilterPage