
import React, { useRef } from 'react';

interface UploaderProps {
  onImageSelected: (base64: string, type: string) => void;
  selectedImage: string | null;
}

const Uploader: React.FC<UploaderProps> = ({ onImageSelected, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        onClick={triggerUpload}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all duration-300 h-64 flex flex-col items-center justify-center overflow-hidden
          ${selectedImage ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        {selectedImage ? (
          <>
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fas fa-sync-alt"></i> 更换照片
              </span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-cloud-upload-alt text-2xl"></i>
            </div>
            <p className="text-gray-600 font-medium">点击或拖拽照片到这里</p>
            <p className="text-gray-400 text-sm mt-1">推荐使用清晰的正面人像照</p>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default Uploader;
