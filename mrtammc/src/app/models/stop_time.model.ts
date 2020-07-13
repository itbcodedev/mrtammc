export interface StopTime {
    tripId: string;
    arrivalTime: string;
    departureTime: string;
    stopId: string;
    stopSequence: number;
    stopHeadsign: string;
    pickupType: number;
    dropOffType: number;
    shapeDistTraveled: number;
    timepoint: number;
}
