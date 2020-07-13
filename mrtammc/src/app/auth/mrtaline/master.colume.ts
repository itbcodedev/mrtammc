export class MasterColume {
  MASTER_COLUMNDEFS = {
    wheelchair_boarding: [
      {name: 'empty', value: 0},
      {name: 'can be boarded', value: 1},
      {name: "can't on boarded", value: 2},
    ],
    location_type: [
      {name: 'empty', value: 0},
      {name: 'Station', value: 1},
      {name: 'Station entrance', value: 2},
      {name: 'Generic node', value: 3},
      {name: 'Boarding area', value: 4}
    ],
    agency_timezone: [
      {name: 'Asia/Bangkok', value: 'Asia/Bangkok'}
    ],
    agency_lang: [
      {name: 'th', value: 'th'},
      {name: 'en', value: 'en'},
    ],
    route_type: [
      {name: 'Tram, streetcar, or light rail', value: 0},
      {name: 'Subway or metro', value: 1},
      {name: 'Rail', value: 2},
      {name: 'Bus', value: 3},
      {name: 'Ferry', value: 4},
      {name: 'Cable car', value: 5},
      {name: 'Gondola', value: 6},
      {name: 'Funicular', value: 7},
    ]

  }
}
