import iconv from "iconv-lite";
import encodings from "iconv-lite/encodings";
iconv.encodings = encodings;
import { healthCheck } from "./user.controller";
import { successResponse, errorResponse } from "../../helpers";
import { User } from "../../models";

// mock success and error functions
// jest.mock("./../../helpers");

describe("healthCheck", () => {
  // it("should return success response with message", async () => {
  //   const req = {};
  //   const res = {
  //     json: jest.fn(),
  //     status: jest.fn().mockReturnThis(),
  //   };

  //   // Mock the behavior of successResponse
  //   const successResponse = jest.fn((req, res, data) => {
  //     res.json({ code: 200, data, success: true });
  //   });

  //   await healthCheck(req, res, successResponse);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     code: 200,
  //     data: { message: "working" },
  //     success: true,
  //   });
  // });

  it("should return error response with error message", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  
    // Mock the behavior of errorResponse
    const errorResponse = jest.fn((req, res, errorMessage) => {
      res.status(500).json({ error: errorMessage });
    });
  
    // Create a mock implementation that throws an error
    const healthCheckMock = async () => {
      throw new Error("An error occurred");
    };
  
    // Call the healthCheck function with the mock implementation
    await expect(healthCheckMock(req, res)).rejects.toThrow("An error occurred");
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "An error occurred" });
  });
  
});
