export interface IBike {
    id: number,
    name: string,
    brand: string,
    created_at: string,
    updated_at: string,
}

export interface ICreateBikeRequest {
    name: string,
    brand: string
}

export interface IUpdateBikeRequest {
    id: number,
    name: string,
    brand: string
}

export class BikeModel {
    static validate(bike: ICreateBikeRequest): string[] {
        const errors: string[] = []

        if (bike.name.length === 0) {
            errors.push("Name is required");
        }

        return errors
    }
}