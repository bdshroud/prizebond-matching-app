import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
        <Search className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          404 - পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা ঠিকানাটি সঠিক নয়।
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>হোম পেজে ফিরুন</span>
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/50 text-foreground font-semibold text-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ড্যাশবোর্ড</span>
        </Link>
      </div>
    </div>
  );
}
