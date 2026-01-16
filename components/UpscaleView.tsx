import React, { useState } from 'react';
import { upscaleAndUnblur } from '../services/geminiService';
import { Upload, Download, Loader2, Maximize2, Sliders } from 'lucide-react';

const UpscaleView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(75);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
    }
  };

  const handleUpscale = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    try {
      const url = await upscaleAndUnblur(selectedFile, intensity);
      setResultUrl(url);
    } catch (err) {
      setError("Failed to upscale image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Maximize2 className="text-indigo-400" />
          Unblur & 4K Upscale
        </h2>
        <p className="text-zinc-400">Restore blurry photos and enhance them to Ultra-HD resolution using Gemini 3 Pro.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Original Image</h3>
          
          <div className="flex-1 border-2 border-dashed border-zinc-700 hover:border-indigo-500/50 transition-colors rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900 mb-6">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-[300px] object-contain" />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-zinc-500" />
                </div>
                <p className="text-zinc-400 font-medium">Click to upload photo</p>
                <p className="text-zinc-600 text-sm mt-1">Supports JPG, PNG</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="space-y-4 mb-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <label className="text-zinc-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Enhancement Intensity
              </label>
              <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {intensity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <div className="flex justify-between text-xs text-zinc-500 px-1">
              <span>Natural</span>
              <span>Balanced</span>
              <span>Sharp</span>
            </div>
          </div>

          <button
            onClick={handleUpscale}
            disabled={!selectedFile || isLoading}
            className={`mt-6 w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
              ${!selectedFile || isLoading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enhancing to 4K...
              </>
            ) : (
              <>
                <Maximize2 className="w-5 h-5" />
                Unblur & Upscale
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center justify-between">
            <span>Enhanced Result</span>
            {resultUrl && <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/20">4K Ready</span>}
          </h3>

          <div className="flex-1 bg-zinc-900 rounded-xl flex items-center justify-center relative overflow-hidden min-h-[300px] border border-zinc-800">
             {isLoading ? (
               <div className="flex flex-col items-center gap-4 animate-pulse">
                 <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                 <p className="text-zinc-500 text-sm">Processing pixels...</p>
               </div>
             ) : resultUrl ? (
               <img src={resultUrl} alt="Upscaled" className="max-w-full max-h-[400px] object-contain" />
             ) : (
               <p className="text-zinc-600 text-sm">Result will appear here</p>
             )}
          </div>

          <div className="mt-6 flex gap-3">
             <a 
               href={resultUrl || '#'} 
               download="enhanced-4k-image.png"
               className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                 ${!resultUrl 
                   ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                   : 'bg-zinc-100 text-zinc-900 hover:bg-white'
                 }`}
             >
               <Download className="w-5 h-5" />
               Download 4K Image
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpscaleView;