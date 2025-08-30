import {
  Heart,
  Paintbrush,
  Utensils,
  Mountain,
  Wind,
  Trophy,
  Ticket,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeIconProps {
  theme: string;
  className?: string;
}

export const ThemeIcon = ({ theme, className }: ThemeIconProps) => {
  const iconProps = {
    className: cn("h-8 w-8 mb-4 text-pink-400", className),
  };

  switch (theme.toLowerCase()) {
    case "romantic":
      return <Heart {...iconProps} />;
    case "artsy":
      return <Paintbrush {...iconProps} />;
    case "foodie":
      return <Utensils {...iconProps} />;
    case "adventurous":
      return <Mountain {...iconProps} />;
    case "relaxing":
      return <Wind {...iconProps} />;
    case "sporty":
      return <Trophy {...iconProps} />;
    case "entertainment":
      return <Ticket {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};
