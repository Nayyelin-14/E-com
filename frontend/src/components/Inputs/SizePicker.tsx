import { SIZES } from "@/constants/sampleProduct";
import { Button } from "../ui/button";

interface SizePickerProps {
  sizes: string[];
  onChange: (sizes?: string[]) => void;
}

const SizePicker = ({ sizes, onChange }: SizePickerProps) => {
  const toggleButton = (selectedSize: string) => {
    if (sizes.includes(selectedSize)) {
      onChange(sizes.filter((s) => s !== selectedSize));
    } else {
      onChange([...sizes, selectedSize]);
    }
  };
  return (
    <div className="flex items-center gap-4">
      {SIZES &&
        SIZES.map((size, index) => (
          <Button
            key={index}
            type="button"
            onClick={() => toggleButton(size)}
            variant={"outline"}
            className={`${
              sizes.includes(size) && "bg-black text-white "
            } hover:bg-gray-400 hover:text-white cursor-pointer`}
          >
            {size.toUpperCase()}
          </Button>
        ))}
    </div>
  );
};

export default SizePicker;
