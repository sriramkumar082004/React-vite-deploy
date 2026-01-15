import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PhotoIcon, ArrowPathIcon, CloudArrowUpIcon, SwatchIcon } from '@heroicons/react/24/outline';

const ImageBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff'); // Default white

  const APY_TOKEN = "APY0V5MltvTBMBpWmLD7D3B4M9AH4ZCMvR3xQEN4DiJXckaAh6iMpNcTHCJqrvKsQtBcaBerrf"; // Ideally move to .env

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessedImage(null); // Reset previous result
    }
  };

  const handleColorChange = (e) => {
    setBgColor(e.target.value);
  };

  const processImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('background_color', bgColor);

    try {
      const response = await axios.post(
        'https://api.apyhub.com/processor/image/change-background/file',
        formData,
        {
          headers: {
            'apy-token': APY_TOKEN,
            // 'Content-Type': 'multipart/form-data' // Let axios set this with the correct boundary
          },
          responseType: 'blob', // Important for image response
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
      toast.success('Background changed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error.response?.data instanceof Blob 
        ? 'Image processing failed. (Blob error)' // Often errors come as JSON inside Blob if responseType is blob
        : error.response?.data?.message || error.message || 'Failed to process image.';
        
      toast.error(`Error: ${errorMessage}`);
      
      // If response is a blob, try to read the text to see the actual error
      if (error.response?.data instanceof Blob) {
           const text = await error.response.data.text();
           console.error("API Error Text:", text);
           try {
               const json = JSON.parse(text);
                toast.error(`API Error: ${json.message || text}`);
           } catch(e) {
                // Not JSON
           }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-6 pt-20">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-6 text-white text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                <PhotoIcon className="w-8 h-8" />
                Image Background Changer
            </h1>
            <p className="mt-2 text-purple-100">Upload an image and give it a new look!</p>
        </div>

        <div className="p-8 space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                    <label className="text-sm font-semibold text-gray-700">1. Upload Image</label>
                    <label className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center gap-2 shadow-sm">
                        <CloudArrowUpIcon className="w-5 h-5" />
                        <span>{selectedFile ? selectedFile.name.substring(0, 15) + (selectedFile.name.length > 15 ? '...' : '') : 'Choose File'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="hidden md:block w-px h-12 bg-gray-300"></div>

                <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                     <label className="text-sm font-semibold text-gray-700">2. Pick Color</label>
                     <div className="flex items-center gap-3">
                        <input 
                            type="color" 
                            value={bgColor} 
                            onChange={handleColorChange} 
                            className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                            title="Choose background color"
                        />
                        <span className="font-mono text-gray-600 bg-white px-2 py-1 rounded border text-sm">{bgColor}</span>
                     </div>
                </div>

                 <div className="hidden md:block w-px h-12 bg-gray-300"></div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={processImage}
                        disabled={loading || !selectedFile}
                        className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md transform active:scale-95 ${
                            loading || !selectedFile 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                        }`}
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <SwatchIcon className="w-5 h-5" />
                                Change Background
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Original */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Original Image</h3>
                    <div className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-gray-400 text-center p-4">
                                <PhotoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No image uploaded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Processed */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Processed Result</h3>
                    <div className="aspect-square bg-white rounded-xl border border-gray-200 shadow-inner flex items-center justify-center overflow-hidden relative">
                         {processedImage ? (
                            <div className="relative w-full h-full">
                                <img src={processedImage} alt="Processed" className="w-full h-full object-contain" />
                                <a 
                                    href={processedImage} 
                                    download="processed-image.png"
                                    className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow hover:bg-white text-indigo-600 transition-all"
                                    title="Download Image"
                                >
                                    <CloudArrowUpIcon className="w-6 h-6" />
                                </a>
                            </div>
                        ) : (
                            <div className="text-gray-400 text-center p-4">
                                {loading ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
                                        <p>Generative Magic in progress...</p>
                                    </div>
                                ) : (
                                    <>
                                        <SwatchIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Result will appear here</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


export default ImageBackground;
