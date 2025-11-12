import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ColorProps {
  colors: string[];
  onChange: (colors?: string[]) => void;
}
const ColorPicker = ({ colors, onChange }: ColorProps) => {
  const [inputColor, setInputColor] = useState<string>("#000000");

  const addColor = () => {
    if (!colors.includes(inputColor)) {
      onChange([...colors, inputColor]);
    }
  };
  const removeColor = (selectedColor: string) => {
    onChange(colors.filter((color) => color !== selectedColor));
  };
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          type="color"
          value={inputColor}
          onChange={(e) => setInputColor(e.target.value)}
          className="w-40 h-10"
        />
        <Button type="button" onClick={addColor} className="cursor-pointer">
          Add Color
        </Button>
      </div>
      <div className="grid grid-cols-5 md:grid-col-7 gap-10">
        {colors &&
          colors?.map((color, index) => (
            <div
              className="flex items-center gap-2 border border-gray-200  p-2 w-fit rounded-lg"
              key={index}
            >
              <div
                style={{ backgroundColor: color }}
                className="w-4 h-4 rounded-full"
              />
              <span className="text-sm text-gray-500">{color}</span>
              <Button
                variant={"outline"}
                className="w-2 h-2 cursor-pointer "
                onClick={() => removeColor(color)}
              >
                <X className="text-red-500 hover:text-red-200" />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ColorPicker;
