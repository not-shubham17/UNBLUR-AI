import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { Wand2, Upload, Loader2, ArrowRight } from 'lucide-react';

const EditView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleEdit = async () => {
    if (!selectedFile || !prompt) return;
    setIsLoading(true);
    try {
      const url = await editImage(selectedFile, prompt);
      setResultUrl(url);
    } catch (e) {
      alert("Editing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wand2 className="text-amber-400" />
          Magic Edit
        </h2>
        <p className="text-zinc-400">Modify images using text instructions with Gemini 2.5 Flash.</p>
      </div>

      <div className="space-y-6">
        {/* Input Area */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
           <div className="grid md:grid-cols-3 gap-6 items-start">
              {/* Image Upload */}
              <div className="bg-zinc-950 border-2 border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl h-48 md:h-full flex flex-col items-center justify-center relative overflow-hidden transition-colors">
                {previewUrl ? (
                  <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <span className="text-zinc-500 text-sm">Upload Source</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              {/* Text Input */}
              <div className="md:col-span-2 flex flex-col h-full gap-4">
                 <div className="flex-1">
                   <label className="text-zinc-400 text-sm mb-2 block">Instructions</label>
                   <textarea
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     placeholder="e.g. 'Add a retro filter', 'Make it snowy', 'Remove the background'"
                     className="w-full h-32 bg-black/20 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
                   />
                 </div>
                 <button
                   onClick={handleEdit}
                   disabled={!selectedFile || !prompt || isLoading}
                   className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                   Apply Magic Edit
                 </button>
              </div>
           </div>
        </div>

        {/* Result Area */}
        { (isLoading || resultUrl) && (
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center">
             <h3 className="text-zinc-400 text-sm font-medium mb-4 self-start">Result</h3>
             <div className="relative max-w-full">
               {isLoading ? (
                 <div className="h-64 w-full flex items-center justify-center">
                   <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                 </div>
               ) : (
                 <img src={resultUrl!} alt="Edited" className="max-h-[500px] rounded-lg shadow-2xl" />
               )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditView;
