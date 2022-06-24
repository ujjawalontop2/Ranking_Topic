const successMessage = { status: 'success' };
const errorMessage = { status: 'error' };

const status = {
  success: 200,
  error: 501,
  notfound: 501,
  unauthorized: 501,
  conflict: 501,
  created: 201,
  bad: 501,
  nocontent: 501,
};

const trip_statuses = {
  active: 1.00,
  cancelled: 2.00,
}

export {
  successMessage,
  errorMessage,
  status,
  trip_statuses,
};