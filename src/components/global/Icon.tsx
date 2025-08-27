import React, { lazy, Suspense } from "react";
import { LucideProps } from "lucide-react";

// Define the props for your Icon component
interface IconProps extends LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  // Use React.lazy with a dynamic import
  // The icon name is converted to kebab-case as required by lucide-react's file names
  const LucideIcon = lazy(() => {
    const formattedName = name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();
    return import(`lucide-react/dist/esm/icons/${formattedName}`);
  });

  return (
    <Suspense
      fallback={
        <span
          style={{ width: props.width || 24, height: props.height || 24 }}
        />
      }
    >
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
