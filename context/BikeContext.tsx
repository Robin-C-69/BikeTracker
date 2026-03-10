import { createContext, ReactNode, useContext } from "react";
import { useBike } from "@/hooks/useBike";
import { useBikeMutations } from "@/hooks/useBikeMutations";
import { Bike, CreateBikeRequest } from "@/database/models/BikeModel";
import { useBikeStore } from "@/stores/bikeStore";

interface BikeContextProps {
  bikes: Bike[];
  loading: boolean;
  error: string | null;
  createBike: (bike: CreateBikeRequest) => Promise<any>;
  updateBike: (id: number, bike: CreateBikeRequest) => Promise<any>;
  deleteBike: (id: number) => Promise<any>;
}

const BikeContext = createContext<BikeContextProps | undefined>(undefined);

export const BikeProvider = ({ children }: { children: ReactNode }) => {
  useBike();
  const mutations = useBikeMutations();
  const { bikes, loading, error } = useBikeStore();

  return (
    <BikeContext.Provider
      value={{
        bikes,
        loading,
        error,
        ...mutations,
      }}
    >
      {children}
    </BikeContext.Provider>
  );
};

export const useBikeContext = (): BikeContextProps => {
  const context = useContext(BikeContext);
  if (!context) {
    throw new Error("useBikeContext must be used within a BikeProvider");
  }
  return context;
};
