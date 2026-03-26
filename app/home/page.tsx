"use client";
import { Suspense } from 'react';
// In your page or parent component
import ChatInterface from '../../components/chat-interface';

export default function Page() {
  return(
 <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
  <ChatInterface />;
   </Suspense>
)
}