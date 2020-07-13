export class GtfsEditor {
    constructor () {}
    GTFS_COLUMNDEFS = {
        agency: [
            {headerName: 'agency_id', field: 'agency_id', suppressAutoSize: false},
            {headerName: 'agency_name', field: 'agency_name'},
            {headerName: 'agency_url', field: 'agency_url'},
            {headerName: 'agency_timezone', field: 'agency_timezone'},
            {headerName: 'agency_lang', field: 'agency_lang'},
            {headerName: 'agency_phone', field: 'agency_phone'},
            {headerName: 'agency_fare_url', field: 'agency_fare_url'},
            {headerName: 'agency_email', field: 'agency_email'}
        ],
        stops: [
            {headerName: 'stop_id', field: 'stop_id'},
            {headerName: 'stop_code', field: 'stop_code'},
            {headerName: 'stop_name', field: 'stop_name'},
            {headerName: 'stop_desc', field: 'stop_desc'},
            {headerName: 'stop_lat', field: 'stop_lat'},
            {headerName: 'stop_lon', field: 'stop_lon'},
            {headerName: 'stop_distance', field: 'stop_distance'},
            {headerName: 'zone_id', field: 'zone_id'},
            {headerName: 'stop_url', field: 'stop_url'},
            {headerName: 'location_type', field: 'location_type'},
            {headerName: 'parent_station', field: 'parent_station'},
            {headerName: 'stop_timezone', field: 'stop_timezone'},
            {headerName: 'wheelchair_boarding', field: 'wheelchair_boarding'},
            {headerName: 'icon', field: 'icon'},
        ],
        routes: [
            {headerName: 'route_id', field: 'route_id'},
            {headerName: 'agency_id', field: 'agency_id'},
            {headerName: 'route_short_name', field: 'route_short_name'},
            {headerName: 'route_long_name', field: 'route_long_name'},
            {headerName: 'route_desc', field: 'route_desc'},
            {headerName: 'route_type', field: 'route_type'},
            {headerName: 'route_url', field: 'route_url'},
            {headerName: 'route_color', field: 'route_color'},
            {headerName: 'route_text_color', field: 'route_text_color'},
            {headerName: 'route_sort_order', field: 'route_sort_order'}
        ],
        trips: [
            {headerName: 'route_id', field: 'route_id'},
            {headerName: 'service_id', field: 'service_id'},
            {headerName: 'trip_id', field: 'trip_id'},
            {headerName: 'trip_headsign', field: 'trip_headsign'},
            {headerName: 'trip_short_name', field: 'trip_short_name'},
            {headerName: 'direction_id', field: 'direction_id'},
            {headerName: 'block_id', field: 'block_id'},
            {headerName: 'shape_id', field: 'shape_id'},
            {headerName: 'wheelchair_accessible', field: 'wheelchair_accessible'},
            {headerName: 'bikes_allowed', field: 'bikes_allowed'}
        ],
        stop_times: [
            {headerName: 'trip_id', field: 'trip_id'},
            {headerName: 'arrival_time', field: 'arrival_time'},
            {headerName: 'departure_time', field: 'departure_time'},
            {headerName: 'stop_id', field: 'stop_id'},
            {headerName: 'stop_sequence', field: 'stop_sequence'},
            {headerName: 'stop_headsign', field: 'stop_headsign'},
            {headerName: 'pickup_type', field: 'pickup_type'},
            {headerName: 'drop_off_type', field: 'drop_off_type'},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled'},
            {headerName: 'timepoint', field: 'timepoint'}
        ],
        calendar: [
            {headerName: 'service_id', field: 'service_id'},
            {headerName: 'monday', field: 'monday'},
            {headerName: 'tuesday', field: 'tuesday'},
            {headerName: 'wednesday', field: 'wednesday'},
            {headerName: 'thursday', field: 'thursday'},
            {headerName: 'friday', field: 'friday'},
            {headerName: 'saturday', field: 'saturday'},
            {headerName: 'sunday', field: 'sunday'},
            {headerName: 'start_date', field: 'start_date'},
            {headerName: 'end_date', field: 'end_date'}
        ],
        calendar_dates: [
            {headerName: 'service_id', field: 'service_id'},
            {headerName: 'date', field: 'date'},
            {headerName: 'exception_type', field: 'exception_type'}
        ],
        fare_attributes: [
            {headerName: 'fare_id', field: 'fare_id'},
            {headerName: 'price', field: 'price'},
            {headerName: 'currency_type', field: 'currency_type'},
            {headerName: 'payment_method', field: 'payment_method'},
            {headerName: 'transfers', field: 'transfers'},
            {headerName: 'agency_id', field: 'agency_id'},
            {headerName: 'transfer_duration', field: 'transfer_duration'}
        ],
        fare_rules: [
            {headerName: 'fare_id', field: 'fare_id'},
            {headerName: 'route_id', field: 'route_id'},
            {headerName: 'origin_id', field: 'origin_id'},
            {headerName: 'destination_id', field: 'destination_id'},
            {headerName: 'contains_id', field: 'contains_id'}
        ],
        shapes: [
            {headerName: 'shape_id', field: 'shape_id'},
            {headerName: 'shape_pt_lat', field: 'shape_pt_lat'},
            {headerName: 'shape_pt_lon', field: 'shape_pt_lon'},
            {headerName: 'shape_pt_sequence', field: 'shape_pt_sequence'},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled'}
        ],
        frequencies: [
            {headerName: 'trip_id', field: 'trip_id'},
            {headerName: 'start_time', field: 'start_time'},
            {headerName: 'end_time', field: 'end_time'},
            {headerName: 'headway_secs', field: 'headway_secs'},
            {headerName: 'exact_times', field: 'exact_times'}
        ],
        transfers: [
            {headerName: 'from_stop_id', field: 'from_stop_id'},
            {headerName: 'to_stop_id', field: 'to_stop_id'},
            {headerName: 'transfer_type', field: 'transfer_type'},
            {headerName: 'min_transfer_time', field: 'min_transfer_time'}
        ],
        feed_info: [
            {headerName: 'feed_publisher_name', field: 'feed_publisher_name'},
            {headerName: 'feed_publisher_url', field: 'feed_publisher_url'},
            {headerName: 'feed_lang', field: 'feed_lang'},
            {headerName: 'feed_start_date', field: 'feed_start_date'},
            {headerName: 'feed_end_date', field: 'feed_end_date'},
            {headerName: 'feed_version', field: 'feed_version'}
        ]
    };
}
