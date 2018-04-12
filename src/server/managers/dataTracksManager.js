/**
 * @file dataTracksManager.js
 * @author Zishan Iqbal
 * @description This file includes the CURD operations for the dataTracks Model.
 */

import BaseManager from './../managers/baseManager';
import DataTracks from './../models/dataTracks';
import sequelize from './../utils/sequelize';


class DataTracksManager extends BaseManager {

    getEntity() {
        return DataTracks;
    }

    findByInstanceId(instanceId) {
        return DataTracks.findAll({
            where: {
                instanceId: instanceId
            },
            attributes: ['id', 'name', 'description']
        });
    }

    findById(trackId) {
        return DataTracks.findOne({
            where: {
                'id': trackId
            }
        });
    }

    getTracksByUserId(userId) {
        return DataTracks.findAll({
            where: {
                updatedBy: userId
            }
        });
    }

    deleteByTrackId(trackId) {
        return DataTracks.destroy({
            where: {
                id: trackId
            }
        });
    }

    updateById(id, data) {
        return DataTracks.update(data, {
            where: {
                id: id
            }
        });
    }

    updateByUserId(userId, data) {
        return DataTracks.update(data, {
            where: {
                updatedBy: userId
            }
        });
    }

    findContainerListByInstanceId(instanceId) {
        let instanceTrackingQuery = "SELECT i.*, t.is_activated FROM element_instance i LEFT JOIN \
    data_tracks t ON i.track_id = t.ID \
    WHERE i.iofog_uuid in (:instanceId) AND (i.track_id = 0 OR t.is_activated = 1)";

        return sequelize.query(instanceTrackingQuery, {
            replacements: {
                instanceId: instanceId
            },
            type: sequelize.QueryTypes.SELECT
        });
    }


    findContainerListWithStatusByInstanceId(instanceId) {
        let instanceTrackingQuery = "SELECT i.*, t.is_activated, s.* FROM element_instance i \
    LEFT JOIN data_tracks t ON i.track_id = t.ID \
    LEFT JOIN element_instance_status s ON i.uuid = s.element_instance_uuid \
    WHERE i.iofog_uuid in (:instanceId) AND (i.track_id = 0 OR t.is_activated = 1)";

        return sequelize.query(instanceTrackingQuery, {
            replacements: {
                instanceId: instanceId
            },
            type: sequelize.QueryTypes.SELECT
        });
    }

    findActiveElementInstanceUUIDs(elementInstanceId) {
        let query = "select ei.UUID from element_instance ei join data_tracks dt where ei.UUID=:elementInstanceId \
        and (dt.is_activated=1 or ei.track_id==0)";

        return sequelize.query(query, {
            replacements: {
                elementInstanceId: elementInstanceId
            },
            type: sequelize.QueryTypes.SELECT
        });
    }
}

const instance = new DataTracksManager();
export default instance;