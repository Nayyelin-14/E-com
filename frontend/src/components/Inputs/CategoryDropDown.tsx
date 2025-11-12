import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Categories = [
  // 👕 Clothing
  { id: "t-shirts", label: "T-Shirts" },
  { id: "shirts", label: "Shirts" },
  { id: "polo-shirts", label: "Polo Shirts" },
  { id: "hoodies", label: "Hoodies" },

  { id: "jeans", label: "Jeans" },

  { id: "shorts", label: "Shorts" },
  { id: "skirts", label: "Skirts" },
  { id: "underwear", label: "Underwear" },

  { id: "sneakers", label: "Sneakers" },
  { id: "boots", label: "Boots" },
  { id: "sandals-slides", label: "Sandals & Slides" },

  { id: "wallets", label: "Wallets" },
  { id: "belts", label: "Belts" },
  { id: "watches", label: "Watches" },
];
interface CatProps {
  onChange: (value: string | null) => void;
  value: string;
}
const CategoryDropDown = ({ onChange, value }: CatProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {Categories?.map((cat, index) => (
            <SelectItem key={index} value={cat.id}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategoryDropDown;
