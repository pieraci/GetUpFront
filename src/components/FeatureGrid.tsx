import React from 'react';
import { Construction, Clock, MessageSquareMore } from 'lucide-react';

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="flex flex-col items-center text-center p-3">
        <Construction className="w-8 h-8 text-orange-500 mb-2" />
        <span className="text-gray-300 text-sm">Project Tracking</span>
      </div>
      <div className="flex flex-col items-center text-center p-3">
        <Clock className="w-8 h-8 text-orange-500 mb-2" />
        <span className="text-gray-300 text-sm">Real-time Updates</span>
      </div>
      <div className="flex flex-col items-center text-center p-3">
        <MessageSquareMore className="w-8 h-8 text-orange-500 mb-2" />
        <span className="text-gray-300 text-sm">Clear Communication</span>
      </div>
    </div>
  );
}