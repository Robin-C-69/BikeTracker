import { createContext, ReactNode, useContext } from "react";
import { useBike } from "@/hooks/useBike";
import { useBikeMutations } from "@/hooks/useBikeMutations";
import { Bike, CreateBikeRequest } from "@/database/models/BikeModel";

interface BikeContextProps {
  bikes: Bike[];
  loading: boolean;
  error: string | null;
  getAllBikes: (page?: number, limit?: number) => Promise<Bike[]>;
  getBikeById: (id: number) => Promise<Bike | null>;
  refreshBikes: () => Promise<void>;
  createBike: (bike: CreateBikeRequest) => Promise<any>;
  updateBike: (id: number, bike: CreateBikeRequest) => Promise<any>;
  deleteBike: (id: number) => Promise<any>;
}

const BikeContext = createContext<BikeContextProps | undefined>(undefined);

export const BikeProvider = ({ children }: { children: ReactNode }) => {
  const {
    bikes,
    loading: queryLoading,
    error: queryError,
    ...queries
  } = useBike();
  const mutations = useBikeMutations();

  return (
    <BikeContext.Provider
      value={{
        bikes,
        loading: queryLoading,
        error: queryError,
        ...queries,
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
