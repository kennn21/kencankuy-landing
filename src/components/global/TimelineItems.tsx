import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePlace } from "@/types/date-plans";
import {
  ExternalLink,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  GlassWater,
} from "lucide-react";

interface TimelineItemProps {
  place: DatePlace;
  index: number;
}

export function TimelineItem({ place, index }: TimelineItemProps) {
  const photoUrl = place.cachedPhotoUrl;
  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${place.latitude},${place.longitude}&zoom=15&size=600x300&markers=color:red%7C${place.latitude},${place.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  const openInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.name
  )}&query_place_id=${place.googlePlaceId}`;

  const isRightAligned = index % 2 !== 0;

  return (
    <div className="timeline-item">
      <div className="timeline-icon">
        {index === 0 && <Sparkles size={20} />}
        {index === 1 && <UtensilsCrossed size={20} />}
        {index === 2 && <GlassWater size={20} />}
      </div>
      <div className="timeline-card">
        <Card className="w-full overflow-hidden shadow-lg">
          <div className="relative w-full h-40 bg-gray-200">
            <img
              src={photoUrl || mapImageUrl}
              alt={`Photo of ${place.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <CardHeader className={isRightAligned ? "text-right" : "text-left"}>
            <CardTitle className="text-lg sm:text-xl">{place.name}</CardTitle>
            <CardDescription
              className={`flex items-center text-xs sm:text-sm text-gray-500 ${
                isRightAligned ? "justify-end" : "justify-start"
              }`}
            >
              <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
              {place.address}
            </CardDescription>
          </CardHeader>
          <CardFooter
            className={`pb-4 ${
              isRightAligned ? "justify-end" : "justify-start"
            }`}
          >
            <a
              href={openInMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-pink-600 hover:text-pink-800 font-semibold"
            >
              Open in Google Maps
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
