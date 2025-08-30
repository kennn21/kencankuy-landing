import { Loader2 } from "lucide-react";

const KencanLoader = ({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) => (
  <>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <Loader2 className="relative h-12 w-12 animate-spin text-pink-500" />
    </div>
    <div className="flex flex-col items-center justify-center gap-2">
      {title && <p className="mt-4 text-gray-600 animate-pulse">{title}</p>}
      {subtitle && (
        <p className="mt-4 text-gray-600 animate-pulse">{subtitle}</p>
      )}
    </div>
  </>
);

export default KencanLoader;
