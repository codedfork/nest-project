import { Response } from "express";

// 200 OK - Standard response for a successful request
export function apiResponseOk(data: any, res: Response) {
    res.status(200).send({ data, status: 200 });
}

// 201 Created - Used when a resource has been successfully created
export function apiResponseCreated(data: any, res: Response) {
    res.status(201).send({ data, status: 201 });
}

// 400 Bad Request - The request is invalid or missing required parameters
export function apiResponseBadRequest(data: any, res: Response) {
    res.status(400).send({ data, status: 400 });
}

// 401 Unauthorized - Authentication is required or failed
export function apiResponseUnauthorized(data: any, res: Response) {
    res.status(401).send({ data, status: 401 });
}

// 403 Forbidden - The client does not have permission to access the resource
export function apiResponseForbidden(data: any, res: Response) {
    res.status(403).send({ data, status: 403 });
}

// 404 Not Found - The requested resource could not be found
export function apiResponseNotFound(data: any, res: Response) {
    res.status(404).send({ data, status: 404 });
}

// 405 Method Not Allowed - The request method is not allowed for the resource
export function apiResponseMethodNotAllowed(data: any, res: Response) {
    res.status(405).send({ data, status: 405 });
}

// 409 Conflict - Indicates a conflict, such as duplicate data
export function apiResponseConflict(data: any, res: Response) {
    res.status(409).send({ data, status: 409 });
}

// 500 Internal Server Error - Used for general server errors
export function apiResponseServerError(data: any, res: Response) {
    res.status(500).send({ data, status: 500 });
}

// 502 Bad Gateway - When an intermediary server (e.g., a proxy or gateway) receives an invalid response from the upstream server
export function apiResponseBadGateway(data: any, res: Response) {
    res.status(502).send({ data, status: 502 });
}

// 503 Service Unavailable - Server is temporarily unavailable (e.g., under maintenance)
export function apiResponseServiceUnavailable(data: any, res: Response) {
    res.status(503).send({ data, status: 503 });
}
