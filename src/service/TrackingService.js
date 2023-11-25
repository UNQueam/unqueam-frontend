import axios from 'axios';
import { handleRequestError } from "@/utils/HttpHelper";

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/tracks',
});

export const track = async (trackData) => {
    if (trackData.isValid()) {
        try {
            await apiService.post("", trackData.asJson());
        } catch (error) {
            if(error.response && error.response.status === 400){
                throw error;
            }
            return handleRequestError(error);
        }
    } else {
        console.log("Cannot track with data: " + trackData.toString())
    }
};

export const getMetricTracks = async (trackData) => {
    if (trackData.isValid()) {
        try {
            const response = await apiService.get("", { params: trackData.asJson() });
            return response.data
        } catch (error) {
            if(error.response && error.response.status === 400){
                throw error;
            }
            return handleRequestError(error);
        }
    } else {
        console.log("Cannot get metrics report with data: " + trackData.toString())
    }
}

export class TrackData {
    trackingEntity;
    trackingType;
    entityId;

    constructor(trackingEntity, trackingType, entityId) {
        this.trackingEntity = trackingEntity;
        this.trackingType = trackingType;
        this.entityId = entityId;
    }

    isValid() {
        return this.isPresent(this.trackingType)
            && this.isPresent(this.trackingEntity)
            && this.isPresent(this.entityId);
    }

    isPresent(anObject) {
        return anObject != null;
    }

    asJson() {
        return {
            "tracking_entity": this.trackingEntity,
            "tracking_type": this.trackingType,
            "entity_id": this.entityId
        }
    }
}

export const TrackingEntity = {
    Game: 'GAME',
    PlayGame: 'PLAY_GAME'
};

export const TrackingType = {
    View: 'VIEW',
    Event: 'EVENT'
};
