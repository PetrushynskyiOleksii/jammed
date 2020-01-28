const queries = {
    "coordinates": (route_name) => [
        {"$match": {"route_short_name": route_name}},
        {"$group": {
            "_id": {"route_name": "$route_short_name", "timestamp": "$timestamp"},
            "value": {"$addToSet": {"latitude": "$trip_latitude", "longitude": "$trip_longitude"}}
        }},
        {"$sort": {"_id.timestamp": -1}},
        {"$limit": 1}
    ],
    "avg_distance": (route_name, start, end) => [
        {"$match": {"route_short_name": route_name, "timestamp": {"$gte": start / 1000, "$lte": end / 1000}}},
        {"$group": {
            "_id": {"route_name": "$route_short_name", "timestamp": "$timestamp"},
            "value": {"$avg": "$trip_distance"}
        }},
        {"$sort": {"_id.timestamp": 1}},
    ],
    "avg_speed": (route_name, start, end) => [
        {"$match": {"route_short_name": route_name, "timestamp": {"$gte": start / 1000, "$lte": end / 1000}}},
        {"$group": {
            "_id": {"route_name": "$route_short_name", "timestamp": "$timestamp"},
            "value": {"$avg": "$trip_speed"},
        }},
        {"$sort": {"_id.timestamp": 1}},
    ],
    "trips_count": (route_name, start, end) => [
        {"$match": {"route_short_name": route_name, "timestamp": {"$gte": start / 1000, "$lte": end / 1000}}},
        {"$group": {
            "_id": {"route_name": "$route_short_name", "timestamp": "$timestamp"},
            "value": { "$sum": 1 },
        }},
        {"$sort": {"_id.timestamp": 1}},
    ],
    "available_routes": (start, end) => [
        {"$match": {"timestamp": {"$gte": start, "$lte": end}, "route_short_name": {"$ne": null}}},
        {"$group": {"_id": "$route_type", "route_names": {"$addToSet": "$route_short_name"}}}
    ]
}

export const getQuery = (queryId, params) => {
    const { routeName, delta = 0 } = params;

    const end = Date.now();
    const start = new Date(end - delta).getTime();

    const queryPattern = queries[queryId];
    const query = queryPattern(routeName, start, end);

    return JSON.stringify(query)
}
