import bcrypt from "bcrypt";
import multer from "multer";

export const successResponse = (req, res, data, code = 200) =>
  res.send({
    code,
    data,
    success: true,
  });

export const errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) =>
  res.status(code).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

export const validateFields = (object, fields) => {
  const errors = [];
  fields.forEach((f) => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? `${errors.join(", ")} are required fields.` : "";
};

export const generatePasswordHash = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswordHash = async (password, savedPassword) => {
  return bcrypt.compare(password, savedPassword);
};

export const verificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const diskStorage = () => {
  return multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      // Generate a unique filename for the uploaded file
      // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = file.originalname;
      cb(null, filename);
    },
  });
};
