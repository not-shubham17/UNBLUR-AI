import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Upload, Search, Loader2, ScanEye } from 'lucide-react';

const AnalyzeView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const text = await analyzeImage(selectedFile, prompt);
      setResult(text);
    } catch (err) {
      setResult("Error analyzing image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ScanEye className="text-emerald-400" />
          Image Analysis
        </h2>
        <p className="text-zinc-400">Upload an image and ask Gemini 3 Pro to understand it.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="text-center p-4">
                 <Upload className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
                 <span className="text-zinc-500 text-sm">Upload Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-sm h-24 resize-none"
            placeholder="What should I look for?"
          />

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
            Analyze
          </button>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[300px]">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Analysis Result</h3>
          {result ? (
            <p className="text-zinc-100 whitespace-pre-wrap leading-relaxed">{result}</p>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
              Analysis will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeView;
