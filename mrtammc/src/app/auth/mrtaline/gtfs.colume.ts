export class GtfsEditor {
    constructor () {}
    GTFS_COLUMNDEFS = {
        agency: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_id', field: 'agency_id', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_name', field: 'agency_name', editable: true, suppressSizeToFit: false},

            {headerName: 'agency_url', field: 'agency_url', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_timezone', field: 'agency_timezone', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_lang', field: 'agency_lang', editable: true, suppressSizeToFit: false},

            {headerName: 'agency_phone', field: 'agency_phone', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_fare_url', field: 'agency_fare_url', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_email', field: 'agency_email', editable: true, suppressSizeToFit: false},

            {headerName: 'agency_bounds', field: 'agency_bounds', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_center', field: 'agency_bounds', editable: true, suppressSizeToFit: false}
        ],

        routes: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_id', field: 'agency_id', editable: true, suppressSizeToFit: false},
            {headerName: 'route_id', field: 'route_id', editable: true, suppressSizeToFit: false},

            {headerName: 'route_short_name', field: 'route_short_name', editable: true, suppressSizeToFit: false},
            {headerName: 'route_long_name', field: 'route_long_name', editable: true, suppressSizeToFit: false},
            {headerName: 'route_desc', field: 'route_desc', editable: true, suppressSizeToFit: false},

            {headerName: 'route_type', field: 'route_type', editable: true, suppressSizeToFit: false},
            {headerName: 'route_url', field: 'route_url', editable: true, suppressSizeToFit: false},
            {headerName: 'route_color', field: 'route_color', editable: true, suppressSizeToFit: false},
            {headerName: 'route_text_color', field: 'route_text_color', editable: true, suppressSizeToFit: false}
        ],

        trips: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'route_id', field: 'route_id', editable: true, suppressSizeToFit: false},
            {headerName: 'service_id', field: 'service_id', editable: true, suppressSizeToFit: false},

            {headerName: 'trip_id', field: 'trip_id'},
            {headerName: 'trip_headsign', field: 'trip_headsign', editable: true, suppressSizeToFit: false},
            {headerName: 'trip_short_name', field: 'trip_short_name', editable: true, suppressSizeToFit: false},

            {headerName: 'direction_id', field: 'direction_id', editable: true, suppressSizeToFit: false},
            {headerName: 'block_id', field: 'block_id', editable: true, suppressSizeToFit: false},
            {headerName: 'shape_id', field: 'shape_id', editable: true, suppressSizeToFit: false},

            {headerName: 'wheelchair_accessible', field: 'wheelchair_accessible', editable: true, suppressSizeToFit: false},
            {headerName: 'bikes_allowed', field: 'bikes_allowed', editable: true, suppressSizeToFit: false}
        ],

        stops: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_id', field: 'stop_id', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_code', field: 'stop_code', editable: true, suppressSizeToFit: false},

            {headerName: 'stop_name', field: 'stop_name', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_desc', field: 'stop_desc', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_lat', field: 'stop_lat', editable: true, suppressSizeToFit: false},

            {headerName: 'stop_lon', field: 'stop_lon', editable: true, suppressSizeToFit: false},
            {headerName: 'zone_id', field: 'zone_id', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_url', field: 'stop_url', editable: true, suppressSizeToFit: false},

            {headerName: 'location_type', field: 'location_type', editable: true, suppressSizeToFit: false},
            {headerName: 'parent_station', field: 'parent_station', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_timezone', field: 'stop_timezone', editable: true, suppressSizeToFit: false},

            {headerName: 'wheelchair_boarding', field: 'wheelchair_boarding', editable: true, suppressSizeToFit: false},
            {headerName: 'level_id', field: 'level_id', editable: true, suppressSizeToFit: false},
            {headerName: 'platform_code', field: 'platform_code',editable: true , suppressSizeToFit: false}
        ],


        stop_times: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'trip_id', field: 'trip_id', editable: true, suppressSizeToFit: false},
            {headerName: 'arrival_time', field: 'arrival_time', editable: true, suppressSizeToFit: false},
            {headerName: 'departure_time', field: 'departure_time', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_id', field: 'stop_id', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_sequence', field: 'stop_sequence', editable: true, suppressSizeToFit: false},
            {headerName: 'stop_headsign', field: 'stop_headsign', editable: true, suppressSizeToFit: false},
            {headerName: 'pickup_type', field: 'pickup_type', editable: true, suppressSizeToFit: false},
            {headerName: 'drop_off_type', field: 'drop_off_type', editable: true, suppressSizeToFit: false},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled', editable: true, suppressSizeToFit: false},
            {headerName: 'timepoint', field: 'timepoint', editable: true, suppressSizeToFit: false}
        ],

        calendars: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'service_id', field: 'service_id', editable: true, suppressSizeToFit: false},
            {headerName: 'monday', field: 'monday', editable: true, suppressSizeToFit: false},

            {headerName: 'tuesday', field: 'tuesday', editable: true, suppressSizeToFit: false},
            {headerName: 'wednesday', field: 'wednesday', editable: true, suppressSizeToFit: false},
            {headerName: 'thursday', field: 'thursday', editable: true, suppressSizeToFit: false},

            {headerName: 'friday', field: 'friday', editable: true, suppressSizeToFit: false},
            {headerName: 'saturday', field: 'saturday', editable: true, suppressSizeToFit: false},
            {headerName: 'sunday', field: 'sunday', editable: true, suppressSizeToFit: false},

            {headerName: 'start_date', field: 'start_date', editable: true, suppressSizeToFit: false},
            {headerName: 'end_date', field: 'end_date', editable: true, suppressSizeToFit: false}
        ],

        calendar_dates: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'service_id', field: 'service_id', editable: true, suppressSizeToFit: false},
            {headerName: 'date', field: 'date', editable: true},
            {headerName: 'exception_type', field: 'exception_type', editable: true, suppressSizeToFit: false}
        ],

        fare_attributes: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'agency_id', field: 'agency_id', editable: true, suppressSizeToFit: false},
            {headerName: 'fare_id', field: 'fare_id', editable: true, suppressSizeToFit: false},

            {headerName: 'price', field: 'price', editable: true, suppressSizeToFit: false},
            {headerName: 'currency_type', field: 'currency_type', editable: true, suppressSizeToFit: false},
            {headerName: 'payment_method', field: 'payment_method', editable: true, suppressSizeToFit: false},

            {headerName: 'transfers', field: 'transfers', editable: true, suppressSizeToFit: false},
            {headerName: 'transfer_duration', field: 'transfer_duration', editable: true, suppressSizeToFit: false}
        ],
        fare_rules: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'fare_id', field: 'fare_id', editable: true, suppressSizeToFit: false},
            {headerName: 'route_id', field: 'route_id', editable: true, suppressSizeToFit: false},
            {headerName: 'origin_id', field: 'origin_id', editable: true, suppressSizeToFit: false},
            {headerName: 'destination_id', field: 'destination_id', editable: true, suppressSizeToFit: false},
            {headerName: 'contains_id', field: 'contains_id', editable: true, suppressSizeToFit: false}
        ],
        shapes: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'shape_id', field: 'shape_id', editable: true, suppressSizeToFit: false},
            {headerName: 'shape_pt_lat', field: 'shape_pt_lat', editable: true, suppressSizeToFit: false},

            {headerName: 'shape_pt_lon', field: 'shape_pt_lon', editable: true, suppressSizeToFit: false},
            {headerName: 'shape_pt_sequence', field: 'shape_pt_sequence', editable: true, suppressSizeToFit: false},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled', editable: true, suppressSizeToFit: false}
        ],
        // shape_details: [
        //   {headerName: 'agency_key', field: 'agency_key', editable: true},
        //   {headerName: 'color', field: 'color', editable: true},
        //   {headerName: 'shape_id', field: 'shapeId', editable: true},
        //   {headerName: 'shape_long_name', field: 'shapeLongName', editable: true},
        //   {headerName: 'shape_short_name', field: 'shapeShortName', editable: true}
        // ],
        // periods: [
        //   {headerName: 'agency_key', field: 'agency_key', editable: true},
        //   {headerName: 'Period', field: 'Period', editable: true},
        //   {headerName: 'calendar_id', field: 'calendarId', editable: true},
        //   {headerName: 'endTime', field: 'endTime', editable: true},
        //   {headerName: 'frequency', field: 'frequency', editable: true},
        //   {headerName: 'num_trains', field: 'numTrains', editable: true},
        //   {headerName: 'start_time', field: 'startTime', editable: true}
        // ],
        pathways: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'pathway_id', field: 'pathway_id', editable: true, suppressSizeToFit: false},
            {headerName: 'from_stop_id', field: 'from_stop_id', editable: true, suppressSizeToFit: false},

            {headerName: 'to_stop_id', field: 'to_stop_id', editable: true, suppressSizeToFit: false},
            {headerName: 'pathway_mode', field: 'pathway_mode', editable: true, suppressSizeToFit: false},
            {headerName: 'is_bidirectional', field: 'is_bidirectional', editable: true, suppressSizeToFit: false}
        ],
        frequencies: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'trip_id', field: 'trip_id', editable: true, suppressSizeToFit: false},
            {headerName: 'start_time', field: 'start_time', editable: true, suppressSizeToFit: false},

            {headerName: 'end_time', field: 'end_time', editable: true, suppressSizeToFit: false},
            {headerName: 'headway_secs', field: 'headway_secs', editable: true, suppressSizeToFit: false},
            {headerName: 'exact_times', field: 'exact_times', editable: true, suppressSizeToFit: false}
        ],
        transfers: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'from_stop_id', field: 'from_stop_id', editable: true, suppressSizeToFit: false},
            {headerName: 'to_stop_id', field: 'to_stop_id', editable: true, suppressSizeToFit: false},

            {headerName: 'transfer_type', field: 'transfer_type', editable: true, suppressSizeToFit: false},
            {headerName: 'min_transfer_time', field: 'min_transfer_time', editable: true, suppressSizeToFit: false}
        ],
        levels: [
            {headerName: 'agency_key', field: 'agency_key', editable: true, suppressSizeToFit: false},
            {headerName: 'level_id', field: 'level_id', editable: true, suppressSizeToFit: false},
            {headerName: 'level_index', field: 'level_index', editable: true, suppressSizeToFit: false},

            {headerName: 'level_name', field: 'level_name', editable: true, suppressSizeToFit: false}
        ]
        // feed_info: [
        //     {headerName: 'agency_key', field: 'agency_key', editable: true},
        //     {headerName: 'feed_publisher_name', field: 'feed_publisher_name', editable: true},
        //     {headerName: 'feed_publisher_url', field: 'feed_publisher_url', editable: true},
        //     {headerName: 'feed_lang', field: 'feed_lang', editable: true},
        //     {headerName: 'feed_start_date', field: 'feed_start_date', editable: true},
        //     {headerName: 'feed_end_date', field: 'feed_end_date', editable: true},
        //     {headerName: 'feed_version', field: 'feed_version', editable: true}
        // ]
    };
}
