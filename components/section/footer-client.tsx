// app/components/ui/Footer.tsx  (server component)
export default function Footer() {
  return (
    <footer className="text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-6xl mx-auto py-6 text-center">
        © {new Date().getFullYear()} SMEPS Forms. All rights reserved.
      </div>
    </footer>
  );
}
