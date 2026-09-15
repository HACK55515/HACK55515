import React, { useState, useRef } from 'react';
import { X, Upload, Music } from 'lucide-react';
import { Track } from '../types/music';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (tracks: Track[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    setUploading(true);
    
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    const tracks: Track[] = [];

    for (const file of audioFiles) {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      
      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          const track: Track = {
            id: Math.random().toString(36).substr(2, 9),
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Unknown Artist',
            duration: audio.duration,
            file,
            url,
            uploadedAt: new Date(),
          };
          tracks.push(track);
          resolve(null);
        });
      });
    }

    onUpload(tracks);
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Upload Music</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Music className="w-8 h-8 text-white" />
              )}
            </div>
            
            {uploading ? (
              <p className="text-white">Processing files...</p>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-white mb-2">Drag & drop your music files here</p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Files</span>
                </button>
              </>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <p className="text-gray-400 text-xs text-center mt-4">
          Supported formats: MP3, WAV, FLAC, M4A, OGG
        </p>
      </div>
    </div>
  );
};