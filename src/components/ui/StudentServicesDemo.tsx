"use client";

import { useState } from "react";
import { Folder, FileCode, FileText, ChevronRight, Play, CheckCircle } from "lucide-react";

export default function StudentServicesDemo() {
  const [activeFile, setActiveFile] = useState("app.py");

  const files = [
    { name: "app.py", type: "python", icon: <FileCode size={14} className="text-blue-400" /> },
    { name: "model.h5", type: "binary", icon: <FileText size={14} className="text-gray-400" /> },
    { name: "requirements.txt", type: "text", icon: <FileText size={14} className="text-gray-400" /> },
    { name: "project_report.pdf", type: "pdf", icon: <FileText size={14} className="text-red-400" /> },
  ];

  const codeSnippets: Record<string, string> = {
    "app.py": `import tensorflow as tf
from flask import Flask, request, jsonify

app = Flask(__name__)
model = tf.keras.models.load_model('model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    prediction = model.predict([data['features']])
    return jsonify({'result': float(prediction[0])})

if __name__ == '__main__':
    app.run(port=5000)`,
    "requirements.txt": `tensorflow==2.10.0
flask==2.2.2
numpy==1.23.4
pandas==1.5.0`,
    "model.h5": `Binary file (Weights & Biases data)
Cannot render content in text editor.`,
    "project_report.pdf": `PDF Document
Final Year Academic Project Documentation
Chapter 1: Introduction...
(File preview available in full viewer)`
  };

  return (
    <div className="w-full bg-[#050505] border border-cmf-border p-6 md:p-12 rounded-xl relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,168,76,0.05)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="text-center mb-10 relative z-10">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.2em] mb-2 block">ACADEMIC EXCELLENCE</span>
        <h3 className="text-3xl text-white font-display">Project Infrastructure</h3>
        <p className="text-white/40 font-light text-sm mt-2 max-w-lg mx-auto">We provide comprehensive guidance, clean code structures, and exhaustive documentation for high-grade academic projects.</p>
      </div>

      <div className="w-full max-w-3xl border border-white/10 rounded-lg overflow-hidden bg-[#0a0a09] relative z-10 flex shadow-2xl">
        
        {/* Sidebar */}
        <div className="w-1/3 bg-[#111] border-r border-white/5 p-4 hidden md:block">
          <div className="flex items-center gap-2 text-white/80 font-mono text-xs mb-6 px-2">
            <Folder size={14} className="text-cmf-gold" fill="currentColor" />
            <span>Final_Year_Project</span>
          </div>

          <div className="flex flex-col">
            {files.map(f => (
              <button 
                key={f.name}
                onClick={() => setActiveFile(f.name)}
                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded text-xs font-mono transition-colors ${activeFile === f.name ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
              >
                {activeFile === f.name && <ChevronRight size={12} className="text-cmf-gold absolute -ml-4" />}
                {f.icon}
                {f.name}
              </button>
            ))}
          </div>

          <div className="mt-12 p-3 bg-cmf-gold/10 border border-cmf-gold/20 rounded text-center">
             <CheckCircle size={20} className="text-cmf-gold mx-auto mb-2" />
             <div className="text-cmf-gold text-[10px] font-mono tracking-widest uppercase">Plagiarism Free</div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161616] border-b border-white/5 text-xs font-mono text-white/60">
             <span className="text-cmf-gold px-3 py-1 bg-cmf-gold/10 rounded border border-cmf-gold/20">{activeFile}</span>
             <div className="ml-auto flex gap-2">
               <button className="flex items-center gap-1 px-3 py-1 bg-[#222] hover:bg-[#333] transition-colors rounded text-white"><Play size={10} className="text-green-400" /> Run</button>
             </div>
          </div>
          
          <div className="p-6 font-mono text-xs leading-relaxed text-[#c9d1d9] overflow-x-auto">
            <pre>
              <code dangerouslySetInnerHTML={{ __html: codeSnippets[activeFile].replace(/import|from|return|def|if|__name__|__main__|class/g, '<span class="text-[#ff7b72]">$&</span>').replace(/Flask|load_model|predict|request|jsonify/g, '<span class="text-[#d2a8ff]">$&</span>').replace(/'.*?'/g, '<span class="text-[#a5d6ff]">$&</span>') }} />
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
