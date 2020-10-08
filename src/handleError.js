const handleError = (error, ERROR_PAGES, push) => {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response);
    push(ERROR_PAGES[error.response.status] || "/error");
  }
};

export { handleError };
