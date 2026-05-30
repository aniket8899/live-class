const errorHandler = (err, req, res, next) => {
   let statusCode = err.statusCode || 500;
   let message = err.message || 'Internal Server Error';


   // mongoose validation error
   if(err.name === 'ValidationError'){
    statusCode = 400;
    message=Object.values(err.errors).map((val) => val.message).join(', ');
    }

    // mongoose duplicate key error
    if(err.code === 11000){
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    //jwt
    if(err.name === 'JsonWebTokenError'){
        statusCode = 401;
        message = 'Invalid token';
    }

    console.error("Error: ", err);
    res.status(statusCode).json({
        success: false,
        error: message,
    });

}

export default errorHandler;
     