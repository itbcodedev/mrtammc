export interface Stop {
    stopId: string;
    stopCode: string;
    stopName: string;
    stopDesc: string;
    stopLat: number;
    stopLon: number;
    zoneId: string;
    stopUrl: string;
    locationType: number;
    parentStation: number;
    stopTimezone: string;
    wheelchairBoarding: number;
    arrivalTime: string;
    departureTime: string;
    stopSequence: number;
    Minutes: number;
    stopDistance: number;
    icon: string;
}