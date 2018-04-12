/**
 * @author elukashick
 */

import async from 'async';
import express from 'express';

const router = express.Router();

import AppUtils from '../../utils/appUtils';
import logger from '../../utils/winstonLogs';
import RegistryService from "../../services/registryService";
import UserService from "../../services/userService";


/********************************************* EndPoints ******************************************************/

/*********** GET listRegistryEndPoint (Get: /api/v2/authoring/registry/list) **********/
const listRegistryEndPoint = function (req, res) {
    logger.info("Endpoint hit: " + req.originalUrl);

    let params = {},
        userProps = {
            userId: 'bodyParams.t',
            setProperty: 'user'
        },
        registryForUserProps = {
            userId: 'user.id',
            setProperty: 'registry'
        };
    params.bodyParams = req.params;
    params.bodyParams.t = req.query.t;

    async.waterfall([
            async.apply(UserService.getUser, userProps, params),
            async.apply(RegistryService.listRegistry, registryForUserProps)
        ],
        function (err, result) {
            AppUtils.sendResponse(res, err, 'registry', params.registry, result);
        });
};
/*********** POST addRegistryEndPoint (Post: /api/v2/authoring/registry/add) **********/
const addRegistryEndPoint = function (req, res) {
    logger.info("Endpoint hit: " + req.originalUrl);

    let params = {},
        userProps = {
            userId: 'bodyParams.t',
            setProperty: 'user'
        },
        registryProps = {
            url: 'bodyParams.url',
            isPublic: 'bodyParams.isPublic',
            username: 'bodyParams.username',
            password: 'bodyParams.password',
            email: 'bodyParams.email',
            userId: 'user.id'
        };

    params.bodyParams = req.body;
    params.bodyParams.t = req.query.t;
    logger.info("Parameters:" + JSON.stringify(params.bodyParams));

    async.waterfall([
            async.apply(UserService.getUser, userProps, params),
            async.apply(RegistryService.addRegistry, registryProps)
        ],
        function (err, result) {
            AppUtils.sendResponse(res, err, 'registry', params.registry, result);
        });
};

/*********** POST deleteRegistryEndPoint (Post: /api/v2/authoring/registry/delete) **********/
const deleteRegistryEndPoint = function (req, res) {
    logger.info("Endpoint hit: " + req.originalUrl);

    let params = {},
        userProps = {
            userId: 'bodyParams.t',
            setProperty: 'user'
        },
        registryProps = {
            id: 'bodyParams.id'
        };

    params.bodyParams = req.body;
    logger.info("Parameters:" + JSON.stringify(params.bodyParams));

    async.waterfall([
            async.apply(UserService.getUser, userProps, params),
            async.apply(RegistryService.deleteRegistry, registryProps)
        ],
        function (err, result) {
            AppUtils.sendResponse(res, err, 'registry', params.registry, result);
        });
};


export default {
    listRegistryEndPoint: listRegistryEndPoint,
    addRegistryEndPoint: addRegistryEndPoint,
    deleteRegistryEndPoint: deleteRegistryEndPoint
};