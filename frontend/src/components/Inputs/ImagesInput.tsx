import { Plus, X } from "lucide-react";
import { useRef } from "react";

interface inputProps {
  onChange: (images: Array<{ preview: string; public_alt?: string }>) => void;
  images: Array<{ preview: string; file?: File; public_alt?: string }>;
}
const ImagesInput = ({ images, onChange }: inputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addImages = () => {
    inputRef?.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages = files?.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    onChange([...images, ...newImages]);
  };
  const handleRemove = (index: number) => {
    const allImages = [...images];
    console.log(images[index]);
    if (images[index].preview.startsWith("blob:")) {
      URL.revokeObjectURL(images[index].preview);
    }
    allImages.splice(index, 1);
    onChange(allImages);
  };
  return (
    <div>
      <div className="grid grid-cols-5 md:grid-cols-6 gap-4 mb-3">
        {images &&
          images.map((img, index) => (
            <div
              key={index}
              className="w-24 h-20 border border-gray-300 rounded-lg relative group overflow-hidden p-1"
            >
              <img
                src={img.preview}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-0 cursor-pointer right-0 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
      </div>
      <div
        onClick={addImages}
        className="flex items-center justify-center w-14 h-14 border border-dashed border-blue-400 cursor-pointer"
      >
        <Plus className="text-blue-500" />
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImagesInput;
