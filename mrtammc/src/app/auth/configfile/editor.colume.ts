export class GtfsEditor {
    constructor () {}
    GTFS_COLUMNDEFS = {
        agency: [
            {headerName: 'agency_id', field: 'agency_id', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_name', field: 'agency_name', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_url', field: 'agency_url', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_timezone', field: 'agency_timezone', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_lang', field: 'agency_lang', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_phone', field: 'agency_phone', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_fare_url', field: 'agency_fareUrl', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_email', field: 'agency_email', editable: true,suppressSizeToFit: false}
        ],
        stops: [
            {headerName: 'stop_id', field: 'stop_id', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_code', field: 'stop_code', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_name', field: 'stop_name', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_desc', field: 'stop_desc', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_lat', field: 'stop_lat', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_lon', field: 'stop_lon', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_distance', field: 'stop_distance', editable: true,suppressSizeToFit: false},
            {headerName: 'zone_id', field: 'zone_id', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_url', field: 'stop_url', editable: true,suppressSizeToFit: false},
            {headerName: 'location_type', field: 'location_type', editable: true,suppressSizeToFit: false},
            {headerName: 'parent_station', field: 'parent_station', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_timezone', field: 'stop_timezone', editable: true,suppressSizeToFit: false},
            {headerName: 'wheelchair_boarding', field: 'wheelchair_boarding', editable: true,suppressSizeToFit: false},
            {headerName: 'icon', field: 'icon',suppressSizeToFit: false},
        ],
        routes: [
            {headerName: 'route_id', field: 'route_id', editable: true,suppressSizeToFit: false},
            {headerName: 'agency_id', field: 'agency_id', editable: true,suppressSizeToFit: false},
            {headerName: 'route_short_name', field: 'route_short_name', editable: true,suppressSizeToFit: false},
            {headerName: 'route_long_name', field: 'route_long_name', editable: true,suppressSizeToFit: false},
            {headerName: 'route_desc', field: 'route_desc', editable: true,suppressSizeToFit: false},
            {headerName: 'route_type', field: 'route_type', editable: true,suppressSizeToFit: false},
            {headerName: 'route_url', field: 'route_url', editable: true,suppressSizeToFit: false},
            {headerName: 'route_color', field: 'route_color', editable: true,suppressSizeToFit: false},
            {headerName: 'route_text_color', field: 'route_text_color', editable: true,suppressSizeToFit: false},
            {headerName: 'route_sort_order', field: 'route_sort_order', editable: true,suppressSizeToFit: false}
        ],
        trips: [
            {headerName: 'route_id', field: 'route_id', editable: true,suppressSizeToFit: false},
            {headerName: 'service_id', field: 'service_id', editable: true,suppressSizeToFit: false},
            {headerName: 'trip_id', field: 'trip_id'},
            {headerName: 'trip_headsign', field: 'trip_headsign', editable: true,suppressSizeToFit: false},
            {headerName: 'trip_short_name', field: 'trip_short_name', editable: true,suppressSizeToFit: false},
            {headerName: 'direction_id', field: 'direction_id', editable: true,suppressSizeToFit: false},
            {headerName: 'block_id', field: 'block_id', editable: true,suppressSizeToFit: false},
            {headerName: 'shape_id', field: 'shape_id', editable: true,suppressSizeToFit: false},
            {headerName: 'wheelchair_accessible', field: 'wheelchair_accessible', editable: true,suppressSizeToFit: false},
            {headerName: 'bikes_allowed', field: 'bikes_allowed', editable: true,suppressSizeToFit: false}
        ],
        stop_times: [
            {headerName: 'trip_id', field: 'trip_id', editable: true,suppressSizeToFit: false},
            {headerName: 'arrival_time', field: 'arrival_time', editable: true,suppressSizeToFit: false},
            {headerName: 'departure_time', field: 'departure_time', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_id', field: 'stop_id', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_sequence', field: 'stop_sequence', editable: true,suppressSizeToFit: false},
            {headerName: 'stop_headsign', field: 'stop_headsign', editable: true,suppressSizeToFit: false},
            {headerName: 'pickup_type', field: 'pickup_type', editable: true,suppressSizeToFit: false},
            {headerName: 'drop_off_type', field: 'drop_off_type', editable: true,suppressSizeToFit: false},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled', editable: true,suppressSizeToFit: false},
            {headerName: 'timepoint', field: 'timepoint', editable: true,suppressSizeToFit: false}
        ],
        calendar: [
            {headerName: 'service_id', field: 'service_id', editable: true,suppressSizeToFit: false},
            {headerName: 'monday', field: 'monday', editable: true,suppressSizeToFit: false},
            {headerName: 'tuesday', field: 'tuesday', editable: true,suppressSizeToFit: false},
            {headerName: 'wednesday', field: 'wednesday', editable: true,suppressSizeToFit: false},
            {headerName: 'thursday', field: 'thursday', editable: true,suppressSizeToFit: false},
            {headerName: 'friday', field: 'friday', editable: true,suppressSizeToFit: false},
            {headerName: 'saturday', field: 'saturday', editable: true,suppressSizeToFit: false},
            {headerName: 'sunday', field: 'sunday', editable: true,suppressSizeToFit: false},
            {headerName: 'start_date', field: 'start_date', editable: true,suppressSizeToFit: false},
            {headerName: 'end_date', field: 'end_date', editable: true,suppressSizeToFit: false}
        ],
        calendar_dates: [
            {headerName: 'service_id', field: 'service_id', editable: true},
            {headerName: 'date', field: 'date', editable: true},
            {headerName: 'exception_type', field: 'exception_type', editable: true}
        ],
        fare_attributes: [
            {headerName: 'fare_id', field: 'fare_id', editable: true},
            {headerName: 'price', field: 'price', editable: true},
            {headerName: 'currency_type', field: 'currency_type', editable: true},
            {headerName: 'payment_method', field: 'payment_method', editable: true},
            {headerName: 'transfers', field: 'transfers', editable: true},
            {headerName: 'agency_id', field: 'agency_id', editable: true},
            {headerName: 'transfer_duration', field: 'transfer_duration', editable: true}
        ],
        fare_rules: [
            {headerName: 'fare_id', field: 'fare_id', editable: true},
            {headerName: 'route_id', field: 'route_id', editable: true},
            {headerName: 'origin_id', field: 'origin_id', editable: true},
            {headerName: 'destination_id', field: 'destination_id', editable: true},
            {headerName: 'contains_id', field: 'contains_id', editable: true}
        ],
        shapes: [
            {headerName: 'shape_id', field: 'shape_id', editable: true},
            {headerName: 'shape_pt_lat', field: 'shape_pt_lat', editable: true},
            {headerName: 'shape_pt_lon', field: 'shape_pt_lon', editable: true},
            {headerName: 'shape_pt_sequence', field: 'shape_pt_sequence', editable: true},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled', editable: true}
        ],
        shape_details: [
          {headerName: 'color', field: 'color', editable: true},
          {headerName: 'shape_id', field: 'shape_id', editable: true},
          {headerName: 'shape_long_name', field: 'shape_long_name', editable: true},
          {headerName: 'shape_short_name', field: 'shape_short_name', editable: true}
        ],
        periods: [
          {headerName: 'period', field: 'period', editable: true},
          {headerName: 'calendar_id', field: 'calendar_id', editable: true},
          {headerName: 'end_time', field: 'end_time', editable: true},
          {headerName: 'frequency', field: 'frequency', editable: true},
          {headerName: 'num_trains', field: 'num_trains', editable: true},
          {headerName: 'start_time', field: 'start_time', editable: true}
        ],
        frequencies: [
            {headerName: 'trip_id', field: 'trip_id', editable: true},
            {headerName: 'start_time', field: 'start_time', editable: true},
            {headerName: 'end_time', field: 'end_time', editable: true},
            {headerName: 'headway_secs', field: 'headway_secs', editable: true},
            {headerName: 'exact_times', field: 'exact_times', editable: true}
        ],
        transfers: [
            {headerName: 'from_stop_id', field: 'from_stop_id', editable: true},
            {headerName: 'to_stop_id', field: 'to_stop_id', editable: true},
            {headerName: 'transfer_type', field: 'transfer_type', editable: true},
            {headerName: 'min_transfer_time', field: 'min_transfer_time', editable: true}
        ],
        feed_info: [
            {headerName: 'feed_publisher_name', field: 'feed_publisher_name', editable: true},
            {headerName: 'feed_publisher_url', field: 'feed_publisher_url', editable: true},
            {headerName: 'feed_lang', field: 'feed_lang', editable: true},
            {headerName: 'feed_start_date', field: 'feed_start_date', editable: true},
            {headerName: 'feed_end_date', field: 'feed_end_date', editable: true},
            {headerName: 'feed_version', field: 'feed_version', editable: true}
        ]
    };
}
