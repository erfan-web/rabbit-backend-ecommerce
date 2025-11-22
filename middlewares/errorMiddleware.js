const errorHanding = () => {
  return (err, req, res, next) => {
    if (err._message) {
      const errorMessage = err._message;
      return res.status(400).json({ error: errorMessage });
    }
    const errorStatus = err.status || 500;
    const errorMessage = err.message;
    return res.status(errorStatus).json({ error: errorMessage });
  };
};

module.exports = errorHanding;
