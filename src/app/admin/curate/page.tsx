"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil } from "lucide-react";
import { FullPlace } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { kencanApi } from "@/lib/api-list";

// Define the type for the form data, which is a flattened version of FullPlace
type PlaceFormData = {
  name: string;
  category: string;
  activityType: string | null;
  priceMin: number | null;
  priceMax: number | null;
  boostedRate: number;
};

export default function CuratePage() {
  const [places, setPlaces] = useState<FullPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<FullPlace | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const form = useForm<PlaceFormData>();

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const response = await kencanApi.places.getAll.call({
          query: { page, limit: 10, search },
        });
        setPlaces(response.data.data);
        setLastPage(response.data.lastPage);
      } catch (error) {
        toast.error("Failed to fetch places.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaces();
  }, [page, search]);

  const handleEdit = (place: FullPlace) => {
    setSelectedPlace(place);
    form.reset({
      name: place.name,
      category: place.category,
      activityType: place.activityType,
      priceMin: place.extension?.priceMin,
      priceMax: place.extension?.priceMax,
      boostedRate: place.extension?.boostedRate,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: PlaceFormData) => {
    if (!selectedPlace) return;
    try {
      // Separate the nested extension data from the main place data
      const { priceMin, priceMax, boostedRate, ...placeData } = data;
      const payload = {
        ...placeData,
        extension: {
          priceMin: Number(priceMin) || null,
          priceMax: Number(priceMax) || null,
          boostedRate: Number(boostedRate) || 1.0,
        },
      };

      await kencanApi.places.update.call({
        params: { id: selectedPlace.id },
        data: payload,
      });
      toast.success("Place updated successfully!");

      // Correctly update the local state
      // @ts-expect-error type
      setPlaces((currentPlaces) =>
        currentPlaces.map((p) =>
          p.id === selectedPlace.id ? { ...p, ...payload } : p
        )
      );
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update place.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold font-playfair mb-6">Curate Places</h1>
      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-sm"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Activity Type</TableHead>
              <TableHead>Price Min</TableHead>
              <TableHead>Price Max</TableHead>
              <TableHead>Boost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-48">
                  <Loader2 className="animate-spin mx-auto text-pink-500" />
                </TableCell>
              </TableRow>
            ) : (
              places.map((place) => (
                <TableRow key={place.id}>
                  <TableCell className="font-medium">{place.name}</TableCell>
                  <TableCell>{place.category}</TableCell>
                  <TableCell>{place.activityType || "N/A"}</TableCell>
                  <TableCell>{place.extension?.priceMin ?? "N/A"}</TableCell>
                  <TableCell>{place.extension?.priceMax ?? "N/A"}</TableCell>
                  <TableCell>{place.extension?.boostedRate ?? 1.0}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(place)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {lastPage}
        </span>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= lastPage}
        >
          Next
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit: {selectedPlace?.name}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <Input {...form.register("name")} placeholder="Name" />
            <Input
              {...form.register("category")}
              placeholder="Category (e.g., ROMANTIC)"
            />
            <Input
              {...form.register("activityType")}
              placeholder="Activity Type (e.g., DINNER)"
            />
            <Input
              {...form.register("priceMin")}
              type="number"
              placeholder="Price Min"
            />
            <Input
              {...form.register("priceMax")}
              type="number"
              placeholder="Price Max"
            />
            <Input
              {...form.register("boostedRate")}
              type="number"
              placeholder="Boost Rate"
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
