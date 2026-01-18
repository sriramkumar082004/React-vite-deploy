import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// Importing SwatchIcon for color picker support
import { PhotoIcon, ArrowPathIcon, CloudArrowUpIcon, CloudArrowDownIcon, SwatchIcon } from '@heroicons/react/24/outline';

import { useNavigate } from 'react-router-dom';

const ImageBackground = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // New state for color picker
  const [useColor, setUseColor] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');

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
    
    // Determine endpoint based on mode
    const mode = useColor ? 'change' : 'remove';
    const endpoint = mode === 'remove'
        ? 'https://api.apyhub.com/processor/image/remove-background/file'
        : 'https://api.apyhub.com/processor/image/change-background/file';

    if (mode === 'change') {
        formData.append('background_color', bgColor);
    }

    try {
      const response = await axios.post(
        endpoint,
        formData,
        {
          headers: {
            'apy-token': APY_TOKEN,
          },
          responseType: 'blob', 
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
      toast.success(mode === 'remove' ? 'Background removed successfully!' : 'Background changed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error.response?.data instanceof Blob 
        ? 'Image processing failed. (Blob error)' 
        : error.response?.data?.message || error.message || 'Failed to process image.';
        
      toast.error(`Error: ${errorMessage}`);
      
      if (error.response?.data instanceof Blob) {
           const text = await error.response.data.text();
           console.error("API Error Text:", text);
           try {
               const json = JSON.parse(text);
                toast.error(`API Error: ${json.message || text}`);
           } catch {
                // Not JSON
           }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-2 relative">
      <div className="max-w-4xl w-full bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 overflow-hidden">

        <div className="text-center space-y-2 mt-8 mb-4">
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent inline-block pb-2">
               {useColor ? 'Change Background' : 'Remove Background'}
            </h1>
            <p className="text-slate-400">
                {useColor ? 'Upload an image and pick a color to replace background.' : 'Upload an image to remove the background instantly.'}
            </p>
        </div>

        <div className="p-6 space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row flex-wrap gap-8 items-center justify-center bg-slate-900/50 p-8 rounded-2xl border border-white/5">
                
                {/* 1. Upload */}
                <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Upload Image</label>
                    <label className="cursor-pointer bg-slate-800 px-6 py-3 rounded-xl border border-slate-600 hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3 group w-full md:w-auto justify-center">
                        <div className={`p-2 rounded-lg ${selectedFile ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'} transition-colors`}>
                            <CloudArrowUpIcon className="w-6 h-6" />
                        </div>
                        <span className="text-slate-300 font-medium group-hover:text-white truncate max-w-[200px]">
                            {selectedFile ? selectedFile.name : 'Choose File...'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                {/* Arrow Divider */}
                <div className="hidden md:block text-slate-600">
                    <svg className="w-6 h-6 transform -rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
                
                 {/* 1.5 Toggle Option */}
                 <div className="flex flex-col items-center gap-3">
                     <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Mode</label>
                     <div 
                        className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-full cursor-pointer hover:bg-slate-800 transition-colors border border-slate-700"
                        onClick={() => {
                             setUseColor(!useColor);
                             setProcessedImage(null);
                        }}
                     >
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${!useColor ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                            Remove
                        </span>
                        
                        <div className={`w-8 h-4 bg-slate-700 rounded-full relative transition-colors ${useColor ? 'bg-indigo-900' : 'bg-slate-700'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${useColor ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>

                        <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${useColor ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                            Replace
                        </span>
                     </div>
                 </div>

                {/* 2. Color Picker (Conditional) */}
                {useColor && (
                    <>
                         <div className="hidden md:block text-slate-600">
                            <svg className="w-6 h-6 transform -rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                        <div className="flex flex-col items-center gap-3 w-full md:w-auto animate-in fade-in zoom-in duration-300">
                             <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Pick Color</label>
                             <div className="flex items-center gap-3 bg-slate-800 p-2 pr-4 rounded-xl border border-slate-600 shadow-sm">
                                <input 
                                    type="color" 
                                    value={bgColor} 
                                    onChange={handleColorChange} 
                                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                                    title="Choose background color"
                                />
                                <span className="font-mono text-slate-300 text-sm font-medium">{bgColor}</span>
                             </div>
                        </div>
                    </>
                )}


                <div className="hidden md:block text-slate-600">
                    <svg className="w-6 h-6 transform -rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>

                {/* 2. Action Button */}
                <div className="w-full md:w-auto flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide text-center md:text-left invisible">Action</label>
                    <button
                        onClick={processImage}
                        disabled={loading || !selectedFile}
                        className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform active:scale-95 ${
                            loading || !selectedFile 
                            ? 'bg-slate-700 cursor-not-allowed shadow-none text-slate-500' 
                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                        }`}
                    >
                        {loading ? (
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        ) : useColor ? (
                            <SwatchIcon className="w-5 h-5" />
                        ) : (
                            <PhotoIcon className="w-5 h-5" />
                        )}
                        {loading ? 'Processing...' : useColor ? 'Change Background' : 'Remove Background'}
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Original */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2">Original Image</h3>
                    <div className="aspect-square bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative group">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-slate-500 text-center p-4">
                                <PhotoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No image uploaded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Processed */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2">Processed Result</h3>
                    <div className="aspect-square bg-slate-800 rounded-xl border border-slate-700 shadow-inner flex items-center justify-center overflow-hidden relative">
                         {processedImage ? (
                            <div className="relative w-full h-full">
                                <img src={processedImage} alt="Processed" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="text-slate-500 text-center p-4">
                                {loading ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <div className="w-12 h-12 bg-slate-600 rounded-full mb-2"></div>
                                        <p>{useColor ? 'Changing background...' : 'Removing background...'}</p>
                                    </div>
                                ) : (
                                    <>
                                        <PhotoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Result will appear here</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {processedImage && (
                        <div className="flex justify-center mt-2">
                            <a 
                                href={processedImage} 
                                download="processed-image.png" 
                                className="px-8 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                            >
                                <CloudArrowDownIcon className="w-5 h-5" />
                                Download Image
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageBackground;
