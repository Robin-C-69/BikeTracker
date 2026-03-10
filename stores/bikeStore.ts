import { Bike } from "@/database/models/BikeModel";
import { create } from "zustand/react";

interface BikeStore {
  bikes: Bike[];
  loading: boolean;
  error: string | null;
  setBikes: (bikes: Bike[]) => void;
  addBike: (bike: Bike) => void;
  removeBike: (id: number) => void;
  updateBike: (id: number, bike: Bike) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBikeStore = create<BikeStore>((set) => ({
  bikes: [],
  loading: false,
  error: null,
  setBikes: (bikes) => set({ bikes }),
  addBike: (bike) => set((prev) => ({ bikes: [...prev.bikes, bike] })),
  removeBike: (id) =>
    set((prev) => ({ bikes: prev.bikes.filter((bike) => bike.id !== id) })),
  updateBike: (id, bike) =>
    set((state) => ({
      bikes: state.bikes.map((b) => (b.id === id ? bike : b)),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
