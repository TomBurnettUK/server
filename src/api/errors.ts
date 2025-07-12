// 400: Bad Request
export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

// 403 Forbidden
export class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

// 404 Not Found
export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
