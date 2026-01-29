
import React, { useState, useEffect } from 'react';
import Uploader from './components/Uploader';
import { generatePixarAvatar } from './services/geminiService';
import { GenerationState } from './types';

const LOADING_MESSAGES = [
  "正在连接魔法工坊...",
  "正在绘制你的皮克斯之眼...",
  "正在渲染3D灯光...",
  "注入角色个性中...",
  "快好了，最后一点魔法粉末...",
  "你的卡通化身即将登场！"
];

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ base64: string; type: string } | null>(null);
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultUrl: null,
    statusMessage: LOADING_MESSAGES[0]
  });

  // Cycle through loading messages
  useEffect(() => {
    let interval: any;
    if (state.isGenerating) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % LOADING_MESSAGES.length;
        setState(prev => ({ ...prev, statusMessage: LOADING_MESSAGES[index] }));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [state.isGenerating]);

  const handleImageSelected = (base64: string, type: string) => {
    setSelectedImage({ base64, type });
    setState(prev => ({ ...prev, resultUrl: null, error: null }));
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null, resultUrl: null }));

    try {
      const avatarUrl = await generatePixarAvatar(selectedImage.base64, selectedImage.type);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        resultUrl: avatarUrl
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message
      }));
    }
  };

  const downloadImage = () => {
    if (!state.resultUrl) return;
    const link = document.createElement('a');
    link.href = state.resultUrl;
    link.download = `pixar-avatar-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-8 w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent pixar-gradient">
          Pixar Avatar Magic
        </h1>
        <p className="text-gray-600 text-lg">
          开启你的动画冒险：将真实照片转化为梦幻的皮克斯角色
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Input */}
        <div className="glass-card rounded-3xl p-6 shadow-xl w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="font-bold">1</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">上传你的照片</h2>
          </div>
          
          <Uploader 
            onImageSelected={handleImageSelected} 
            selectedImage={selectedImage?.base64 || null} 
          />

          <div className="mt-8">
            <button
              onClick={handleGenerate}
              disabled={!selectedImage || state.isGenerating}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                ${!selectedImage || state.isGenerating 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'pixar-gradient text-white hover:opacity-90 hover:shadow-xl'}`}
            >
              {state.isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  正在施展魔法...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-sparkles"></i>
                  生成用户画像
                </>
              )}
            </button>
          </div>

          {state.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <i className="fas fa-exclamation-circle mt-0.5"></i>
              {state.error}
            </div>
          )}
        </div>

        {/* Right: Output */}
        <div className="glass-card rounded-3xl p-6 shadow-xl w-full h-full min-h-[400px] flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <span className="font-bold">2</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">魔法生成结果</h2>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center border-2 border-gray-100 rounded-2xl bg-white bg-opacity-50 relative overflow-hidden">
            {state.isGenerating ? (
              <div className="text-center p-8">
                <div className="relative mb-6">
                  <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <i className="fas fa-magic absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-blue-500 float"></i>
                </div>
                <p className="text-blue-600 font-medium text-lg animate-pulse">{state.statusMessage}</p>
                <p className="text-gray-400 text-sm mt-2">由于AI绘图较复杂，可能需要30秒左右...</p>
              </div>
            ) : state.resultUrl ? (
              <div className="w-full h-full p-2 flex flex-col">
                <img 
                  src={state.resultUrl} 
                  alt="Avatar Result" 
                  className="w-full aspect-square object-cover rounded-xl shadow-inner mb-4"
                />
                <button
                  onClick={downloadImage}
                  className="mt-auto w-full py-3 bg-gray-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <i className="fas fa-download"></i> 保存到相册
                </button>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">
                <i className="fas fa-image text-5xl mb-4 opacity-20"></i>
                <p>头像将在这里显示</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-gray-500 text-sm w-full max-w-2xl">
        <p className="mb-2">基于 Google Gemini 2.5 Flash 视觉引擎构建</p>
        <p>&copy; 2024 Pixar Avatar Magic. 让每个瞬间都充满动画色彩.</p>
      </footer>
    </div>
  );
};

export default App;
