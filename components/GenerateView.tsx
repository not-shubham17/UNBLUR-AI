import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';
import { ImagePlus, Loader2, Download } from 'lucide-react';

const GenerateView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const url = await generateImage(prompt, aspectRatio, imageSize);
      setGeneratedImage(url);
    } catch (e) {
      alert("Generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ImagePlus className="text-purple-400" />
          Pro Image Generation
        </h2>
        <p className="text-zinc-400">Generate high-fidelity images with Nano Banana Pro (Gemini 3 Pro Image).</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Controls */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
             <div>
               <label className="block text-zinc-400 text-sm font-medium mb-2">Prompt</label>
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 className="w-full bg-black/20 border border-zinc-700 rounded-lg p-3 text-zinc-100 h-32 focus:border-purple-500 focus:outline-none resize-none"
                 placeholder="A futuristic city with neon lights..."
               />
             </div>

             <div>
               <label className="block text-zinc-400 text-sm font-medium mb-2">Aspect Ratio</label>
               <select 
                 value={aspectRatio} 
                 onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                 className="w-full bg-black/20 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:border-purple-500 focus:outline-none appearance-none"
               >
                 {Object.values(AspectRatio).map(ratio => (
                   <option key={ratio} value={ratio}>{ratio}</option>
                 ))}
               </select>
             </div>

             <div>
               <label className="block text-zinc-400 text-sm font-medium mb-2">Resolution</label>
               <div className="grid grid-cols-3 gap-2">
                 {Object.values(ImageSize).map(size => (
                   <button
                     key={size}
                     onClick={() => setImageSize(size)}
                     className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
                       imageSize === size 
                       ? 'bg-purple-600 border-purple-500 text-white' 
                       : 'bg-black/20 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
             </div>

             <button
               onClick={handleGenerate}
               disabled={!prompt || isLoading}
               className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <ImagePlus className="w-5 h-5" />}
               Generate
             </button>
          </div>
        </div>

        {/* Result */}
        <div className="w-full lg:w-2/3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl h-[500px] lg:h-[600px] flex items-center justify-center relative overflow-hidden">
             {isLoading ? (
               <div className="flex flex-col items-center animate-pulse">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full mb-3 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                  </div>
                  <span className="text-zinc-500 text-sm">Generating Pixel Artistry...</span>
               </div>
             ) : generatedImage ? (
               <div className="relative w-full h-full flex items-center justify-center group">
                 <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain" />
                 <a 
                   href={generatedImage} 
                   download={`gemini-gen-${Date.now()}.png`}
                   className="absolute bottom-6 right-6 bg-white text-black px-4 py-2 rounded-lg font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                 >
                   <Download className="w-4 h-4" /> Save
                 </a>
               </div>
             ) : (
               <div className="text-zinc-700 flex flex-col items-center">
                 <ImagePlus className="w-12 h-12 mb-2 opacity-20" />
                 <span>Enter a prompt to start</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateView;
